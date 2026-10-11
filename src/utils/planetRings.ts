import * as THREE from "three";
import type { RingConfig } from "../constants/cosmicTextures";
import type { SunLitShared } from "./planetMaterial";

/**
 * saturn_ring.png = 1D radial strip (가로 = 안쪽→바깥 Cassini 띠).
 * RingGeometry는 극얇은 원반(입자층) — position.xy 길이로 반경 계산.
 */
const RING_VERT = /* glsl */ `
  uniform float uInnerR;
  uniform float uOuterR;

  varying float vRadial;
  varying float vAngle;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vRadial = (length(position.xy) - uInnerR) / (uOuterR - uInnerR);
    vAngle = atan(position.y, position.x);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const RING_HASH = /* glsl */ `
  float ringHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
`;

/** 고리 평면 원주 방향 terminator + 행성 구체 그림자 */
const RING_LIGHT = /* glsl */ `
  float ringCircumferentialLit(vec3 worldPos, vec3 sunPos, vec3 planetCenter, vec3 planeNormal) {
    vec3 n = normalize(planeNormal);
    vec3 sunDir = normalize(sunPos - worldPos);
    vec3 toFrag = worldPos - planetCenter;

    vec3 toFragPlane = toFrag - dot(toFrag, n) * n;
    float fpLen = length(toFragPlane);
    if (fpLen < 0.001) return 1.0;
    toFragPlane /= fpLen;

    vec3 sunPlane = sunDir - dot(sunDir, n) * n;
    float spLen = length(sunPlane);
    if (spLen < 0.001) return 1.0;
    sunPlane /= spLen;

    float ndl = dot(toFragPlane, sunPlane);
    return smoothstep(-0.12, 0.42, ndl);
  }

  float ringPlanetShadow(vec3 worldPos, vec3 sunPos, vec3 planetCenter, float planetRadius) {
    vec3 sunDir = normalize(sunPos - worldPos);
    vec3 oc = worldPos - planetCenter;
    float b = dot(oc, sunDir);
    float c = dot(oc, oc) - planetRadius * planetRadius;
    float disc = b * b - c;
    if (disc <= 0.0) return 1.0;

    float t = -b - sqrt(disc);
    if (t <= 0.002) return 1.0;

    float pen = smoothstep(0.0, planetRadius * 0.42, t);
    return mix(0.03, 1.0, pen);
  }

  float ringLit(
    vec3 worldPos,
    vec3 sunPos,
    vec3 planetCenter,
    float planetRadius,
    vec3 planeNormal
  ) {
    float lit = ringCircumferentialLit(worldPos, sunPos, planetCenter, planeNormal);
    lit *= ringPlanetShadow(worldPos, sunPos, planetCenter, planetRadius);
    return lit;
  }
`;

/** 토성 — radial strip + 얼음 입자 반짝임 + 태양 방향 명암 */
const SATURN_RING_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uSunPos;
  uniform vec3 uPlanetCenter;
  uniform float uPlanetRadius;
  uniform vec3 uTint;
  uniform float uOpacity;
  uniform float uDayMul;
  uniform float uNightMul;
  uniform float uDistMul;
  uniform float uHasMap;
  uniform float uTime;

  varying float vRadial;
  varying float vAngle;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  ${RING_HASH}
  ${RING_LIGHT}

  void main() {
    float radial = clamp(vRadial, 0.0, 1.0);
    float edge = smoothstep(0.0, 0.025, radial) * smoothstep(1.0, 0.975, radial);

    vec3 rgb;
    float coverage;
    if (uHasMap > 0.5) {
      rgb = texture2D(uMap, vec2(radial, 0.5)).rgb * uTint;
      float luma = max(max(rgb.r, rgb.g), rgb.b);
      if (luma < 0.035) discard;
      coverage = edge;
      rgb = pow(rgb, vec3(1.2));
    } else {
      discard;
    }

    if (coverage < 0.008) discard;

    vec3 n = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
    float lit = ringLit(vWorldPos, uSunPos, uPlanetCenter, uPlanetRadius, n);

    float sparkle = pow(ringHash(vec2(radial * 280.0, vAngle * 52.0)), 22.0) * lit * 0.35;

    vec3 color = rgb * mix(uNightMul, uDayMul, lit);
    color += vec3(1.0, 0.96, 0.9) * sparkle;
    color *= uDistMul;
    float alpha = coverage * uOpacity * mix(0.28, 1.0, lit);
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;

/** 목성·천왕성·해왕성 — 희미한 먼지 입자 고리 */
const DUST_RING_FRAG = /* glsl */ `
  uniform vec3 uSunPos;
  uniform vec3 uPlanetCenter;
  uniform float uPlanetRadius;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uBandiness;
  uniform float uDayMul;
  uniform float uNightMul;
  uniform float uDistMul;

  varying float vRadial;
  varying float vAngle;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  ${RING_LIGHT}

  void main() {
    float radial = clamp(vRadial, 0.0, 1.0);

    float edge = smoothstep(0.04, 0.14, radial) * smoothstep(0.96, 0.86, radial);
    float bands = mix(1.0, pow(abs(sin(vAngle * 13.0)), 9.0) * 0.45 + 0.55, uBandiness);
    float coverage = edge * bands;
    if (coverage < 0.012) discard;

    vec3 n = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
    float lit = ringLit(vWorldPos, uSunPos, uPlanetCenter, uPlanetRadius, n);

    vec3 color = uColor * mix(uNightMul, uDayMul, lit);
    color *= uDistMul;
    float alpha = coverage * uOpacity * mix(0.25, 1.0, lit);
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;

function equatorialRing(mesh: THREE.Mesh, extraTilt = 0) {
  mesh.rotation.x = -Math.PI / 2 + extraTilt;
  mesh.renderOrder = 2;
}

function ringUniforms(
  cfg: RingConfig,
  shared: SunLitShared,
  innerR: number,
  outerR: number,
  planetRadius: number
) {
  return {
    uInnerR: { value: innerR },
    uOuterR: { value: outerR },
    uSunPos: shared.uSunPos,
    uPlanetCenter: { value: new THREE.Vector3() },
    uPlanetRadius: { value: planetRadius },
    uTint: { value: new THREE.Color(...cfg.tint) },
    uOpacity: { value: cfg.opacity },
    uDayMul: { value: cfg.dayMul },
    uNightMul: { value: cfg.nightMul },
    uDistMul: { value: 1 },
    uTime: { value: 0 },
  };
}

export type RingRuntime = {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
};

export function createSaturnRing(
  planetRadius: number,
  cfg: RingConfig,
  shared: SunLitShared,
  loader: THREE.TextureLoader
): RingRuntime {
  const innerR = planetRadius * cfg.inner;
  const outerR = planetRadius * cfg.outer;

  const geo = new THREE.RingGeometry(innerR, outerR, 256, 1);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      ...ringUniforms(cfg, shared, innerR, outerR, planetRadius),
      uMap: { value: null },
      uHasMap: { value: 0 },
    },
    vertexShader: RING_VERT,
    fragmentShader: SATURN_RING_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const ring = new THREE.Mesh(geo, mat);
  equatorialRing(ring, cfg.tilt);

  if (cfg.texture) {
    loader.load(cfg.texture, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      mat.uniforms.uMap.value = tex;
      mat.uniforms.uHasMap.value = 1;
    });
  }

  return { mesh: ring, material: mat };
}

export function createDustRing(
  planetRadius: number,
  cfg: RingConfig,
  shared: SunLitShared
): RingRuntime {
  const innerR = planetRadius * cfg.inner;
  const outerR = planetRadius * cfg.outer;

  const geo = new THREE.RingGeometry(innerR, outerR, 128, 1);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      ...ringUniforms(cfg, shared, innerR, outerR, planetRadius),
      uColor: { value: new THREE.Color(...cfg.tint) },
      uBandiness: { value: cfg.bandiness },
    },
    vertexShader: RING_VERT,
    fragmentShader: DUST_RING_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const ring = new THREE.Mesh(geo, mat);
  equatorialRing(ring, cfg.tilt);
  return { mesh: ring, material: mat };
}

export function createPlanetRing(
  planetRadius: number,
  cfg: RingConfig,
  shared: SunLitShared,
  loader: THREE.TextureLoader
): RingRuntime {
  return cfg.useTexture
    ? createSaturnRing(planetRadius, cfg, shared, loader)
    : createDustRing(planetRadius, cfg, shared);
}

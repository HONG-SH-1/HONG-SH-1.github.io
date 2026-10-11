import * as THREE from "three";
import type { LightProfile } from "../constants/cosmicTextures";

export type SunLitShared = {
  uSunPos: THREE.IUniform<THREE.Vector3>;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uSunPos;
  uniform sampler2D uNightMap;
  uniform float uHasNight;
  uniform float uHasMap;
  uniform float uDayMul;
  uniform float uNightMul;
  uniform float uNightLightMul;
  uniform float uDistMul;
  uniform vec2 uTerminator;
  uniform vec2 uNightTerm;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vec3 sunDir = normalize(uSunPos - vWorldPos);
    float ndl = dot(normalize(vNormal), sunDir);

    float dayLit = smoothstep(uTerminator.x, uTerminator.y, ndl);
    vec3 dayColor = uHasMap > 0.5 ? texture2D(uMap, vUv).rgb * uDayMul : vec3(0.55) * uDayMul;

    vec3 color;
    if (uHasNight > 0.5 && uHasMap > 0.5) {
      vec3 nightTex = texture2D(uNightMap, vUv).rgb;
      float cityLum = dot(nightTex, vec3(0.299, 0.587, 0.114));
      float city = smoothstep(0.025, 0.11, cityLum);
      vec3 nightColor = nightTex * uNightLightMul * (0.28 + city * 2.0);

      float nightSide = 1.0 - smoothstep(uNightTerm.x, uNightTerm.y, ndl);
      color = mix(nightColor * nightSide, dayColor, dayLit);

      float twilight = smoothstep(0.15, 0.45, dayLit) * (1.0 - smoothstep(0.45, 0.75, dayLit));
      color += vec3(0.1, 0.07, 0.22) * twilight * 0.4;
    } else {
      color = mix(dayColor * uNightMul, dayColor, dayLit);
    }

    color *= uDistMul;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createSunLitShared(): SunLitShared {
  return { uSunPos: { value: new THREE.Vector3() } };
}

export function configureTexture(tex: THREE.Texture): THREE.Texture {
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPlanetBodyMaterial(
  shared: SunLitShared,
  profile: LightProfile,
  map?: THREE.Texture,
  nightMap?: THREE.Texture
): THREE.ShaderMaterial {
  const nightTerm = profile.nightTerm ?? profile.terminator;

  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map ?? null },
      uSunPos: shared.uSunPos,
      uNightMap: { value: nightMap ?? null },
      uHasNight: { value: nightMap ? 1 : 0 },
      uHasMap: { value: map ? 1 : 0 },
      uDayMul: { value: profile.dayMul },
      uNightMul: { value: profile.nightMul },
      uNightLightMul: { value: profile.nightLightMul ?? 3.5 },
      uDistMul: { value: 1 },
      uTerminator: { value: new THREE.Vector2(...profile.terminator) },
      uNightTerm: { value: new THREE.Vector2(...nightTerm) },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
}

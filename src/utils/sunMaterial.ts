import * as THREE from "three";

const NOISE_GLSL = /* glsl */ `
  float sunHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec2 sunHash2(vec2 p) {
    return vec2(sunHash(p), sunHash(p + vec2(19.7, 47.7)));
  }

  float sunNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = sunHash(i);
    float b = sunHash(i + vec2(1.0, 0.0));
    float c = sunHash(i + vec2(0.0, 1.0));
    float d = sunHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float sunFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * sunNoise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  float granulation(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 1.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = sunHash2(n + g) * 0.85 + 0.075;
        vec2 r = g + o - f;
        md = min(md, dot(r, r));
      }
    }
    return md;
  }

  float filaments(vec2 uv, vec2 flow) {
    float a = sunFbm(uv * 16.0 + flow);
    float b = sunFbm(uv * 19.0 - flow * 0.7 + vec2(4.2, 1.8));
    float ridge = 1.0 - abs(a - b);
    ridge = pow(ridge, 5.0);
    float warp = sunFbm(uv * 6.0 + flow * 0.5);
    return ridge * smoothstep(0.35, 0.75, warp);
  }
`;

const SURFACE_VERT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  ${NOISE_GLSL}

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec2 flow = vec2(uTime * 0.012, uTime * 0.008);
    float fine = granulation(uv * 48.0 + flow);
    float coarse = granulation(uv * 24.0 + flow * 0.6 + vec2(3.0, 1.5));
    float dist = min(fine, coarse);
    float bump = 1.0 - smoothstep(0.0, 0.085, dist);

    vec3 displaced = position + normal * bump * 0.018;

    vec4 wp = modelMatrix * vec4(displaced, 1.0);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/** SDO/Hα 스타일 — 텍스처 기반 + granulation + filament + plage */
const SURFACE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uHasMap;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  ${NOISE_GLSL}

  vec3 heatGrade(float heat) {
    vec3 deep = vec3(0.48, 0.06, 0.02);
    vec3 orange = vec3(0.92, 0.32, 0.05);
    vec3 gold = vec3(1.0, 0.72, 0.18);
    vec3 white = vec3(1.0, 0.97, 0.9);
    vec3 c = mix(deep, orange, smoothstep(0.08, 0.38, heat));
    c = mix(c, gold, smoothstep(0.38, 0.68, heat));
    c = mix(c, white, smoothstep(0.68, 0.95, heat));
    return c;
  }

  void main() {
    vec2 flow = vec2(uTime * 0.01, uTime * 0.007);

    vec2 sampleUv = vUv + vec2(sunFbm(vUv * 3.5 + flow), sunFbm(vUv * 3.5 + 30.0 - flow)) * 0.006;
    vec3 tex = uHasMap > 0.5 ? texture2D(uMap, sampleUv).rgb : vec3(0.95, 0.4, 0.08);
    float luma = dot(tex, vec3(0.299, 0.587, 0.114));

    float fine = granulation(vUv * 46.0 + flow * 2.0);
    float coarse = granulation(vUv * 22.0 + flow + vec2(2.0, 4.5));
    float dist = min(fine, coarse);
    float granBright = 1.0 - smoothstep(0.0, 0.09, dist);
    float granLane = smoothstep(0.04, 0.12, dist);

    vec3 color = tex * 1.08;
    color *= 0.82 + granBright * 0.22;
    color *= 1.0 - granLane * 0.18;

    float plageTex = smoothstep(0.52, 0.9, luma);
    float plageProc = pow(sunFbm(vUv * 7.0 + flow), 5.0) * smoothstep(0.55, 0.85, sunFbm(vUv * 3.0));
    float plage = clamp(plageTex * 0.85 + plageProc * 0.35, 0.0, 1.0);
    color = mix(color, vec3(1.0, 0.98, 0.92), plage * 0.8);

    float fil = filaments(vUv, flow);
    color = mix(color, vec3(0.22, 0.05, 0.015), fil * 0.62 * (1.0 - plage * 0.7));

    float heat = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(color, heatGrade(heat), 0.72);

    float mu = max(dot(vNormal, vViewDir), 0.0);
    float limb = pow(mu, 0.24);
    color *= 0.32 + limb * 0.68;

    float chromo = pow(1.0 - mu, 4.0);
    color = mix(color, vec3(0.75, 0.12, 0.03), chromo * 0.45);

    float micro = sunFbm(vUv * 90.0 + flow * 4.0);
    color *= 0.9 + micro * 0.12;

    gl_FragColor = vec4(color * 1.22, 1.0);
  }
`;

const CORONA_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const CORONA_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uTint;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;

  ${NOISE_GLSL}

  void main() {
    float mu = max(dot(vNormal, vViewDir), 0.0);
    float fresnel = pow(1.0 - mu, 5.0);
    float wisps = sunFbm(vUv * 8.0 + vec2(uTime * 0.02, uTime * 0.012));

    float alpha = fresnel * uIntensity * (0.4 + wisps * 0.6);
    vec3 color = uTint * (0.85 + wisps * 0.15);
    gl_FragColor = vec4(color, alpha);
  }
`;

const ARC_VERT = /* glsl */ `
  uniform float uTime;
  varying float vAlong;
  varying float vAlpha;

  void main() {
    vAlong = uv.x;
    vAlpha = 0.55 + 0.45 * sin(uTime * 0.55 + uv.x * 6.283);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ARC_FRAG = /* glsl */ `
  varying float vAlong;
  varying float vAlpha;

  void main() {
    float edge = pow(sin(vAlong * 3.14159), 0.65);
    vec3 color = mix(vec3(0.65, 0.08, 0.02), vec3(1.0, 0.55, 0.12), edge);
    float alpha = edge * vAlpha * 0.75;
    gl_FragColor = vec4(color, alpha);
  }
`;

const FLARE_VERT = /* glsl */ `
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aDir;

  uniform float uTime;
  uniform float uRadius;

  varying float vAlpha;

  void main() {
    float burst = pow(max(0.0, sin(uTime * aSpeed + aPhase)), 8.0);
    vec3 pos = aDir * uRadius * (1.0 + burst * 0.45);
    vAlpha = burst;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (1.5 + burst * 5.0) * (95.0 / max(-mv.z, 1.0));
    gl_Position = projectionMatrix * mv;
  }
`;

const FLARE_FRAG = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(1.0, 0.82, 0.45, vAlpha * core * 0.65);
  }
`;

export type SunRuntime = {
  group: THREE.Group;
  core: THREE.Mesh;
  coronaInner: THREE.Mesh;
  coronaOuter: THREE.Mesh;
  prominenceArcs: THREE.Group;
  flares: THREE.Points;
  surfaceMat: THREE.ShaderMaterial;
  coronaInnerMat: THREE.ShaderMaterial;
  coronaOuterMat: THREE.ShaderMaterial;
  arcMats: THREE.ShaderMaterial[];
  flareMat: THREE.ShaderMaterial;
  light: THREE.PointLight;
};

function randomUnit(): THREE.Vector3 {
  return new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
}

/** 가장자리(limb) 쪽에 홍염 아치 배치 */
function createProminenceArcs(radius: number, count: number): { group: THREE.Group; mats: THREE.ShaderMaterial[] } {
  const group = new THREE.Group();
  const mats: THREE.ShaderMaterial[] = [];

  for (let i = 0; i < count; i++) {
    let axis: THREE.Vector3;
    if (i < count * 0.55) {
      const side = i % 2 === 0 ? 1 : -1;
      axis = new THREE.Vector3(
        side * (0.85 + Math.random() * 0.15),
        (Math.random() - 0.5) * 0.55,
        (Math.random() - 0.5) * 0.55
      ).normalize();
    } else {
      axis = randomUnit();
    }

    const ref = Math.abs(axis.y) > 0.85 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const tangent = new THREE.Vector3().crossVectors(axis, ref).normalize();
    const outward = new THREE.Vector3().crossVectors(axis, tangent).normalize();

    const span = 0.28 + Math.random() * 0.5;
    const lift = 0.22 + Math.random() * 0.42;
    const half = span * 0.5;

    const start = axis.clone().add(tangent.clone().multiplyScalar(-half)).normalize().multiplyScalar(radius);
    const end = axis.clone().add(tangent.clone().multiplyScalar(half)).normalize().multiplyScalar(radius);
    const apex = axis
      .clone()
      .add(outward.clone().multiplyScalar(lift))
      .normalize()
      .multiplyScalar(radius * (1.0 + lift * 0.9));

    const curve = new THREE.QuadraticBezierCurve3(start, apex, end);
    const tubeR = radius * (0.022 + Math.random() * 0.018);
    const geo = new THREE.TubeGeometry(curve, 36, tubeR, 8, false);

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: ARC_VERT,
      fragmentShader: ARC_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 3;
    group.add(mesh);
    mats.push(mat);
  }

  return { group, mats };
}

function createLimbFlares(radius: number, count: number): THREE.Points {
  const dirs: number[] = [];
  const phases: number[] = [];
  const speeds: number[] = [];

  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const v = new THREE.Vector3(
      side * (0.7 + Math.random() * 0.3),
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 0.6
    ).normalize();
    dirs.push(v.x, v.y, v.z);
    phases.push(Math.random() * Math.PI * 2);
    speeds.push(0.2 + Math.random() * 0.55);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(dirs, 3));
  geo.setAttribute("aDir", new THREE.Float32BufferAttribute(dirs, 3));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geo.setAttribute("aSpeed", new THREE.Float32BufferAttribute(speeds, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uRadius: { value: radius } },
    vertexShader: FLARE_VERT,
    fragmentShader: FLARE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const pts = new THREE.Points(geo, mat);
  pts.renderOrder = 4;
  return pts;
}

export function createSun(
  sunGroup: THREE.Group,
  loader: THREE.TextureLoader,
  radius: number,
  textureUrl: string
): SunRuntime {
  const surfaceMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: null },
      uTime: { value: 0 },
      uHasMap: { value: 0 },
    },
    vertexShader: SURFACE_VERT,
    fragmentShader: SURFACE_FRAG,
  });

  const core = new THREE.Mesh(new THREE.SphereGeometry(radius, 128, 128), surfaceMat);
  core.renderOrder = 1;
  sunGroup.add(core);

  loader.load(textureUrl, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 4;
    surfaceMat.uniforms.uMap.value = tex;
    surfaceMat.uniforms.uHasMap.value = 1;
  });

  const coronaInnerMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0.36 },
      uTint: { value: new THREE.Color(0.85, 0.18, 0.05) },
    },
    vertexShader: CORONA_VERT,
    fragmentShader: CORONA_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });

  const coronaOuterMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0.16 },
      uTint: { value: new THREE.Color(0.55, 0.08, 0.02) },
    },
    vertexShader: CORONA_VERT,
    fragmentShader: CORONA_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });

  const coronaInner = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.06, 48, 48), coronaInnerMat);
  const coronaOuter = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.2, 32, 32), coronaOuterMat);
  coronaInner.renderOrder = 0;
  coronaOuter.renderOrder = 0;
  sunGroup.add(coronaInner);
  sunGroup.add(coronaOuter);

  const { group: prominenceArcs, mats: arcMats } = createProminenceArcs(radius, 9);
  sunGroup.add(prominenceArcs);

  const flares = createLimbFlares(radius, 16);
  sunGroup.add(flares);
  const flareMat = flares.material as THREE.ShaderMaterial;

  const light = new THREE.PointLight(0xffe8d0, 6.5, 0, 2);
  sunGroup.add(light);

  return {
    group: sunGroup,
    core,
    coronaInner,
    coronaOuter,
    prominenceArcs,
    flares,
    surfaceMat,
    coronaInnerMat,
    coronaOuterMat,
    arcMats,
    flareMat,
    light,
  };
}

export function animateSun(sun: SunRuntime, t: number, reduced: boolean) {
  const time = reduced ? 0 : t;

  sun.surfaceMat.uniforms.uTime.value = time;
  sun.coronaInnerMat.uniforms.uTime.value = time;
  sun.coronaOuterMat.uniforms.uTime.value = time;
  sun.flareMat.uniforms.uTime.value = time;
  sun.arcMats.forEach((m) => {
    m.uniforms.uTime.value = time;
  });

  if (reduced) return;

  sun.core.rotation.y += 0.0008;
  sun.prominenceArcs.rotation.y += 0.0003;

  sun.core.scale.setScalar(1 + Math.sin(t * 0.8) * 0.003);
  sun.light.intensity = 7.0 + Math.sin(t * 0.9) * 0.3;
}

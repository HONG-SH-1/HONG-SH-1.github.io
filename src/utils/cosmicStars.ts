import * as THREE from "three";

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aBright;
  attribute vec3 aTint;

  uniform float uTime;

  varying float vAlpha;
  varying vec3 vTint;

  void main() {
    float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aPhase * 1.8) + aPhase * 6.2831853);
    vAlpha = aBright * twinkle;
    vTint = aTint;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / max(-mv.z, 1.0));
    gl_PointSize = clamp(gl_PointSize, 0.5, 4.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vTint;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.08, d);
    gl_FragColor = vec4(vTint, vAlpha * core);
  }
`;

export type StarFieldRuntime = {
  points: THREE.Points;
  material: THREE.ShaderMaterial;
};

export function createTwinkleStarField(
  count: number,
  spread: number,
  sizeRange: [number, number],
  brightnessRange: [number, number]
): StarFieldRuntime {
  const positions: number[] = [];
  const sizes: number[] = [];
  const phases: number[] = [];
  const brights: number[] = [];
  const tints: number[] = [];

  for (let i = 0; i < count; i++) {
    positions.push(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    );
    sizes.push(sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]));
    phases.push(Math.random());
    brights.push(brightnessRange[0] + Math.random() * (brightnessRange[1] - brightnessRange[0]));

    const warm = Math.random();
    const r = 0.88 + warm * 0.12;
    const g = 0.9 + (1 - warm) * 0.08;
    const b = 0.95 + (1 - warm) * 0.05;
    tints.push(r, g, b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geo.setAttribute("aBright", new THREE.Float32BufferAttribute(brights, 1));
  geo.setAttribute("aTint", new THREE.Float32BufferAttribute(tints, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, material);
  points.renderOrder = -1;
  return { points, material };
}

export type SkyboxRuntime = {
  group: THREE.Group;
};

export function createMilkyWaySkybox(
  scene: THREE.Scene,
  loader: THREE.TextureLoader,
  textureUrl: string
): SkyboxRuntime {
  const group = new THREE.Group();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(480, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0x080810,
      side: THREE.BackSide,
      depthWrite: false,
    })
  );
  group.add(sky);
  scene.add(group);

  loader.load(textureUrl, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    sky.material = new THREE.MeshBasicMaterial({
      map: tex,
      color: 0xccccdd,
      side: THREE.BackSide,
      depthWrite: false,
    });
  });

  return { group };
}

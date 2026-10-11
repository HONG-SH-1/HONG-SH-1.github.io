/** Solar System Scope equirectangular (2K) — public/images/cosmic/equire/ */
const BASE = import.meta.env.BASE_URL;

function equire(name: string): string {
  return `${BASE}images/cosmic/equire/${name}.jpg`;
}

function extra(name: string): string {
  return `${BASE}images/cosmic/equire/extras/${name}.jpg`;
}

export function cosmicAsset(name: string): string {
  return `${BASE}images/cosmic/${name}.png`;
}

/** 360° 구면 매핑용 (2:1 비율) */
export const COSMIC_TEXTURES = {
  sun: equire("sun"),
  mercury: equire("mercury"),
  venus: equire("venus"),
  earth: equire("earth"),
  mars: equire("mars"),
  jupiter: equire("jupiter"),
  saturn: equire("saturn"),
  uranus: equire("uranus"),
  neptune: equire("neptune"),
  saturnRing: `${BASE}images/cosmic/equire/saturn_ring.png`,
  earthNight: extra("earth_night"),
  earthClouds: extra("earth_clouds"),
  earthNormal: extra("earth_normal"),
  venusAtmosphere: extra("venus_atmosphere"),
  starsMilkyWay: extra("stars"),
} as const;

/** 태양 기준 낮/밤면 밝기 (행성별 튜닝) */
export type LightProfile = {
  dayMul: number;
  nightMul: number;
  terminator: readonly [number, number];
  /** 도시 야간 조명 배율 — night 텍스처 있을 때 */
  nightLightMul?: number;
  /** 불빛 terminator (day 와 별도, 경계선 제어) */
  nightTerm?: readonly [number, number];
};

export const DEFAULT_LIGHT: LightProfile = {
  dayMul: 0.72,
  nightMul: 0.08,
  terminator: [-0.1, 0.34],
};

/** 태양 거리 역제곱 감쇠 — ref(지구 궤도) 기준 */
export const ORBIT_BRIGHTNESS_REF = 44;

export function orbitDistanceFalloff(distance: number, ref = ORBIT_BRIGHTNESS_REF): number {
  const raw = (ref / distance) ** 1.65 * 0.92;
  return Math.max(0.1, Math.min(1, raw));
}

/** RingGeometry — inner/outer = 행성 반지름 배율 */
export type RingConfig = {
  /** true = saturn_ring.png (토성만). 텍스처는 반경 방향 1D strip(가로 결) — 각도로 늘리지 않음 */
  useTexture: boolean;
  texture?: string;
  inner: number;
  outer: number;
  tilt: number;
  opacity: number;
  tint: [number, number, number];
  dayMul: number;
  nightMul: number;
  /** 0=균일, 1=좁은 띠(천왕성) */
  bandiness: number;
};

/** 궤도 — a(장반경), e(이심률), meanMotion(평균 각속도) */
export type OrbitConfig = {
  semiMajor: number;
  eccentricity: number;
  meanMotion: number;
};

/** 3D 구체 — radius, spinSpeed(자전), tilt(축 기울기 rad) */
export const ORBITAL_BODIES = [
  {
    name: "mercury",
    distance: 26,
    radius: 1.1,
    orbit: { semiMajor: 26, eccentricity: 0.206, meanMotion: 0.035 },
    spinSpeed: 0.008,
    tilt: 0.034,
    texture: COSMIC_TEXTURES.mercury,
    light: { dayMul: 0.92, nightMul: 0.1, terminator: [-0.08, 0.32] },
  },
  {
    name: "venus",
    distance: 34,
    radius: 1.6,
    orbit: { semiMajor: 34, eccentricity: 0.007, meanMotion: 0.018 },
    spinSpeed: -0.002,
    tilt: 0.05,
    texture: COSMIC_TEXTURES.venus,
    atmosphere: COSMIC_TEXTURES.venusAtmosphere,
    light: { dayMul: 0.82, nightMul: 0.018, terminator: [-0.06, 0.28] },
  },
  {
    name: "earth",
    distance: 44,
    radius: 1.7,
    orbit: { semiMajor: 44, eccentricity: 0.017, meanMotion: 0.012 },
    spinSpeed: 0.012,
    tilt: 0.41,
    texture: COSMIC_TEXTURES.earth,
    night: COSMIC_TEXTURES.earthNight,
    clouds: COSMIC_TEXTURES.earthClouds,
    normal: COSMIC_TEXTURES.earthNormal,
    light: {
      dayMul: 0.86,
      nightMul: 0.12,
      terminator: [-0.08, 0.33],
      nightLightMul: 6.2,
      nightTerm: [-0.25, 0.05],
    },
  },
  {
    name: "mars",
    distance: 54,
    radius: 1.3,
    orbit: { semiMajor: 54, eccentricity: 0.093, meanMotion: 0.009 },
    spinSpeed: 0.011,
    tilt: 0.44,
    texture: COSMIC_TEXTURES.mars,
  },
  {
    name: "jupiter",
    distance: 72,
    radius: 3.8,
    orbit: { semiMajor: 72, eccentricity: 0.048, meanMotion: 0.003 },
    spinSpeed: 0.028,
    tilt: 0.054,
    texture: COSMIC_TEXTURES.jupiter,
    ring: {
      useTexture: false,
      inner: 1.2,
      outer: 1.52,
      tilt: 0.04,
      opacity: 0.28,
      tint: [0.2, 0.18, 0.16],
      dayMul: 0.45,
      nightMul: 0.06,
      bandiness: 0,
    } satisfies RingConfig,
  },
  {
    name: "saturn",
    distance: 94,
    radius: 3.2,
    /** 공전 주기 ~29.5년 — meanMotion은 시각화용으로 스케일 */
    orbit: { semiMajor: 94, eccentricity: 0.056, meanMotion: 0.0012 },
    spinSpeed: 0.022,
    /** 축 기울기 26.7° — 고리는 자전축과 일체 */
    tilt: 0.466,
    texture: COSMIC_TEXTURES.saturn,
    light: { dayMul: 0.62, nightMul: 0.04, terminator: [-0.1, 0.36] },
    ring: {
      useTexture: true,
      texture: COSMIC_TEXTURES.saturnRing,
      inner: 1.52,
      outer: 2.42,
      tilt: 0,
      opacity: 0.95,
      tint: [1, 1, 1],
      dayMul: 0.68,
      nightMul: 0.04,
      bandiness: 0,
    } satisfies RingConfig,
  },
  {
    name: "uranus",
    distance: 114,
    radius: 2.5,
    orbit: { semiMajor: 114, eccentricity: 0.046, meanMotion: 0.0005 },
    spinSpeed: 0.009,
    tilt: 1.7,
    texture: COSMIC_TEXTURES.uranus,
    light: { dayMul: 0.62, nightMul: 0.05, terminator: [-0.1, 0.34] },
    ring: {
      useTexture: false,
      inner: 1.34,
      outer: 2.0,
      tilt: 0.08,
      opacity: 0.38,
      tint: [0.14, 0.14, 0.16],
      dayMul: 0.38,
      nightMul: 0.05,
      bandiness: 1,
    } satisfies RingConfig,
  },
  {
    name: "neptune",
    distance: 132,
    radius: 2.55,
    orbit: { semiMajor: 132, eccentricity: 0.011, meanMotion: 0.0003 },
    spinSpeed: 0.008,
    tilt: 0.49,
    texture: COSMIC_TEXTURES.neptune,
    light: { dayMul: 0.82, nightMul: 0.045, terminator: [-0.08, 0.34] },
    ring: {
      useTexture: false,
      inner: 1.3,
      outer: 1.82,
      tilt: 0.12,
      opacity: 0.3,
      tint: [0.1, 0.12, 0.18],
      dayMul: 0.4,
      nightMul: 0.05,
      bandiness: 0.35,
    } satisfies RingConfig,
  },
] as const;

export const SUN_RADIUS = 8.5;

export function resolveLight(data: (typeof ORBITAL_BODIES)[number]): LightProfile {
  return "light" in data && data.light ? data.light : DEFAULT_LIGHT;
}

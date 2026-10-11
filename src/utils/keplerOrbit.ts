import * as THREE from "three";

/** 케플러 방정식 M = E − e·sin(E) — 뉴턴 반복 */
export function solveKeplerE(meanAnomaly: number, eccentricity: number): number {
  const twoPi = Math.PI * 2;
  let M = meanAnomaly % twoPi;
  if (M < 0) M += twoPi;

  let E = eccentricity < 0.8 ? M : Math.PI;
  for (let i = 0; i < 10; i++) {
    E = M + eccentricity * Math.sin(E);
  }
  return E;
}

/** 태양(원점) 기준 타원 궤도 위치 — x-z 평면 */
export function keplerHeliocentric(
  semiMajor: number,
  eccentricity: number,
  meanAnomaly: number
): { x: number; z: number; r: number } {
  const E = solveKeplerE(meanAnomaly, eccentricity);
  const x = semiMajor * (Math.cos(E) - eccentricity);
  const z = semiMajor * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(E);
  const r = Math.hypot(x, z);
  return { x, z, r };
}

/** 타원 궤도 시각화용 점열 */
export function keplerOrbitPoints(
  semiMajor: number,
  eccentricity: number,
  segments = 128
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const M = (i / segments) * Math.PI * 2;
    const { x, z } = keplerHeliocentric(semiMajor, eccentricity, M);
    pts.push(new THREE.Vector3(x, 0, z));
  }
  return pts;
}

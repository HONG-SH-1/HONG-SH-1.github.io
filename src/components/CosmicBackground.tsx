import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import {
  COSMIC_TEXTURES,
  ORBITAL_BODIES,
  SUN_RADIUS,
  orbitDistanceFalloff,
  resolveLight,
} from "../constants/cosmicTextures";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  configureTexture,
  createPlanetBodyMaterial,
  createSunLitShared,
} from "../utils/planetMaterial";
import { createPlanetRing, type RingRuntime } from "../utils/planetRings";
import { createMilkyWaySkybox, createTwinkleStarField } from "../utils/cosmicStars";
import { createSun, animateSun } from "../utils/sunMaterial";
import { keplerHeliocentric, keplerOrbitPoints } from "../utils/keplerOrbit";

type PlanetRuntime = {
  body: THREE.Mesh;
  ring?: RingRuntime;
  clouds?: THREE.Mesh;
  atmosphere?: THREE.Mesh;
  bodyGroup: THREE.Group;
  spinGroup: THREE.Group;
  meanAnomaly: number;
  meanMotion: number;
  semiMajor: number;
  eccentricity: number;
  spinSpeed: number;
};

function buildPlanet(
  data: (typeof ORBITAL_BODIES)[number],
  index: number,
  total: number,
  shared: ReturnType<typeof createSunLitShared>,
  loader: THREE.TextureLoader,
  solarSystem: THREE.Group
): PlanetRuntime {
  const light = resolveLight(data);
  const { semiMajor, eccentricity, meanMotion } = data.orbit;

  const orbitPts = keplerOrbitPoints(semiMajor, eccentricity, 160);
  const orbit = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orbitPts),
    new THREE.LineBasicMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
    })
  );
  solarSystem.add(orbit);

  const bodyGroup = new THREE.Group();
  bodyGroup.rotation.z = data.tilt;
  solarSystem.add(bodyGroup);

  const spinGroup = new THREE.Group();
  bodyGroup.add(spinGroup);

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius, 48, 48),
    createPlanetBodyMaterial(shared, light)
  );
  spinGroup.add(body);

  let clouds: THREE.Mesh | undefined;
  let atmosphere: THREE.Mesh | undefined;
  let ring: RingRuntime | undefined;

  if ("ring" in data && data.ring) {
    ring = createPlanetRing(data.radius, data.ring, shared, loader);
    spinGroup.add(ring.mesh);
  }

  if ("night" in data && data.night) {
    let dayTex: THREE.Texture | undefined;
    let nightTex: THREE.Texture | undefined;
    const assign = () => {
      if (!dayTex) return;
      body.material = createPlanetBodyMaterial(shared, light, dayTex, nightTex);
    };
    loader.load(data.texture, (tex) => {
      dayTex = configureTexture(tex);
      assign();
    });
    loader.load(data.night, (tex) => {
      nightTex = configureTexture(tex);
      assign();
    });

    clouds = new THREE.Mesh(
      new THREE.SphereGeometry(data.radius * 1.012, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
      })
    );
    spinGroup.add(clouds);
    loader.load(data.clouds, (tex) => {
      const t = configureTexture(tex);
      const m = clouds!.material as THREE.MeshStandardMaterial;
      m.map = t;
      m.alphaMap = t;
      m.needsUpdate = true;
    });
  } else if ("atmosphere" in data && data.atmosphere) {
    loader.load(data.texture, (tex) => {
      const map = configureTexture(tex);
      (body.material as THREE.ShaderMaterial).uniforms.uMap.value = map;
      (body.material as THREE.ShaderMaterial).uniforms.uHasMap.value = 1;
    });

    atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(data.radius * 1.05, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0xffcc88,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    spinGroup.add(atmosphere);
    loader.load(data.atmosphere, (tex) => {
      (atmosphere!.material as THREE.MeshBasicMaterial).map = configureTexture(tex);
      (atmosphere!.material as THREE.MeshBasicMaterial).needsUpdate = true;
    });
  } else {
    loader.load(data.texture, (tex) => {
      const map = configureTexture(tex);
      (body.material as THREE.ShaderMaterial).uniforms.uMap.value = map;
      (body.material as THREE.ShaderMaterial).uniforms.uHasMap.value = 1;
    });
  }

  const meanAnomaly = (index / total) * Math.PI * 2;
  const { x, z } = keplerHeliocentric(semiMajor, eccentricity, meanAnomaly);
  bodyGroup.position.set(x, 0, z);
  const initFalloff = orbitDistanceFalloff(Math.hypot(x, z));
  (body.material as THREE.ShaderMaterial).uniforms.uDistMul.value = initFalloff;

  return {
    body,
    ring,
    clouds,
    atmosphere,
    bodyGroup,
    spinGroup,
    meanAnomaly,
    meanMotion,
    semiMajor,
    eccentricity,
    spinSpeed: data.spinSpeed,
  };
}

/** Equirectangular 3D 태양계 */
export function CosmicBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    camera.position.set(0, 55, 165);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.52,
        0.34,
        0.96
      )
    );
    composer.addPass(new OutputPass());

    scene.add(new THREE.AmbientLight(0x223344, 0.06));

    const loader = new THREE.TextureLoader();
    const sunLit = createSunLitShared();
    const sunWorld = new THREE.Vector3();
    const planetWorld = new THREE.Vector3();
    const skybox = createMilkyWaySkybox(scene, loader, COSMIC_TEXTURES.starsMilkyWay);

    const starFields = [
      createTwinkleStarField(4200, 920, [0.35, 1.1], [0.25, 0.65]),
      createTwinkleStarField(900, 920, [0.9, 2.0], [0.35, 0.85]),
    ];
    starFields.forEach((s) => scene.add(s.points));

    const solarSystem = new THREE.Group();
    solarSystem.rotation.x = Math.PI / 6;
    scene.add(solarSystem);

    const sunGroup = new THREE.Group();
    solarSystem.add(sunGroup);
    const sun = createSun(sunGroup, loader, SUN_RADIUS, COSMIC_TEXTURES.sun);

    const planets = ORBITAL_BODIES.map((data, index) =>
      buildPlanet(data, index, ORBITAL_BODIES.length, sunLit, loader, solarSystem)
    );

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      animateSun(sun, t, reduced);

      sunGroup.getWorldPosition(sunWorld);
      sunLit.uSunPos.value.copy(sunWorld);

      starFields.forEach((s) => {
        s.material.uniforms.uTime.value = reduced ? 0 : t;
      });

      if (!reduced) {
        skybox.group.rotation.y += 0.000035;
        solarSystem.rotation.y += 0.00008;
      }

      planets.forEach((p) => {
        if (!reduced) {
          p.meanAnomaly += p.meanMotion;
          const { x, z } = keplerHeliocentric(p.semiMajor, p.eccentricity, p.meanAnomaly);
          p.bodyGroup.position.set(x, 0, z);

          p.spinGroup.rotation.y += p.spinSpeed;
          if (p.clouds) p.clouds.rotation.y += p.spinSpeed * 0.35;
          if (p.atmosphere) p.atmosphere.rotation.y += p.spinSpeed * 0.15;
          if (p.ring?.material.uniforms.uTime) {
            p.ring.material.uniforms.uTime.value = t;
          }
        }

        const { x, z } = p.bodyGroup.position;
        const falloff = orbitDistanceFalloff(Math.hypot(x, z));
        const bodyMat = p.body.material as THREE.ShaderMaterial;
        bodyMat.uniforms.uDistMul.value = falloff;
        if (p.ring?.material.uniforms.uDistMul) {
          p.ring.material.uniforms.uDistMul.value = falloff;
        }
        if (p.ring?.material.uniforms.uPlanetCenter) {
          p.bodyGroup.getWorldPosition(planetWorld);
          p.ring.material.uniforms.uPlanetCenter.value.copy(planetWorld);
        }
      });

      composer.render();
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [reduced]);

  return (
    <div
      ref={mountRef}
      id="cosmic-bg"
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}

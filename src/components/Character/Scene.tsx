import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

interface SceneProps {
  onLoaded?: () => void;
}

const Scene = ({ onLoaded }: SceneProps) => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    let active = true;
    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let mixer: THREE.AnimationMixer | null = null;
    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let debounce: number | undefined;
    let characterLocal: THREE.Object3D | null = null;

    const landingDiv = document.getElementById("landingDiv");
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    const onResize = () => {
      if (renderer && canvasDiv.current && characterLocal) {
        // Find camera
        const camera = sceneRef.current.getObjectByProperty("isPerspectiveCamera", true) as THREE.PerspectiveCamera;
        if (camera) {
          handleResize(renderer, camera, canvasDiv, characterLocal);
        }
      }
    };

    const init = () => {
      if (!canvasDiv.current || !active) return;

      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to 2 for performance
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();
      scene.add(camera); // Add camera to scene so we can find it in onResize

      const clock = new THREE.Clock();
      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (!active || !gltf) return;

        const animations = setAnimations(gltf);
        hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        characterLocal = gltf.scene;
        scene.add(characterLocal);
        headBone = characterLocal.getObjectByName("spine006") || null;
        screenLight = characterLocal.getObjectByName("screenlight") || null;

        progress.loaded().then(() => {
          if (!active) return;
          setTimeout(() => {
            if (!active) return;
            light.turnOnLights();
            animations.startIntro();
            if (onLoaded) onLoaded();
          }, 1500); // Shorter intro transition delay
        });

        window.addEventListener("resize", onResize);
      });

      document.addEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        if (!active) return;
        animationFrameId = requestAnimationFrame(animate);

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }

        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }

        if (renderer && scene) {
          renderer.render(scene, camera);
        }
      };

      animate();
    };

    // Delay initialization until after the first meaningful paint (idle state)
    const timeoutId = setTimeout(() => {
      init();
    }, 100);

    return () => {
      active = false;
      clearTimeout(timeoutId);
      clearTimeout(debounce);
      cancelAnimationFrame(animationFrameId);

      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
      window.removeEventListener("resize", onResize);

      // Dispose Three.js resources
      const scene = sceneRef.current;
      disposeScene(scene);
      scene.clear();

      if (renderer) {
        if (canvasDiv.current && renderer.domElement.parentNode === canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, []);

  return (
    <>
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </>
  );
};

// Helper function to recursively dispose of Three.js objects
const disposeScene = (scene: THREE.Scene) => {
  scene.traverse((object: any) => {
    if (!object.isMesh) return;

    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat: any) => disposeMaterial(mat));
      } else {
        disposeMaterial(object.material);
      }
    }
  });
};

const disposeMaterial = (material: THREE.Material) => {
  material.dispose();
  for (const key in material) {
    const value = (material as any)[key];
    if (value && typeof value === "object" && value.isTexture) {
      value.dispose();
    }
  }
};

export default Scene;

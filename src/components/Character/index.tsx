import { useState, useEffect, Suspense, lazy } from "react";
import { useLoading } from "../../context/LoadingProvider";
import "./style.css";

const Scene = lazy(() => import("./Scene"));

const CharacterModel = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [show3D, setShow3D] = useState(window.innerWidth > 1024); // Default to false on mobile
  const [isLoaded, setIsLoaded] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // If we bypass the 3D loading (e.g. on mobile by default),
  // instantly complete the site preloader percentage so the site displays.
  useEffect(() => {
    if (!show3D) {
      setLoading(100);
    }
  }, [show3D, setLoading]);

  return (
    <div className="character-wrapper">
      {/* 3D Model WebGL Scene */}
      {show3D && (
        <Suspense fallback={null}>
          <Scene onLoaded={() => setIsLoaded(true)} />
        </Suspense>
      )}

      {/* Static High-Quality WebP Placeholder */}
      {(!show3D || !isLoaded) && (
        <div className="character-placeholder-wrapper">
          <img
            src="/images/avatar-placeholder.webp"
            alt="Sudarshan Pandey 3D Avatar Static Model"
            className="character-placeholder-image"
            width="560"
            height="660"
          />
          {isMobile && !show3D && (
            <button
              className="enable-3d-btn"
              onClick={() => setShow3D(true)}
              aria-label="Load interactive 3D model experience"
            >
              Interactive 3D 🎮
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterModel;

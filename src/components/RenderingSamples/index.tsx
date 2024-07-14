import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';
import clsx from "clsx";
import styles from "./styles.module.css";

type RenderingItem = {
  video: string;
  glb: string;
  title: string;
};

const RenderingList: RenderingItem[] = [
  {
    video: "/video/1.mp4",
    glb: "/glb/1.glb",
    title: "테니스",
  },
  {
    video: "/video/2.mp4",
    glb: "/glb/2.glb",
    title: "골프",
  },
  {
    video: "/video/3.mp4",
    glb: "/glb/3.glb",
    title: "웨이트 트레이닝",
  },
];

function GLBModel({ url, videoRef }: { url: string; videoRef: React.RefObject<HTMLVideoElement> }) {
  const group = useRef<THREE.Group>();
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, group);
  const [center, setCenter] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (scene && center === null) {
      // Compute bounding box and center of the first frame
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      setCenter(center);
      scene.position.sub(center); // e-center the object
      console.log("re-centered - (" + center.x + ", " + center.y + ", " + center.z + ")");
    }
  }, [scene, center]);

  useEffect(() => {
    if (actions && center !== null) {
      const action = actions[Object.keys(actions)[0]];
      action.play();
      action.paused = true;

      const handlePlay = () => {
        action.play();
        if (action.paused) action.paused = false;
        console.log(url + " - play");
      };

      const handlePause = () => {
        action.paused = true;
        console.log(url + " - pause");
      };

      const handleTimeUpdate = () => {
        if (videoRef.current) {
          mixer.setTime(videoRef.current.currentTime);
          console.log(url + " - timeupdate: " + videoRef.current.currentTime);
        }
      };

      const handleSeeking = () => {
        action.paused = false;
        handleTimeUpdate();
      };

      videoRef.current?.addEventListener("play", handlePlay);
      videoRef.current?.addEventListener("pause", handlePause);
      videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);
      videoRef.current?.addEventListener("seeking", handleSeeking);

      return () => {
        videoRef.current?.removeEventListener("play", handlePlay);
        videoRef.current?.removeEventListener("pause", handlePause);
        videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef.current?.removeEventListener("seeking", handleSeeking);
      };
    }
  }, [actions, mixer, videoRef, center]);

  return (
    <primitive ref={group} object={scene} />
  );
}

function RenderingSample({ video, glb, title }: RenderingItem) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="column">
      <div className={clsx("row", styles.title)}>
        <h3>{title}</h3>
      </div>
      <div className="row">
        <div className={clsx(styles.col, styles.videoContainer)}>
          <video ref={videoRef} width="320" height="530" controls>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={clsx(styles.col, styles.threeJsContainer)}>
          <div className={clsx(styles.threeJsRender)}>
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <GLBModel url={glb} videoRef={videoRef} />
              <OrbitControls />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RenderingSamples() {
  return (
    <section className={styles.features}>
      <div className="container">
        {RenderingList.map((props, idx) => (
          <RenderingSample key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
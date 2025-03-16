import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import clsx from "clsx";
import styles from "./styles.module.css";
import axios from "axios";

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

function GLBModel({
  url,
  videoRef,
}: {
  url: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
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
      console.log(
        "re-centered - (" + center.x + ", " + center.y + ", " + center.z + ")"
      );
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

  return <primitive ref={group} object={scene} />;
}

function RenderingSample({ video, glb, title }: RenderingItem) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

function UploadYourVideo() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [url, setURL] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function hashVideoURL(videoURL: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(videoURL);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const handleClick = async () => {
    const videoURL = url.trim();
    if (!videoURL) {
      setError("비디오 URL을 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      // Compute hash of the videoURL
      const refID = await hashVideoURL(videoURL);
      var res = await axios.post(
        "https://pp3d.hovans.com/motion/v1/capture",
        {
          ref_id: refID,
          video_uri: videoURL, // 전체 입력을 하나의 요소로 전송
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5 * 60 * 1000,
        }
      );
      var ref_id = res.data.ref_id;
      res = await axios.post(
        "https://pp3d.hovans.com/graphics/v1/motion-to-3d",
        {
          ref_id: ref_id, // capture 에서 받은 ref_id
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5 * 60 * 1000,
        }
      );
      var glb_path = res.data.glb_path;
      alert(glb_path);
    } catch (err: any) {
      console.error("오류 발생", err);
      setError("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "20px" }}>
      <textarea
        value={url}
        onChange={(e) => setURL(e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          padding: "10px",
          marginTop: "10px",
          border: "1px solid gray",
          borderRadius: "4px",
          resize: "vertical",
        }}
        placeholder="Video URL 을 입력하세요"
      />
      <button
        onClick={handleClick}
        disabled={!url.trim() || isLoading}
        style={{
          padding: "10px",
          backgroundColor: !url.trim() ? "#cccccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: !url.trim() ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        {isLoading ? "처리중..." : "요청"}
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
}
export default function RenderingSamples() {
  return (
    <section className={styles.features}>
      <div className="container" style={{}}>
        {RenderingList.map((props, idx) => (
          <RenderingSample key={idx} {...props} />
        ))}

        <UploadYourVideo />
      </div>
    </section>
  );
}

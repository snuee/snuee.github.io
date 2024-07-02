import React, { useRef } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import styles from "./styles.module.css";

type RenderingItem = {
  youtubeURL: string;
  glbURL: string;
  title: string;
};

const RenderingList: RenderingItem[] = [
  {
    youtubeURL: "https://www.youtube.com/embed/rZPtUUlVLRk",
    glbURL: "/glb/1.glb",
    title: "테니스",
  },
  {
    youtubeURL: "https://youtube.com/embed/ysE834gGPJk",
    glbURL: "/glb/2.glb",
    title: "골프",
  },
  {
    youtubeURL: "https://youtube.com/embed/tZAbY33UOvE",
    glbURL: "/glb/3.glb",
    title: "웨이트 트레이닝",
  },
];

function GLBModel({ url }: { url: string }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  React.useEffect(() => {
    if (actions) {
      actions[Object.keys(actions)[0]].play();
    }
  }, [actions]);

  return <primitive ref={group} object={scene} />;
}

function RenderingSample({ youtubeURL, glbURL, title }: RenderingItem) {
  return (
    <div className="column">
      <div className={clsx("row", styles.title)}>
        <h3>{title}</h3>
      </div>
      <div className="row">
        <div className="col col--2" />
        <div className={clsx("col col--4", styles.videoContainer)}>
          <iframe
            width="350"
            height="530"
            src={youtubeURL}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className={clsx("col col--4", styles.threeJsRender)}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <GLBModel url={glbURL} />
            <OrbitControls />
          </Canvas>
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

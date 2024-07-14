import React, { useRef } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
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

function RenderingSample({ video, glb, title }: RenderingItem) {
  return (
    <div className="column">
      <div className={clsx("row", styles.title)}>
        <h3>{title}</h3>
      </div>
      <div className="row">
        <div className="col col--2" />
        <div className={clsx("col col--4", styles.videoContainer)}>
        <video width="320" height="530" controls>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={clsx("col col--4", styles.threeJsRender)}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <GLBModel url={glb} />
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

import clsx from "clsx";
import styles from "./styles.module.css";

type RenderingItem = {
    youtubeURL: string;
    gltfURL: string;
    title: string;
}

const RenderingList: RenderingItem[] = [
    {
        youtubeURL: "https://www.youtube.com/embed/rZPtUUlVLRk",    // https://youtube.com/embed/4NOQn_vDH7M
        gltfURL: "example.gltf",
        title: "테니스"
    },
    {
        youtubeURL: "https://youtube.com/embed/ysE834gGPJk",   //https://www.youtube.com/embed/kIL5YfGKVXY
        gltfURL: "example.gltf",
        title: "골프"
    },
    {
        youtubeURL: "https://youtube.com/embed/tZAbY33UOvE",
        gltfURL: "example.gltf",
        title: "웨이트"
    },
];

function RenderingSample({ youtubeURL, gltfURL, title }: RenderingItem) {
    return (
        <div className="row">
            <div className={clsx("col col--4", styles.videoContainer)}>
                <div className="videoWrapper">
                    <iframe
                        width="100%"
                        height="640"
                        src={youtubeURL}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="threeJsRender">
                    <div className={styles.threeJsPlaceholder}>{title}</div>
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

import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Motion AI Technology',
    Svg: require('@site/static/img/comments-svgrepo-com.svg').default,
    description: (
      <>
        PP3D는 AI 비전 기술 기반의 3D 자세 분석 및 피드백 시스템입니다. 
      </>
    ),
  },
  {
    title: '2D to 3D Conversion',
    Svg: require('@site/static/img/filmstrip-svgrepo-com.svg').default,
    description: (
      <>
        사용자가 짧은 2D 동영상(예: Reels, Shorts)을 업로드하면, AI 기술을 통해 3D로 변환합니다.
      </>
    ),
  },
  {
    title: 'Feedback System',
    Svg: require('@site/static/img/target-svgrepo-com.svg').default,
    description: (
      <>
        우리의 목표는 스포츠 트레이닝, 개인 운동 루틴 등 다양한 분야에서 사용자의 동작 개선을 도와, 실력 향상은 물론 보다 건강하고 효율적으로 스포츠를 배울 수 있도록 지원하는 것입니다.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

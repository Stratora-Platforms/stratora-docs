import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout description={siteConfig.tagline}>
      <div className={styles.hero}>
        <div className="container">
          <img
            src="img/stratora-logo-transparent.png"
            alt="Stratora"
            className={styles.logo}
          />
          <Heading as="h1" className={styles.title}>
            {siteConfig.title}
          </Heading>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
          <Link className="button button--primary button--lg" to="/docs/getting-started">
            Get Started
          </Link>
        </div>
      </div>
    </Layout>
  );
}

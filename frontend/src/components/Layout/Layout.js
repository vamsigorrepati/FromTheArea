import Head from 'next/head';
import Header from '@components/Header';

import styles from './Layout.module.scss';

const Layout = ({ children, className, mapView, listView, isMapView, user, ...rest }) => {
  return (
    <div data-testid="layout" className={styles.layout}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kit.fontawesome.com/433cb56ac4.js" crossOrigin="anonymous"></script>
      </Head>
      <Header mapView={mapView} listView={listView} isMapView={isMapView}/>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;

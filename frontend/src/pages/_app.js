import "@styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import '../components/Map/leaflet-beautify-marker-icon.css';

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />;
    </NextUIProvider>
  );
}

export default MyApp;

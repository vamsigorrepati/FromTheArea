import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false
});

const Map = (props) => {
  return (
    <div data-testid="map" style={{ width: '100vw', height: 'calc(100vh)', position: 'fixed', top: '0px', left: 0, zIndex: 0}}>
      <DynamicMap {...props} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default Map;

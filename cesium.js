import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOGNhOTQzNy1jYTlmLTQ2ZmMtYThhYy1mZjYyYTdlY2MxOGUiLCJpZCI6MzQ3MzAxLCJpYXQiOjE3NTk2MjQwNzN9.HycGSmupvIlW2PexZ3Wqu-FJyICL1EaEWbU2Z38RClI";
const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayerPicker: false,
  imageryProvider: false,
  baseLayer: false,
  animation: false,
  timeline: false,
  homeButton: false,
  infoBox: false,
  navigationHelpButton: false,
  fullscreenButton: false,
  projectionPicker: false,
  navigationInstructionsInitiallyVisible: false,

});

const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3853546);
const imageryLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);

imageryLayer.minificationFilter = Cesium.TextureMinificationFilter.NEAREST;
imageryLayer.magnificationFilter = Cesium.TextureMagnificationFilter.NEAREST;
// viewer.baseLayer.then(layer => {
//   layer.minificationFilter = Cesium.TextureMinificationFilter.NEAREST;
//   layer.magnificationFilter = Cesium.TextureMagnificationFilter.NEAREST;
// })
// const viewer = new Cesium.Viewer("cesiumContainer")

// async function addImagery(){
//   try{
//     const imageryProvider = new Cesium.IonImageryProvider({assetId:23853546})
//     imageryProvider.enablePickFeatures = false;

//     await imageryProvider.readyPromise;

//     viewer.imageryLayers.addImageryProvider(imageryProvider);

//   }catch(err){
//     console.error(error)
//   }
// }

// addImagery()

const transitData = await Cesium.GeoJsonDataSource.load(
  "https://kiranpl0.github.io/green-aura/milton_transit.geojson",
);
viewer.dataSources.add(transitData);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    -79.857690397918,
    43.48420177480739,
    10000,
  ),
  orientation: {
    heading: 0.0,
    pitch: -1.3,
    roll: 0.0,
  },
});

const apikey =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE4OGU1MjQ0NDdjYzQ2ZDdhZGMxYjUwMmMwZTkzYTg0IiwiaCI6Im11cm11cjY0In0=";

async function generateIsochrome(long, lat) {
  const response = await fetch(
    "https://api.openrouteservice.org/v2/isochrones/foot-walking",
    {
      method: "POST",
      headers: {
        Authorization: apikey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locations: [[long, lat]],
        range: [1200],
      }),
    },
  );

  if (!response.ok) {
    console.error(await response.text());
    return;
  }
  const isochroneGeoJson = await response.json();
  const isochroneDataSourch =
    await Cesium.GeoJsonDataSource.load(isochroneGeoJson);
  viewer.dataSources.add(isochroneDataSourch);
  isochroneDataSourch.entities.values.forEach((entity) => {
    if (entity.polygon) {
      entity.polygon.material = Cesium.Color.CYAN.withAlpha(0.2);
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.BLUE;
    }
  });
}

await generateIsochrome(-79.857690397918, 43.48420177480739);

const point = viewer.entities.add({
  name: "Origin",
  position: Cesium.Cartesian3.fromDegrees(-79.857690397918,43.48420177480739),
  point: {
    pixelSize: 10,
    color: Cesium.Color.GREEN,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  }
})

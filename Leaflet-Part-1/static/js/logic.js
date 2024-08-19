
function createMap(data) {
  // STEP 1: Init the Base Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Step 2: Create the Overlay layers
  let markers = L.markerClusterGroup();
  let heatArray = [];
  let circleArray = [];

  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let location = row.geometry;

    // create marker
    if (location) {
      // extract coord
      let point = [location.coordinates[1], location.coordinates[0]];

      // make marker
      let marker = L.marker(point);
      let popup = `<h1>${row.properties.title}</h1>`;
      marker.bindPopup(popup);
      markers.addLayer(marker);

      // add to heatmap
      heatArray.push(point);

      // create circle
      // define marker (in ths case a circle)
      let cirlceMarker = L.cirlce(point, {
        fillOpacity: 0.75, 
        color: chooseColor(location.coordinates[2]),
        fillColor: chooseColor(location.coordinates[2]),
        radius: markerSize(row.properties.mag)
      }).bindPopup(popup);
        
      cirlceArray.push(circleMarker); 
    }
  }

  // create layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 25,
    blur: 20
  });

  let circleLayer = L.layerGroup(circleArray);

  // tectonic plate layer
  let geo_layer = L.geoJSON(geo_data, {
    style: {
      "color": "fuschia",
      "weight": 5
    }
  });

  // Step 3: BUILD the Layer Controls

  // Only one base layer can be shown at a time.
  let baseLayers = {
    Street: street,
    Topography: topo
  };

  let overlayLayers = {
    Markers: markers,
    Heatmap: heatLayer,
    Circles: circleLayer,
    "Tectonic Plates": geo_layer
  }

  // Step 4: INIT the Map
  let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11,
    layers: [street, markers]
  });


  // Step 5: Add the Layer Control filter + legends as needed
  L.control.layers(baseLayers, overlayLayers).addTo(myMap);

}

function doWork() {
 

  // Assemble the API query URL.
  let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';

  d3.json(url).then(function (data) {
    // console.log(data);

    let data_rows = data.features;
    createMap(data_rows);
  });
}

doWork();

//helper function 
function markerSize(mag) {
    let radius = 1;

    if (mag > 0) {
        radius = mag ** 7;
    }

    return radius 
}

// custom named function
function chooseColor(depth) {
    let color = "black";

  // Switch on borough name
  if (depth <= 10) {
    color = "#98EE00";
  } else if (depth <= 30) {
    color = "#D4EE00";
  } else if (depth <= 50) {
    color = "#EECC00";
  } else if (depth <= 70) {
    color = "#EE9C00";
  } else if (depth <= 90) {
    color = "#EA822C";
  } else {
    color = "#EA2C2C";
  }

}























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

  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let location = row.location;

    // create marker
    if (location) {
      // extract coord
      let point = [location.coordinates[1], location.coordinates[0]];

      // make marker
      let marker = L.marker(point);
      let popup = `<h1>${row.incident_address}</h1><hr><h2>${row.borough}</h2><hr><h3>${row.descriptor} | ${row.created_date}</h3>`;
      marker.bindPopup(popup);
      markers.addLayer(marker);

      // add to heatmap
      heatArray.push(point);
    }
  }

  // create layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 25,
    blur: 20
  });

  // Step 3: BUILD the Layer Controls

  // Only one base layer can be shown at a time.
  let baseLayers = {
    Street: street,
    Topography: topo
  };

  let overlayLayers = {
    Markers: markers,
    Heatmap: heatLayer
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
  let user_inp = "Noise";

  // Store the API query variables.
  // For docs, refer to https://dev.socrata.com/docs/queries/where.html.
  // And, refer to https://dev.socrata.com/foundry/data.cityofnewyork.us/erm2-nwe9.
  let baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
  // Add the dates in the ISO formats
  let date = "$where=created_date between'2023-01-01T00:00:00' and '2024-01-01T00:00:00'";
  // Add the complaint type.
  let complaint = `&complaint_type=${user_inp}`;
  // Add a limit.
  let limit = "&$limit=10000";

  // Assemble the API query URL.
  let url = baseURL + date + complaint + limit;

  d3.json(url).then(function (data) {
    // console.log(data);

    createMap(data);
  });
}

doWork();

// STEP 1: Init the Base Layers

// Define variables for our tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// Step 2: Create the Overlay layers


// Step 3: BUILD the Layer Controls

// Only one base layer can be shown at a time.
let baseLayers = {
  Street: street,
  Topography: topo
};


// Step 4: INIT the Map
let myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 11,
  layers: [street]
});


// Step 5: Add the Layer Control filter + legends as needed
L.control.layers(baseLayers).addTo(myMap);

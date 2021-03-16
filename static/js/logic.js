// Creating map object
var myMap = L.map("mapid", {
    center: [37.0902, -95.7129],
    zoom: 8
  });
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data - earthquakes in the last 1 week
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

// Grab data with d3
// d3.json(geoData, function(data) {

//     // Create a new choropleth layer
//     geojson = L.choropleth(data, {
  
//       // Define what  property in the features to use
//       valueProperty: "MHI2016",
  
//       // Set color scale
//       scale: ["#ffffb2", "#b10026"],
  
//       // Number of breaks in step range
//       steps: 10,
  
//       // q for quartile, e for equidistant, k for k-means
//       mode: "q",
//       style: {
//         // Border color
//         color: "#fff",
//         weight: 1,
//         fillOpacity: 0.8
//       },
  
//       // Binding a pop-up to each layer
//       onEachFeature: function(feature, layer) {
//         layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//           "$" + feature.properties.MHI2016);
//       }
//     }).addTo(myMap);
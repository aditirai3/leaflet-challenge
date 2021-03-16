// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

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

// var geojson;

// Grab data with d3
d3.json(geoData, function(data) {
    geojson = L.geoJSON(data, {
        // Loop through the data and create a marker for each point
        for (var i = 0; i < features.length; i++) {
            // Conditionals for depth
            var color = "";
            if (features[i].geometry.coordinates[2] <= 10) {
                color = "green";
            }
            else if (features[i].geometry.coordinates[2] > 10 && <=30) {
                color = "light green";
            }
            else if (features[i].geometry.coordinates[2] > 30 && <=50) {
                color = "yellow";
            }
            else if (features[i].geometry.coordinates[2] > 50 && <=70) {
                color = "dark orange";
            }
            else if (features[i].geometry.coordinates[2] > 70 && <=90) {
                color = "orange";
            }
            else {
                color = "red";
            }
            // Add circles to map
            L.circle(countries[i].location, {
                fillOpacity: 0.75,
                fillColor: color,
            // Adjust radius
                radius: features[i].geometry.coordinates[2] * 1500
            }).bindPopup("<h3>Name: " + features[i].properties.place + "</h3> <hr> <h3>Magnitude: " + features[i].properties.mag + "</h3>").addTo(myMap);
        }
    }
});
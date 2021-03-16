//JSON Url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Set marker color. Reference: https://github.com/pointhi/leaflet-color-markers
function MarkerColor(depth){
    var color = "";
    if (depth <= 10) {
        color = "#2AAD27";
    }
    else if (depth <= 30) {
        color = "#CAC428";
    }
    else if (depth <= 50) {
        color = "#FFD326";
    }
    else if (depth <= 70) {
        color = "orange";
    }
    else if (depth <= 90) {
        color = "#CB8427";
    }
    else {
        color = "#CB2B3E";
    }
}

function createFeatures(earthquakeData) {

  // Define a function to run once for each feature in the features collection
  // Give each feature a popup describing the place, magnitude, and depth of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Place :" + feature.properties.place +
      "</h3><hr><h3> Magnitude: " + feature.properties.mag + "</h3><hr><h3> Depth: " + feature.geometry.coordinates[2] + "</h3>");
  }

  // Create a GeoJSON layer containing the features collection on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, locat) {
        var circleMkr = {
        radius: 4*feature.properties.mag,
        fillColor: MarkerColor(feature.properties.mag),
        color: "gray",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.75
        };
        return L.circleMarker(locat, circleMkr);
        }
    });
  // Sending earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    // Creating map object
    var myMap = L.map("mapid", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }

//             // Add circles to map
//             L.circle(countries[i].location, {
//                 fillOpacity: 0.75,
//                 fillColor: color,
//             // Adjust radius
//                 radius: features[i].geometry.coordinates[2] * 1500
//             })
//         }
//     }
// });
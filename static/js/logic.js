//JSON Url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Set marker color. Reference: https://www.color-hex.com/
function MarkerColor(depth){
    return depth > 90 ? '#ff5967': 
            depth > 70 ? '#faa35f': 
	          depth > 50 ? '#fbb92e': 
	          depth > 30 ? '#f6de1a' :
	          depth > 10 ? '#dcf900':
	                      '#74af06';
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
        fillColor: MarkerColor(feature.geometry.coordinates[2]),
        weight: 0.25,
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
  
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Grayscale": grayscale
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    // Creating map object
    var myMap = L.map("mapid", {
        center: [37.0902, -95.7129],
        zoom: 3,
        layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  

// Add a legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        depth = [-10, 10, 30, 50, 70, 90]
        labels = []
        for (var i = 0; i < depth.length; i ++) {
            labels.push('<li style="background-color:' + MarkerColor(depth[i] + 1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></li>');
    }
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};
    legend.addTo(myMap);
}
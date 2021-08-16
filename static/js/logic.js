function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    var baseMaps = {
      "Light Map": lightmap
    };
  
    var overlayMaps = {
      "earthquakes": earthquakes
    };
  
    var map = L.map("map", {
      center: [40.73, -120.0059],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    var legend = L.control();
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["<10","10-30","30-50","50-70","70-90","90+"];
    var colors = ["lightgreen","greenyellow","gold","orange","darkorange","red"];
    var labels = [];

 
    var legendInfo = "<h1>Earthquake<br>Depth</h1>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">" + limits[index] + "</li>");
    });

    div.innerHTML += labels.join("");
    return div;
  };

  legend.addTo(map);

  }
  
  function createFeatures(response) {
  
    var earthquakes = response.features;
    
    var quakes = [];

    for (var i=0; i<earthquakes.length; i++) {
        console.log(earthquakes[i].geometry.coordinates);
        var coord = earthquakes[i].geometry.coordinates.slice(0,2);
        var depth = earthquakes[i].geometry.coordinates.slice(2,3);
        console.log(coord);
        console.log(depth);
        quakes.push(L.circleMarker(coord.reverse(), {
            radius: Math.pow(earthquakes[i].properties.mag,2),
            color: getColors(depth)
        }))
    }

    createMap(L.layerGroup(quakes));
  }

  function getColors(depth) {
      if (depth < 10) {
          return "lightgreen"
      }
      else if (depth < 30) {
        return "greenyellow"
      } 
      else if (depth < 50) {
        return "gold"
      } 
      else if (depth < 70) {
        return "orange"
      } 
      else if (depth < 90) {
        return "darkorange"
      } 
      else {
        return "red"
      } 
  }
  
  
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(createFeatures);
  
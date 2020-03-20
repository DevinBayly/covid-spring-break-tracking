// let the editor know that `L` is defined by some code
// included in another file (in this case, `index.html`)
// Note: the code will still work without this line, but without it you
// will see an error in the editor
/* global L */

/* MAP SETUP
*/

// make the map
let map = L.map("mapid", {
  center: [32.253460, -110.911789], // latitude, longitude in decimal degrees (find it on Google Maps with a right click!)
  zoom: 10, // can be 0-22, higher is closer
  scrollWheelZoom: true // don't zoom the map on scroll
});
// add the basemap tiles
L.tileLayer(
  "https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png" // stamen toner tiles
  // stamen toner tiles
).addTo(map);

/* EVENT HANDLERS
   Event handlers are functions that respond to events on the page. These are
   defined first so they can each be attached to the data layer and triggered on
   specific events.
*/

let imgSrcMap
let geojson; // this is global because of resetHighlight

// change style
function highlightFeature(e) {
  let layer = e.target; // highlight the actual feature that should be highlighted
  layer.setStyle({
    weight: 1, // thicker border
    color: "#000", // black
    fillOpacity: 0.3 // a bit transparent
  });
}

// reset to normal style
function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

// zoom to feature (a.k.a. fit the bounds of the map to the bounds of the feature
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

// attach the event handlers to events
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature, // a.k.a. hover
    mouseout: resetHighlight, // a.k.a. no longer hovering
    //click:  // a.k.a. clicking
  });
}

/* GET DATA
   Because the data is in a different file, it must be retrieved asynchronously. This ensures that all of
   the data has been loaded before trying to use it (in this case, add it to the map). Read more about Fetch:
   https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
*/
//get image relations
let prom = fetch("/covid-spring-break-tracking/app/relator.json").then(res => res.json()).then(j => {
  imgSrcMap = j
})
// get the data

prom.then(r => {
  return fetch(
    "/covid-spring-break-tracking/app/geo_json.json"
  )
})
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    // this is where we do things with data
    doThingsWithData(json);
  });

// once the data is loaded, this function takes over
function doThingsWithData(json) {
  // assign colors to each "COALIT" (a.k.a. neighborhood coalition)
  //let colorObj = assignColors(json, "park_type");
  // add the data to the map
  geojson = L.geoJSON(json, {
    // both `style` and `onEachFeature` want a function as a value
    // the function for `style` is defined inline (a.k.a. an "anonymous function")
    // the function for `onEachFeature` is defined earlier in the file
    // so we just set the value to the function name

    onEachFeature: onEachFeature // call onEachFeature
  })
    .bindPopup(function (layer) {
      return `<div><h1>${layer.feature.properties.text}</h1></div>
      <div><img src=/covid-spring-break-tracking/app/${imgSrcMap[layer.feature.properties.url]}  /></div>`; // use the NAME property as the popup value
    })
    .addTo(map); // add it to the map
}

// create an object where each unique value in prop is a key and
// each key has a color as its value
function assignColors(json, prop) {
  // from ColorBrewer http://colorbrewer2.org
  let colors = [
    "#a8ddb5",
    "#33a02c",
    "#80cdc1",
    "#a6d96a",
    "#d7191c"

  ];
  let retob = {}
  json.features.forEach((e, i) => {
    retob[e.properties.objectid] = `${'#' + (function lol(m, s, c) {
      return s[m.floor(m.random() * s.length)] +
        (c && lol(m, s, c - 1));
    })(Math, '0123456789ABCDEF', 4)}`
  })
  console.log(retob)
  return retob;
}


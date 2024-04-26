import Graphic from "@arcgis/core/Graphic";
//import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

export  function DrawLine(draw, view) {
    
    
    let action = draw.create("polygon");

  // PolygonDrawAction.vertex-add
  // Fires when user clicks, or presses the "F" key.
  // Can also be triggered when the "R" key is pressed to redo.
  action.on("vertex-add", function (evt) {
    createPolygonGraphic(evt.vertices, view.current);
  });

  // PolygonDrawAction.vertex-remove
  // Fires when the "Z" key is pressed to undo the last added vertex
  action.on("vertex-remove", function (evt) {
    createPolygonGraphic(evt.vertices,view.current);
  });

  // Fires when the pointer moves over the view
  action.on("cursor-update", function (evt) {
    createPolygonGraphic(evt.vertices,view.current);
  });

  // Add a graphic representing the completed polygon
  // when user double-clicks on the view or presses the "Enter" key
  action.on("draw-complete", function (evt) {
    createPolygonGraphic(evt.vertices,view.current);
    doQuery(view.current)
  });
  
 

}

function createPolygonGraphic(vertices, view){
  view.graphics.removeAll();
  let polygon = {
    type: "polygon", // autocasts as Polygon
    rings: vertices,
    spatialReference: view.spatialReference
  };

  let graphic = new Graphic({
    geometry: polygon,
    symbol: {
      type: "simple-fill", // autocasts as SimpleFillSymbol
      color: [0, 0, 0, 0.2],
      style: "solid",
      outline: {  // autocasts as SimpleLineSymbol
        color: [255, 0, 0],
        width: 1
      }
    }
  });
  view.graphics.add(graphic); 
  

}

function doQuery(view){
    // Query the features in the polygon
    // Create a query and set its geometry parameter to the polygon
    let counties = view.map.layers.find(layer => layer.title === "Counties"); 
    let polygon = view.graphics.items[0].geometry;
    let query = counties.createQuery();
    query.geometry = polygon;
    query.spatialRelationship = "intersects";
    query.returnGeometry = true;
    query.outFields = ["*"];
    counties.queryFeatures(query)
        .then(function(response){
        // Print the total features count to the console
        const selectedCounty = [];
        response.features.forEach(function(feature){
            selectedCounty.push(feature.attributes.NAME);
            
            console.log(feature.attributes.NAME);
            highlightSelectedFeatures(view, response.features);
        });
        console.log("Selected County",selectedCounty);
        
    });
}
function highlightSelectedFeatures(view, features) {
    // Create a graphics array to hold the selected features
    let selectedGraphics = [];
    
    // Loop through each feature
    features.forEach(function(feature) {
        // Create a graphic for each feature
        let graphic = new Graphic({
            geometry: feature.geometry,
            symbol: {
                type: "simple-fill",
                color: [0, 255, 255, 0.5], // Specify the highlight color (light blue with 50% transparency)
                outline: {
                    color: [0, 255, 255, 1], // Specify the outline color (solid blue)
                    width: 1
                }
            }
        });
        
        // Add the graphic to the selected graphics array
        selectedGraphics.push(graphic);
    });
    
    // Clear any existing selection graphics
    view.graphics.removeAll();
    
    // Add the selected graphics to the view
    view.graphics.addMany(selectedGraphics);
}

    
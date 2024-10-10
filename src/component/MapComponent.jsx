import  { useEffect, useRef } from 'react';
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Draw from "@arcgis/core/views/draw/Draw";

import CreateLayerList from './utils/LayerListActions';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
//import GraphicSection from './GraphsSection';
//import getFeatureLayers from './utils/LayerList';
import { DrawLine } from './utils/Draw';
import "@esri/calcite-components/dist/calcite/calcite.css";
import "./Css/MapComponent.css";

import { QueryDate } from './utils/DateFormatter';

import PropTypes from 'prop-types';

function MapComponent({ selectedDate, selectedCounty, activeComponent}) {
  //console.log(activeComponent,selectedDate, selectedCounty)
  const counties = useRef(null);
  let highlightSelect = useRef(null);
  //const [droughtlayer,setDroughtLayer ] = useState(null);
  const view = useRef(null);
  const mapDiv = useRef(null);
  
  const droughtLayer = useRef(null); // Ref for droughtLayer
  const outlookLayer = useRef(null);
 
  ///Date Format
 
  let expression = QueryDate(selectedDate);

  useEffect(() => {
    
    const initializeMap = async () => {
      const webmap = new Map({
        basemap: "streets",
      });
      view.current = new MapView({
        container: mapDiv.current,
        map: webmap,
        center: [-117.1490, 32.7353],
        scale: 10000000,
      });
      //forest layer for the map 
      
      const forest = new MapImageLayer({
        url: "https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/Shared/Forest2015/MapServer",
        title: "Forest",
        sublayers: [
          {
            id: 0,
            visible: true,
            opacity: 0.5,
            title: "Forest Sublayer",
          },
        ],
      });
      webmap.add(forest);
      //admin layer for the map
      counties.current = new FeatureLayer({ // Corrected access to the counties ref
        url: "https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/Shared/Boundaries/MapServer/1",
        title: "Counties",
        highlightOptions: {
          color: [0, 0, 0, 0],
          haloOpacity: 0.9,
          fillOpacity: 0.2,
        },
      });  
      // drought layer for the map    
      webmap.add(counties.current); // Corrected access to the counties ref 
      //widgets for the map
      const basemapGallery = new BasemapGallery({
        view: view.current,
        container: document.createElement("div"),
      });
      const bgExpand = new Expand({
        view: view.current,
        content: basemapGallery.container,
        expandIconClass: "esri-icon-basemap",
      });
      
      
      const layerListExp = new Expand({
        view: view.current,
        content: CreateLayerList(view)
        
      });
      view.current.ui.add(layerListExp, "top-right");


      view.current.ui.add(bgExpand, "top-right");
      //draw tool for the map
      view.current.ui.add("line-button", "top-right");
      const draw = new Draw({
        view: view.current,
      });
      document.getElementById("line-button").onclick = () => {
        // creates and returns an instance of PolyLineDrawAction
        DrawLine(draw, view);  
                     
      }

    };
    initializeMap();
    // Clean-up function to remove event listeners, etc. (not needed in this case)
    // find if there is graphic layer 
    const featureLayer = view.current.map.layers.find(layer => layer.type === "Counties");
    if (featureLayer) {
      console.log("Feature Layer found:", featureLayer);
    }
  },[]);
    
  useEffect(() => {
    // Clean up any existing layers before adding a new one
    if (droughtLayer.current) {
      view.current.map.remove(droughtLayer.current);
    }
    if (outlookLayer.current) {
      view.current.map.remove(outlookLayer.current);
    }

    // Conditionally add layers based on activeComponent
    if (activeComponent === 'Monitor') {
      droughtLayer.current = new FeatureLayer({
        url: 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/1',
        opacity: 0.7,
        definitionExpression:  QueryDate(selectedDate) // Example queryDate logic
      });
      view.current.map.add(droughtLayer.current);
    } else if (activeComponent === 'Outlook') {
      outlookLayer.current = new FeatureLayer({
        url: 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/0',
        opacity: 0.7,
      });
      view.current.map.add(outlookLayer.current);
    }
  }, [activeComponent, selectedDate]);
  useEffect(() => {
    //console.log('Date:', selectedDate, 'County:', selectedCounty);

    const query = counties.current.createQuery(); // Corrected access to the counties ref
    query.where = `NAME = '${selectedCounty}'`;
    query.outFields = ["*"];
    query.returnGeometry = true;  
    
    const fetchData = async () => {    
      const featureLayerView  = await view.current.whenLayerView(counties.current);      
     if(highlightSelect.current){
        highlightSelect.current.remove();
      }
      counties.current.queryFeatures(query).then((feat) => {
      
        view.current.goTo(feat.features);
        highlightSelect.current= featureLayerView.highlight(feat.features);
      });
      // Add any other logic or state updates based on the selected date and county
    };
    
    fetchData();
  },[selectedCounty]);
  useEffect(() => {
    if (droughtLayer.current) {
        droughtLayer.current.definitionExpression = expression;
    }
}, [selectedDate]);
  


  return (
    <div className="map-container">
      <div id="line-button" className="esri-widget esri-widget--buttonesri-interactive" title="Draw polyline" style ={{width: '32px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <span className="esri-icon-polygon" style={{}}></span>
      </div>
     
      <div className="mapDiv" ref={mapDiv}></div>
      
    </div>
  );
}
MapComponent.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Add prop type validation
  selectedCounty: PropTypes.string, // Add prop type validation
  activeComponent: PropTypes.string,
  
};
export default MapComponent;

import  { useEffect, useRef, useState } from 'react';
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
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { set } from 'lodash';

function MapComponent({ selectedDate, selectedCounty, activeComponent, onchart,  setSelectedCountyDraw, selectedCountyDraw}) {
  
  const counties = useRef(null);
  let highlightSelect = useRef(null);
  //const [droughtlayer,setDroughtLayer ] = useState(null);
  const view = useRef(null);
  const mapDiv = useRef(null);
  const buttonGroupDiv = useRef(null);
  const droughtLayer = useRef(null); // Ref for droughtLayer
  const outlookLayer = useRef(null);
  const seasonalLayer = useRef(null);
  let[ id, setId] = useState(2);
 
  ///Date Format
 
  let expression = QueryDate(selectedDate);
  console.log(expression)

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
      
      
     

     
      const expandWidget = new Expand({
        view: view.current,
        content: buttonGroupDiv.current, // Attach the React Button Group using ref
        expandIconClass: "esri-icon-settings",
        open: true,
        expanded: true,
      });
      view.current.ui.add(expandWidget, "top-right")
      view.current.ui.add(bgExpand, "bottom-right");
      //draw tool for the map
      
      const draw = new Draw({
        view: view.current,
      });
      document.getElementById("draw-polygon").onclick = () => {
        // creates and returns an instance of PolyLineDrawAction
        DrawLine(draw, view, setSelectedCountyDraw);  
                     
      }
      document.getElementById('clear-selction').onclick = () => {
        view.current.graphics.removeAll();
        setSelectedCountyDraw([]);
        setSelectedCounty(null);
        if (highlightSelect.current) {
            highlightSelect.current.remove();
        }
    };
    
            // Forest button
            document.getElementById('forest').onclick = () => {
              forest.visible = !forest.visible;
              onForestToggle(forest.visible ? 'pctForestArea' : 'pctArea');
          };


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
    id = selectedDate.getFullYear()- 1998;
      setId(id);
      console.log(id)
    if (droughtLayer.current) {
      view.current.map.remove(droughtLayer.current);
      
    }
    if (outlookLayer.current) {
      view.current.map.remove(outlookLayer.current);
      view.current.map.remove(seasonalLayer.current);
      
    }

    // Conditionally add layers based on activeComponent
    if (activeComponent === 'Monitor') {
      
      droughtLayer.current = new FeatureLayer({
        url: `https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/${id}`,
        opacity: 0.7,
        definitionExpression:  QueryDate(selectedDate) // Example queryDate logic
      });
      view.current.map.add(droughtLayer.current);
    } else if (activeComponent === 'Outlook') {
      outlookLayer.current = new FeatureLayer({
        url: 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/0',
        opacity: 0.7,
      });
      seasonalLayer.current = new FeatureLayer({
        url:"https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/1",
        opacity: 0.7

      })
      view.current.map.add(outlookLayer.current);
      view.current.map.add(seasonalLayer.current);
      if (outlookLayer.current && seasonalLayer.current) {
        if (onchart === '1') {
          outlookLayer.current.visible = false;
          seasonalLayer.current.visible = true;
        } else {
          outlookLayer.current.visible = true;
          seasonalLayer.current.visible = false;
        }
    }

    }
  }, [activeComponent, selectedDate,onchart]);
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


      
      
     <Container ref={buttonGroupDiv}>
      
     <ButtonGroup vertical
                size='sm'
                id="draw"
                title="Draw polyline"
                role="group"
                aria-label="Basic example"
                className="button-group-responsive"
            >
                <Button variant="secondary" className="esri-widget tool btn-expand" id="draw-polygon">
                    Draw<span className="esri-icon-polygon"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool btn-expand" id="clear-selction">
                    Clear<span className="esri-icon-erase"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool btn-expand" id="report">
                    Report<span className="esri-icon-printer"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool btn-expand" id="print">
                    Print<span className="esri-icon-printer"></span>
                </Button>
                <Button variant="secondary" className="esri-widget tool btn-expand" id="forest">
                    Forest<span className="esri-icon-layers"></span>
                </Button>
            </ButtonGroup>
      
     </Container>
      <div className="mapDiv" ref={mapDiv}></div>
      
    </div>
  );
}
MapComponent.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Add prop type validation
  selectedCounty: PropTypes.string, // Add prop type validation
  activeComponent: PropTypes.string,
  onchart:PropTypes.string
  
};
export default MapComponent;

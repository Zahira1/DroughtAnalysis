import { useEffect, useRef } from 'react';
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import TimeSlider from '@arcgis/core/widgets/TimeSlider';



function Timeline () {
  const mapDiv = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
        // Create a new div element
      
      // Create a new Map instance with a basemap
      const webmap = new Map({
        basemap: "streets",
      });

      // Create a new MapView instance with specified options
      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        center: [-117.1490, 32.7353],
        scale: 10000000,
      });

      // Create a new TimeSlider widget
      const timeSlider = new TimeSlider({
        container: document.createElement("div"),
        view: view,
        mode: "time-window", // Set the mode for time slider
        fullTimeExtent: {    // Set the full time extent
          start: new Date(2000, 0, 1), // Example start date
          end: new Date(2025, 11, 31)  // Example end date
        }
      });

      // Add the TimeSlider widget to the view's UI at the bottom
      view.ui.add(timeSlider, "bottom");
    };

    initializeMap();
  }, []);

  // Render the map container
  return(
    <div ref={mapDiv} style={{ height: "88vh", width: "100%" }} />
  ) ;
  
}


export default Timeline;

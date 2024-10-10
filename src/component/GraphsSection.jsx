import React, { useState, useEffect } from 'react';
import { QueryDateandCounty } from './utils/DateFormatter.js';
import PropTypes from 'prop-types';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from "@arcgis/core/rest/support/Query.js";

function GraphsSection({ selectedDate, selectedCounty, activeComponent, selectedCountyDraw, onchart}) {
  const [chartData, setChartData] = useState(null); // For chart data
  const [areaTotal, setAreaTotal] = useState([]); // Total drought area
  const [areaTotalForest, setAreaTotalForest] = useState([]); // Total forest area
  const [forestArea, setForestArea] = useState(0); // Total forest area
  const [countArea, setCountArea] = useState(0); // Total county area
  const [pctArea, setPctArea] = useState([]); // Percentage of drought area

  let countyList;
  const drawArray = selectedCountyDraw || [];
  const countyArray = selectedCounty ? [selectedCounty] : [];
  countyList = (drawArray.length === 0 && countyArray.length === 0) ? ['Texas'] : [...drawArray, ...countyArray];

  useEffect(() => {
    // Query logic depending on the activeComponent
    let monitorurl ="https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/4"
    let id = activeComponent === 'Monitor' ? 28 : 27;
    let url = `https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/${id}`;

    const layer = new FeatureLayer({
      url: url,
      outFields: ["*"],
    });

    // Querying drought data for the selected county and date
    const queryDrought = QueryDateandCounty(selectedDate, countyList);
    const TableQuery = new Query();
    TableQuery.where = queryDrought;
    TableQuery.outFields = ["DM", "ForAcres", "Area"];
    TableQuery.returnGeometry = false;

    // Variables to store drought categories and areas
    let DM = [];
    let Area = [];
    let ForestArea = [];

    layer.queryFeatures(TableQuery).then((response) => {
      const features = response.features;
      features.forEach((feature) => {
        DM.push(feature.attributes.DM);
        Area.push(feature.attributes.Area);
        ForestArea.push(feature.attributes.ForAcres);
      });

      // Set state with the queried data
      setChartData(DM);
      setAreaTotal(Area);
      setAreaTotalForest(ForestArea);

      // Optionally calculate percentage areas or any other data needed for charts
      const totalArea = Area.reduce((acc, area) => acc + area, 0);
      const totalForestArea = ForestArea.reduce((acc, area) => acc + area, 0);
      setCountArea(totalArea);
      setForestArea(totalForestArea);
      setPctArea(Area.map(area => (area / totalArea) * 100)); // Calculate percentage
    });
  }, [selectedDate, selectedCounty, activeComponent, selectedCountyDraw]);

  return (
    <div>
      <h2>Graphs Section</h2>
      <p>Selected Date: {selectedDate.toLocaleDateString()}</p>
      <p>Selected County: {selectedCounty || 'All Counties'}</p>
      <p>Total Drought Area: {countArea} acres</p>
      <p>Total Forest Area: {forestArea} acres</p>
      <div>
        {/* Placeholder for chart visualization */}
        <p>Data for the drought categories (DM) will be displayed in charts here.</p>
        {/* You can integrate chart libraries like Chart.js, Recharts, or D3.js here */}
      </div>
    </div>
  );
}

GraphsSection.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Date prop validation
  selectedCounty: PropTypes.string, // County prop validation
  activeComponent: PropTypes.string, // Component prop validation
  selectedCountyDraw: PropTypes.array, // Drawn counties (if applicable)
};

export default GraphsSection;

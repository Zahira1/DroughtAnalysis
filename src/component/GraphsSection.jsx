import React, { useState, useEffect } from 'react';
import { QueryDateandCounty } from './utils/DateFormatter.js';
import PropTypes from 'prop-types';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from "@arcgis/core/rest/support/Query.js";
import { Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { areaFormatter } from './utils/areaFormatter.js';
ChartJS.register(ArcElement, Tooltip, Legend);

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

  function rounddown(num) {
    return Math.floor(num);
  }

  useEffect(() => {
    // Query logic depending on the activeComponent
    let monitorurl ="https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/4"
    let id = onchart === '1' ? 28 : 27;
    let outlookurl = `https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/${id}`;
    let url = activeComponent=== 'Monitor'?monitorurl: outlookurl
    const layer = new FeatureLayer({
      url: url,
      outFields: ["*"],
    });
    //console.log(layer.url)
    let DM0 = [];
    let DM1 = [];
    let DM2 = [];
    let DM3 = [];
    let DM4 = [];
    let DM0Forest = [];
    let DM1Forest = [];
    let DM2Forest = [];
    let DM3Forest = [];
    let DM4Forest = [];
    let DM0Area = [];
    let DM1Area = [];
    let DM2Area = [];
    let DM3Area = [];
    let DM4Area = [];
    let DM0ForestArea = [];
    let DM1ForestArea = [];
    let DM2ForestArea = [];
    let DM3ForestArea = [];
    let DM4ForestArea = [];

    const countyArea = new FeatureLayer({
      url: "https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/5",
      outFields: ["*"],
  });
  const formatedCountyList = countyList.map((county) => `'${county}'`);
  console.log(formatedCountyList);
  let countyquery = `Name IN (${formatedCountyList})`;
 // console.log(countyquery);
  let areaQuery = new Query();
  areaQuery.where = countyquery;
  areaQuery.outFields = ["*"];
  areaQuery.returnGeometry = false;
  console.log(countyList);
  if (countyList[0] === 'Texas') {
      setCountArea(171891840);
      setForestArea(0);
  } else {
      countyArea.queryFeatures(areaQuery).then((response) => {
          setCountArea(0);
          setForestArea(0);

          const features = response.features;
          let totalCountyArea = 0;
          let totalForestArea = 0;
          features.forEach((feature) => {
              totalCountyArea += feature.attributes.AllAcres;
              totalForestArea += feature.attributes.ForestAcres;
          });
          setCountArea(totalCountyArea);
          setForestArea(totalForestArea);
      });
  }
  let TableQuery = new Query(); // Declare once

  if (activeComponent == 'Monitor') {
      const queryDrought = QueryDateandCounty(selectedDate, countyList);
      TableQuery.where = queryDrought;
      TableQuery.outFields = ["*"];
      TableQuery.returnGeometry = false;
      console.log(queryDrought)
  
  } else if (activeComponent == "Outlook") {
      TableQuery.where = `location IN (${formatedCountyList})`;
      TableQuery.outFields = ["*"];
      TableQuery.returnGeometry = false;
  }
  
    // Querying drought data for the selected county and date
    

    layer.queryFeatures(TableQuery).then((response) => {
      // let totalArea = 0;
      // let totalForestArea = 0;
      setPctArea([]);
      const features = response.features;
      console.log(features)
      features.forEach((feature) => {

        const DMmoni= feature.attributes.DM;
        const DMout = onchart === '1' ? feature.attributes.SDO : feature.attributes.MDO;
        const DM =activeComponent==='Monitor'? DMmoni:DMout
          console.log(DM);
          console.log(feature.attributes.AllAcres);
          switch (DM) {
              case 0:
                  DM0.push(feature.attributes.AllPct);
                  DM0Forest.push(feature.attributes.ForPct);
                  DM0Area.push(feature.attributes.AllAcres);
                  DM0ForestArea.push(feature.attributes.ForAcres);
                  console.log(feature.attributes.AllAcres);
                  break;
              case 1:
                  DM1.push(feature.attributes.AllPct);
                  DM1Forest.push(feature.attributes.ForPct);
                  console.log(feature.attributes.AllAcres);
                  DM1Area.push(feature.attributes.AllAcres);
                  DM1ForestArea.push(feature.attributes.ForAcres);
                  break;
              case 2:
                  DM2.push(feature.attributes.AllPct);
                  DM2Forest.push(feature.attributes.ForPct);
                  DM2Area.push(feature.attributes.AllAcres);
                  DM2ForestArea.push(feature.attributes.ForAcres);
                  console.log(feature.attributes.AllAcres);
                  break;
              case 3:
                  DM3.push(feature.attributes.AllPct);
                  DM3Forest.push(feature.attributes.ForPct);
                  DM3Area.push(feature.attributes.AllAcres);
                  DM3ForestArea.push(feature.attributes.ForAcres);
                  console.log(feature.attributes.AllAcres);
                  break;

              default:
                  break;
          }


      });

        

      const sumDMs = DM0.reduce((a, b) => a + b, 0) + DM1.reduce((a, b) => a + b, 0) + DM2.reduce((a, b) => a + b, 0) + DM3.reduce((a, b) => a + b, 0) + DM4.reduce((a, b) => a + b, 0);
      let sumDMAres = DM0Area.reduce((a, b) => a + b, 0) + DM1Area.reduce((a, b) => a + b, 0) + DM2Area.reduce((a, b) => a + b, 0) + DM3Area.reduce((a, b) => a + b, 0) + DM4Area.reduce((a, b) => a + b, 0);
      let noneArea = countArea - sumDMAres;
      let sunDMForest = DM0Forest.reduce((a, b) => a + b, 0) + DM1Forest.reduce((a, b) => a + b, 0) + DM2Forest.reduce((a, b) => a + b, 0) + DM3Forest.reduce((a, b) => a + b, 0) + DM4Forest.reduce((a, b) => a + b, 0);
      let noneAreaForest = forestArea - sunDMForest;

      //console.log(countArea, "None", noneArea);

      if (countyList.length === 1) {
          //console.log("inside", countyList);
          const pctArea = [rounddown(DM0[0]), rounddown(DM1[0]), rounddown(DM2[0]), rounddown(DM3[0]), rounddown(DM4[0])]
          if (activeComponent=='Monitor'){
            pctArea[5] = rounddown(100 - sumDMs);
          }else{pctArea[4] = rounddown(100 - sumDMs);

          }
          
          setPctArea(pctArea);
          setAreaTotal([areaFormatter(DM0Area), areaFormatter(DM1Area), areaFormatter(DM2Area), areaFormatter(DM3Area), areaFormatter(DM4Area), areaFormatter(noneArea)]);
          //console.log("SumDms",sumDMs);

      } else {
          //console.log("inside", countyList);
          const Area = DM0Area.reduce((a, b) => a + b, 0) + DM1Area.reduce((a, b) => a + b, 0) + DM2Area.reduce((a, b) => a + b, 0) + DM3Area.reduce((a, b) => a + b, 0) + DM4Area.reduce((a, b) => a + b, 0);
          const ForestArea = DM0ForestArea.reduce((a, b) => a + b, 0) + DM1ForestArea.reduce((a, b) => a + b, 0) + DM2ForestArea.reduce((a, b) => a + b, 0) + DM3ForestArea.reduce((a, b) => a + b, 0) + DM4ForestArea.reduce((a, b) => a + b, 0);
         // console.log(Area, ForestArea, sumDMAres)
          const pctArea1 = sumDMs === 0 ? [0, 0, 0, 0, 0, 0] : [
              rounddown((DM0Area.reduce((a, b) => a + b, 0) / countArea) * 100),
              rounddown((DM1Area.reduce((a, b) => a + b, 0) / countArea) * 100),
              rounddown((DM2Area.reduce((a, b) => a + b, 0) / countArea) * 100),
              rounddown((DM3Area.reduce((a, b) => a + b, 0) / countArea) * 100),
              rounddown((DM4Area.reduce((a, b) => a + b, 0) / countArea) * 100),
              // Add a placeholder for the 'None' category
          ];

          const pctForestArea = forestArea === 0 ? [0, 0, 0, 0, 0] : [
              rounddown((DM0ForestArea.reduce((a, b) => a + b, 0) / forestArea) * 100),
              rounddown((DM1ForestArea.reduce((a, b) => a + b, 0) / forestArea) * 100),
              rounddown((DM2ForestArea.reduce((a, b) => a + b, 0) / forestArea) * 100),
              rounddown((DM3ForestArea.reduce((a, b) => a + b, 0) / forestArea) * 100),
              rounddown((DM4ForestArea.reduce((a, b) => a + b, 0) / forestArea) * 100),
              0 // Add a placeholder for the 'None' category
          ];

          const sumOfPercentages = pctArea1.reduce((a, b) => a + b, 0);

          const remainingPercentage = 100 - sumOfPercentages;

          if (activeComponent=='Monitor'){
            pctArea1[5] = remainingPercentage;
          }else{
            pctArea1[4] = remainingPercentage;
          }
          let pctArea;
          pctArea = pctArea1;
         // console.log(pctArea)
          setPctArea(pctArea);
          setAreaTotal([areaFormatter(DM0Area.reduce((a, b) => a + b, 0)),
          areaFormatter(DM1Area.reduce((a, b) => a + b, 0)),
          areaFormatter(DM2Area.reduce((a, b) => a + b, 0)),
          areaFormatter(DM3Area.reduce((a, b) => a + b, 0)),
          areaFormatter(DM4Area.reduce((a, b) => a + b, 0)),
          areaFormatter(noneArea)]);
          setAreaTotalForest([areaFormatter(DM0ForestArea.reduce((a, b) => a + b, 0)),
          areaFormatter(DM1ForestArea.reduce((a, b) => a + b, 0)),
          areaFormatter(DM2ForestArea.reduce((a, b) => a + b, 0)),
          areaFormatter(DM3ForestArea.reduce((a, b) => a + b, 0)),
          areaFormatter(DM4ForestArea.reduce((a, b) => a + b, 0)),
          areaFormatter(noneAreaForest)]);

      }
    });
   console.log(pctArea)

  }, [selectedDate, selectedCounty, activeComponent, selectedCountyDraw, onchart]);
  // console.log("outside",pctArea[0]);
  const chartColor= activeComponent==="Monitor" ? [
                    'rgba(255, 255, 0,1)',
                    'rgba(252, 210, 126, 1)',
                    'rgba(255, 170, 0, 1)',
                    'rgba(230, 0, 0, 1)',
                    'rgba(115, 0, 0, 1)',
                    'rgba(239, 239, 239, 1)'
    ]:[
    'rgba(154, 99, 74,1)',
    'rgba(222, 210, 188, 1)',
    'rgba(178, 172, 105, 1)',
    'rgba(255, 222, 99, 1)',
    'rgba(239, 239, 239,1)',

    ];
    const chartLabel = activeComponent === 'Monitor' 
  ? [
      `${pctArea[0]}% Abnormally Dry, ${areaTotal[0]} acres`, 
      `${pctArea[1]}% Moderate Drought, ${areaTotal[1]} acres`, 
      `${pctArea[2]}% Severe Drought,${areaTotal[2]} acres`, 
      `${pctArea[3]}% Extreme Drought, ${areaTotal[3]} acres`, 
      `${pctArea[4]}% Exceptional Drought,${areaTotal[4]} acres`, 
      `${pctArea[5]}% None, ${areaTotal[5]} acres`
    ] 
  : [
      `${pctArea[0]}% Persist or intensifies,  ${areaTotal[0]} acres`, 
      `${pctArea[1]}% Remains but improves,  ${areaTotal[1]} acres`, 
      `${pctArea[2]}% Removal likely, ${areaTotal[2]} acres`, 
      `${pctArea[3]}% Development likely, ${areaTotal[3]} acres`, 
      `${pctArea[4]}% None, ${areaTotal[4]} acres`
    ];
  const data = {
    labels: chartLabel,
    datasets: [
        {

            data: pctArea,
            backgroundColor: chartColor,
            borderWidth: 0
        },
    ],
};
const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels:{
              font:{
                
                size:16,
                weight:'bold'
              },
                color: 'rgb(255,255,255)',
                textAlign: 'right',

            },
            align:'start'
            
            
        },
        title:{
          display:true,
          text:`${countyList}`,
          color: 'rgb(255,255,255)',
          font:{
            size:20
          }
        }
    },
};

const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '400px',
    margin: '0 auto',
};

  return (
    <div style={containerStyle}>
      
      <Doughnut data={data} options={options} />
      
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


import  {QueryDateandCounty} from './utils/DateFormatter.js';
import PropTypes from 'prop-types';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from "@arcgis/core/rest/support/Query.js";

 function GraphsSection({ selectedDate, selectedCounty }) {

  const queryDrought = QueryDateandCounty(selectedDate,selectedCounty);
  console.log("QueryDrought",queryDrought);
  const layer = new FeatureLayer({
    url: "https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisFinal/MapServer/1",
    definitionExpression: queryDrought,
    outFields: ["*"],
  });
  let TableQuery = new Query();
  TableQuery.where = queryDrought;
  TableQuery.outFields = ["*"];
  let DM =[];
  let Area =[];
  TableQuery.returnGeometry = false;
  layer.queryFeatures(TableQuery).then((response) => {
    const features = response.features;
    features.forEach((feature) => {
     DM.push(feature.attributes.DM)
     Area.push(feature.attributes.ForAcres)
    });
  });

 
 

  return (
    <div>
      <h2>Graphs Section</h2>
      
    </div>
  );
}
GraphsSection.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Add prop type validation
  selectedCounty: PropTypes.string // Add prop type validation
};
export default GraphsSection;
// AboutModal.js
import 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="About Modal"
      ariaHideApp={false} // This is to prevent warnings related to accessibility
    >
      <div>
        <h2>About Forest Drought</h2>
        <p>This application brings together data from U.S. Drought Monitor, U.S. Drought Outlook, and Forest Inventory & Analysis to show where Texas forestland is, has been, or is likely to be under drought conditions and determine how much forestland coincides with each category of drought. Understanding the history and projection of drought conditions in an area helps forest managers make sound management decisions.</p>
        <h3>Getting started</h3>
        <p>
          Click the Monitor button to view current and historical drought conditions. Use the calendar picker to choose the date of conditions 
          shown on the map and in the statistics that will appear in this panel. Click counties on the map to limit the statistics to a particular 
          area, or use the polygon tool to select many counties.
          <br/>
          To view drought projections for the next month or season, click the Outlook button. You can toggle between the monthly and seasonal outlook 
          using the buttons that appear. Click counties on the map to limit the statistics to a particular area, or use the polygon tool to select many counties.
          <br/>
          If no area is selected, results for the whole state will be shown. To clear the selection, right-click on the map and click “Clear Map”.
          <br/>
          To view how drought has progressed over time in the selected area, click the Historical Timeline button. Use the calendar pickers or range box 
          (drag the green handles) to select the beginning and ending dates for the graph. The county selection made on Monitor or Outlook will be applied. 
          To change the selection, go back to Monitor or Outlook, make the desired changes, and then return to Historical Timeline.
          <br/>
          To create a printable PDF document displaying the Monitor or Outlook map, click the Print button. To create a multi-page PDF report with Monitor, 
          Outlook, and Historical Timeline information, click the Report button. The dates specified in Historical Timeline will define the time period for 
          the report; if no dates have been specified, the time period will be the year preceding the date showing in Monitor.
          <br/>
        </p>
        <h3>Resources</h3>
        <p>
          Visit the TFS website for information about effects of drought on Texas trees, properly watering your trees and protecting them from drought damage, 
          assessing tree drought damage, replanting after drought, and more. For more information on drought, how it affects forests, and how to manage forestland in 
          times of drought (particularly from a silvicultural perspective), see this factsheet from PINEMAP.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};
AboutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutModal;

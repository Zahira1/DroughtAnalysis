import './App.css';
//import Outlook from './component/DatePicker.jsx';
import MapComponent from './component/MapComponent'; 
import GraphsSection from './component/GraphsSection';
// Import Timeline
import Timeline from './component/Timeline'; 
import { useState } from 'react';
import './component/Css/Header.css';
import Logo from './assets/starWhite.png';
import AboutModal from './component/AboutModal.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '@esri/calcite-components/dist/components/calcite-button.js';
import CountyPicker from './component/CountyPicker.jsx';
import DatePickerComponent from './component/DatePickerComponent.jsx';
import './component/Css/MapComponent.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Accordion from 'react-bootstrap/Accordion';
import Header from './component/Header.jsx';
import './component/Css/Header.css';

function App() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCounty, setSelectedCounty] = useState(null);
  let [selectedCountyDraw, setSelectedCountyDraw] = useState([]);
  const [url, setURL] = useState(['https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/1']);
  const [activeComponent, setActiveComponent] = useState('Monitor'); // Default to 'Monitor'

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const [radioValue, setRadioValue] = useState('1');

  const radioOptions = [
    { name: 'Seasonal', value: '1' },
    { name: 'Monthly', value: '2' }
  ];

  const handleNavClick = (component, url) => {
    setActiveComponent(component);
    if (url) {
      setURL([url]);
    }
  };

  return (
    <div className="App">
      <>
      <Navbar className="clean-header" expand="lg" sticky="top">
        <Container fluid className="d-flex align-items-center">
          
          {/* Left: Logo + Title */}
          <div className="d-flex align-items-center gap-3">
            <img src={Logo} height="30" alt="Logo" />
            <span className="app-title">Forest Drought</span>
          </div>

          {/* Nav: Monitor / Outlook / Timeline */}
          <Nav className="nav-main">
            {["Monitor", "Outlook", "Timeline"].map((tab) => (
              <Nav.Link
                key={tab}
                className={`nav-item-link ${activeComponent === tab ? "active" : ""}`}
                onClick={() => handleNavClick(tab)}
              >
                {tab.toUpperCase()}
              </Nav.Link>
            ))}
          </Nav>

          {/* Right: About / Contact */}
          <div className="utility-links d-none d-md-flex">
            <span className="utility-link" onClick={openAboutModal}>About</span>
            <span className="utility-link">Contact</span>
          </div>
        </Container>
      </Navbar>


      </>



      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
      
      {activeComponent === 'Timeline' && <Timeline />} {/* Render Timeline component */}
      {(activeComponent === 'Monitor' || activeComponent === 'Outlook') &&
      <div>
      <MapComponent
        selectedDate={selectedDate}
        selectedCounty={selectedCounty}
        activeComponent={activeComponent}
        onchart={radioValue}
        setSelectedCountyDraw={ setSelectedCountyDraw}
        selectedCountyDraw={selectedCountyDraw}
      />
     
      <Accordion className="graphDiv">
        <Accordion.Item>
          <Accordion.Header>Drought Condition</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col xs={5} md={6} lg={6}>
                <CountyPicker onChange={setSelectedCounty} />
              </Col>
              <Col xs={3} md={6} lg={6}>
                {activeComponent === 'Monitor' && (
                  <DatePickerComponent onChange={setSelectedDate} />
                )}
                {activeComponent === 'Outlook' && (
                  <ButtonGroup className="outlookBtnGrp mb-2">
                    {radioOptions.map((radio, idx) => (
                      <ToggleButton
                        className="mb-2 outlookBtn"
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        name="radio"
                        variant={idx % 2 ? 'outline-success' : 'outline-secondary'}
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                )}
              </Col>
            </Row>
            <GraphsSection
              selectedDate={selectedDate}
              selectedCounty={selectedCounty}
              activeComponent={activeComponent}
              onchart={radioValue}
              selectedCountyDraw={selectedCountyDraw}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      </div>
}
    </div>
  );
}

export default App;

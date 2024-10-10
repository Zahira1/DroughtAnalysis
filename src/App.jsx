
import './App.css';
//import Outlook from './component/DatePicker.jsx';
import MapComponent from './component/MapComponent'; 
import GraphsSection from './component/GraphsSection';
//import Timeline from './component/Timeline';
// Remove the unused import statement for 'React'
import  { useState } from 'react';
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

function App() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCounty, setSelectedCounty] = useState(null);
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
      <Navbar expand="lg" className="navbar-expand-lg w-100" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand className="mb-0 h1">
            <img
              src={Logo}
              width="35"
              height="32"
              className="d-inline-block align-top"
              alt="Logo"
            />
            Drought Condition Analysis
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav fill variant="underline" className="nav">
              <Nav.Item>
                <Nav.Link
                  onClick={() => handleNavClick('Monitor', 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/1')}>
                  Monitor
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={() => handleNavClick('Outlook', 'https://tfsgis02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/0')}>
                  Outlook
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleNavClick('Timeline')}>
                  Timeline
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav className="nav-left">
              <Nav.Link className="nav-home" onClick={openAboutModal}>About</Nav.Link>
              <Nav.Link className="nav-home">Home</Nav.Link>
              <Nav.Link className="nav-home">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
      <MapComponent
        selectedDate={selectedDate}
        selectedCounty={selectedCounty}
        activeComponent={activeComponent}
      />
      <Accordion className="graphDiv">
        <Accordion.Item>
          <Accordion.Header>Drought Condition</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col xs={6}>
                <CountyPicker onChange={setSelectedCounty} />
              </Col>
              <Col xs={6}>
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
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default App;


import './App.css';
//import Outlook from './component/DatePicker.jsx';
import MapComponent from './component/MapComponent'; 
import GraphsSection from './component/GraphsSection';
//import Timeline from './component/Timeline';
// Remove the unused import statement for 'React'
import  { useState } from 'react';
import './component/Css/Header.css';
import Logo from './assets/Logo.png';
import AboutModal from './component/AboutModal.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '@esri/calcite-components/dist/components/calcite-button.js';
import CountyPicker from './component/CountyPicker.jsx';
import {  CalciteButton } from '@esri/calcite-components-react';
import DatePickerComponent from './component/DatePickerComponent.jsx';
import './component/Css/MapComponent.css';


function App() {

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const openAboutModal = () => setIsAboutModalOpen(true);
    const closeAboutModal = () => setIsAboutModalOpen(false);  
    let [selectedDate, setSelectedDate] = useState(new Date());
    let [selectedCounty, setSelectedCounty] = useState(null); // Add selectedCounty state

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const handleCountyChange = (county) => {
      setSelectedCounty(county);
    };
   // const [activeComponent, setActiveComponent] = useState('MapComponent'); // Default to MapComponent
    
    //const handleNavClick = (component) => {
     // setActiveComponent(component);
    //};

  return (
    <div className="App">    
       
      <header className='header'>
        <Container>
          <Row>
            <Col xs={1}>
              <img src={Logo} style={{ height: '5vh' }} alt="Logo" />
            </Col>
            <Col xs={8}>
              <h2>Drought Condition</h2>
            </Col>
          </Row>
        </Container>

        <Container className='home2'>
          <a className='home' href='https://tfsweb.tamu.edu/'>Home | </a>
          <a className='home' href='https://texasforestinfo.tamu.edu/contact/'> | Contact</a>
        </Container>
      </header>
     
      <nav className='nav'>
        <CalciteButton kind= "inverse" appearance="transparent" onClick={openAboutModal}>About</CalciteButton>
        <CalciteButton kind= "inverse" appearance="transparent" >Monitor</CalciteButton>
        <CalciteButton kind= "inverse" appearance="transparent">Outlook</CalciteButton>
        <CalciteButton kind= "inverse"  appearance="transparent">Timeline</CalciteButton>
      </nav>

      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />        
    <MapComponent selectedDate={selectedDate} selectedCounty={selectedCounty}/>
    <div className='graphDiv'>
      <Row>
        <Col>
          <DatePickerComponent  onChange={handleDateChange}/>
          <CountyPicker onChange= {handleCountyChange}/>
        </Col>
        <GraphsSection selectedDate={selectedDate} selectedCounty={selectedCounty}></GraphsSection>
      </Row>
    </div>
    
    </div>
  );
}


export default App;

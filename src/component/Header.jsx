import React from "react";
import "./Css/Header.css"; // Optional if you want to apply extra styling
//import Logo from './assets/starWhite.png';
import AboutModal from './AboutModal.jsx';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
function Header({ activeComponent, setActiveComponent }) {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [url, setURL] = useState([
      'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysisAllData/MapServer/1'
    ]);
  
    const handleNavClick = (component, url) => {
      setActiveComponent(component);
      if (url) {
        setURL([url]);
      }
    };
  
    const openAboutModal = () => setIsAboutModalOpen(true);
    const closeAboutModal = () => setIsAboutModalOpen(false);
  
    return (
      <>
        <Navbar className="clean-header" expand="lg" sticky="top">
          <Container fluid className="d-flex align-items-center">
  
            {/* Left: Logo and Title */}
            <div className="d-flex align-items-center gap-3">
              <span className="app-title">Forest Drought</span>
            </div>
  
            {/* Nav Tabs */}
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
  
            {/* About and Contact */}
            <div className="utility-links d-none d-md-flex">
              <span className="utility-link" onClick={openAboutModal}>About</span>
              <span className="utility-link">Contact</span>
            </div>
          </Container>
        </Navbar>
  
        <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
      </>
    );
  }
  

export default Header;

import React, { useState } from 'react'
import './HealthPage.css'
import Navbar from '../../layouts/Navbar/Navbar'
import { Tab, Tabs } from 'react-bootstrap'
import Situation from './Situation/Situation';
import Goal from './Goal/Goal';

function HealthPage() {
    const [tabKey, setTabKey] = useState("durum");
    
  return (
    <>
        <Navbar/>
        <div className="health-page">
            <div className="container mt-5 mb-5">
                <h3 className='text-center'>Ağız ve Diş Sağlığı Takip Sayfası</h3>
                <Tabs 
                    className='mb-4 tabs fill' 
                    activeKey={tabKey}
                    onSelect={(k) => setTabKey(k)}
                >
                    <Tab eventKey="durum" title="Durum">
                        <Situation/>
                    </Tab>       
                    <Tab eventKey="hedef" title="Hedef">
                        <Goal/>
                    </Tab>
                </Tabs>
            </div>
        </div>

        
    </>
  )
}

export default HealthPage
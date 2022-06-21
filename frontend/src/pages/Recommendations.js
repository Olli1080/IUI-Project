import React, { useEffect, useState } from 'react'
import './Recommendations.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

function Recommendations() {
    const allCourses = require('../data/allCourses.json')
    // Gets user data from previous page
    const {state} = useLocation();
    const {user_data, recommendations} = state;

    const[col, setCol]=useState(3)

    useEffect(() => {
        updateDimensions()
        window.addEventListener('resize', updateDimensions);
    })

    const updateDimensions=() => {
        if(window.innerWidth>=1320)
            setCol(3)
        else if(window.innerWidth>=946)
            setCol(4)
        else if(window.innerWidth>=637)
            setCol(6)
        else
            setCol(12)
    }

    const exportData = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(user_data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "user_data.json";
        link.click();
    }
    return (
        <>
            <Container fluid className='top-button-row'>
                <Row>
                    <Col>
                        <a href='/'>
                            <Button className='home-button-recommendations button'>
                                <i className="fa-solid fa-house"></i>
                            </Button>
                        </a>
                    </Col>
                    <Col>
                        <Button className='home-button-recommendations button float-end' onClick={exportData}>
                            <i className="fa-solid fa-file-export"></i>
                        </Button>
                    </Col>
                </Row>
            </Container>
            <h1>Recommendations for you</h1>
            <Container fluid className='recommendations-container'>
                <Row>
                    {recommendations.map(({course, score}, index) => {
                        const item = allCourses.find(({key}) => {
                            return key === course
                        })
                        return (
                            <Col key={index} className={'col-'+col.toString()}>
                                <Card className='course-card'>
                                    <p className="lp">{item.lp} LP</p>
                                    <p className='module-name'>{item.name}</p>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
            <h1>All Courses</h1>
            <Container fluid className='recommendations-container'>
                <Row>
                    {allCourses.map((item, index) => {
                        return (
                            <Col key={index} className={'col-'+col.toString()}>
                                <Card className='course-card'>
                                    <p className="lp">{item.lp} LP</p>
                                    <p className='module-name'>{item.name}</p>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}

export default Recommendations
import React, { useEffect, useState } from 'react'
import './Recommendations.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Recommendations() {
    const allCourses = require('../data/allCourses.json')
    const navigate = useNavigate();
    // Gets user data from previous page
    const {state} = useLocation();
    const {user_data, recommendations} = state;

    const[col, setCol]=useState(3)

    useEffect(() => {
        updateDimensions()
        window.addEventListener('resize', updateDimensions);
    })

    const updateDimensions=() => {
        if(window.innerWidth>=1330)
            setCol(3)
        else if(window.innerWidth>=1002)
            setCol(4)
        else if(window.innerWidth>=674)
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

    const getMinimumSemesterOfCourse=(courseKey)=>{
        const course = allCourses.find(({key}) => {
            return key === courseKey
        })
        let minSemester=100
        course.regular_semester.forEach((regSem)=>{
            let regSemInt=parseInt(regSem)
            if(regSemInt<minSemester)
                minSemester=regSemInt
        })
        return minSemester
    }

    let currentSemester=1
    user_data.forEach(item => {
        if(item.semester>=currentSemester)
            currentSemester=item.semester+1
    })

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
                    <Col style={{textAlign:'center'}}>
                        <Button className='home-button-recommendations button' onClick={()=>{
                            navigate('/course-selector', { state: { userData: user_data } });
                        }}>
                            <i className="fa-solid fa-file-pen"></i>
                        </Button>
                    </Col>
                    <Col>
                        <Button className='home-button-recommendations button float-end' onClick={exportData}>
                            <i className="fa-solid fa-file-export"></i>
                        </Button>
                    </Col>
                </Row>
            </Container>
            <h1 className='recommendations-h1'>Recommendations for you</h1>
            <Container fluid className='recommendations-container'>
                <Row>
                    {recommendations.map(({course, score}, index) => {
                        const item = allCourses.find(({key}) => {
                            return key === course
                        })
                        return (
                            <Col key={index} className={'col-'+col.toString()}>
                                <Card className='course-card'>
                                    <Container className='top-row-container'>
                                        <Row className='top-row'>
                                            <Col className='col-6'>
                                                <p style={getScoreStyle(score)} className='score'>{(Math.floor(score*100)).toString()+'%'}</p>
                                            </Col>
                                            <Col className='col-6'>
                                                <p className="lp">{item.lp} LP</p>
                                            </Col>
                                        </Row>
                                    </Container>
                                    <p className='module-name'>{item.name}</p>
                                    <Card className='semester-card'>
                                        <p key={index} className='semester'>{item.semester}</p>
                                    </Card>
                                    {getMinimumSemesterOfCourse(course)>currentSemester &&
                                        <p className='semester-warning'>
                                            <i className="fa-solid fa-triangle-exclamation"/>
                                            This course may be too early for you.
                                        </p>
                                    }
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
            <h1 className='recommendations-h1'>All Courses</h1>
            <h2 className='recommendations-h2'>Mandatory Courses</h2>
            <Container fluid className='recommendations-container'>
                <Row>
                    {allCourses.map((item, index) => {
                        if(item.type==='mandatory')
                            return (
                                <Col key={index} className={'col-'+col.toString()}>
                                    <Card className='course-card'>
                                        <p className="lp">{item.lp} LP</p>
                                        <p className='module-name'>{item.name}</p>
                                        <Card className='semester-card'>
                                            <p key={index} className='semester'>{item.semester}</p>
                                        </Card>
                                    </Card>
                                </Col>
                            )
                        else return null
                    })}
                </Row>
            </Container>
            <h2 className='recommendations-h2'>Optional Courses</h2>
            <Container fluid className='recommendations-container'>
                <Row>
                    {allCourses.map((item, index) => {
                        if(item.type==='optional')
                            return (
                                <Col key={index} className={'col-'+col.toString()}>
                                    <Card className='course-card'>
                                        <p className="lp">{item.lp} LP</p>
                                        <p className='module-name'>{item.name}</p>
                                        <Card className='semester-card'>
                                            <p key={index} className='semester'>{item.semester}</p>
                                        </Card>
                                    </Card>
                                </Col>
                            )
                        else return null
                    })}
                </Row>
            </Container>
            <h2 className='recommendations-h2'>Practical Courses</h2>
            <Container fluid className='recommendations-container'>
                <Row>
                    {allCourses.map((item, index) => {
                        if(item.type==='practical')
                            return (
                                <Col key={index} className={'col-'+col.toString()}>
                                    <Card className='course-card'>
                                        <p className="lp">{item.lp} LP</p>
                                        <p className='module-name'>{item.name}</p>
                                        <Card className='semester-card'>
                                            <p key={index} className='semester'>{item.semester}</p>
                                        </Card>
                                    </Card>
                                </Col>
                            )
                        else return null
                    })}
                </Row>
            </Container>
        </>
    )
}

function getScoreStyle(score){
    if(score>=0.8)
        return {color: 'green'}
    if(score>=0.5)
        return {color: 'orange'}
    return {color: 'red'}
}

export default Recommendations
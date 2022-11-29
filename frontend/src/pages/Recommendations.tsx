import React, { useEffect, useState, useRef } from 'react'
import './Recommendations.css'
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton, Overlay, Tooltip } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import DetailedView from './DetailedView'
import ReasoningView from './ReasoningView'

import type { State, Response } from '../Utils'

function Recommendations() {
    const navigate = useNavigate();
    // Gets user data from previous page
    const { state } = useLocation();
    const { userData, recommendations, allCourses, showTutorial } = state as State & { recommendations: Response };
    const [col, setCol] = useState(3)
    const [semesterFilter, setSemesterFilter] = useState('All')
    const [courseTypeFilter, setCourseTypeFilter] = useState('All')
    const [showDetail, setShowDetail] = useState(false);
    const [showReasoning, setShowReasoning] = useState(false);
    const [selCourse, setSelCourse] = useState(allCourses[0]);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [showTooltips, setShowTooltips] = useState([false, false, false])

    const tt_target_1 = useRef(null);
    const tt_target_2 = useRef(null);
    const tt_target_3 = useRef(null);


    useEffect(() => {
        updateDimensions()
        window.addEventListener('resize', updateDimensions)
    })

    useEffect(() => {
        if (showTutorial) {
            setTimeout(() => { trigger_next_tooltip(); setTimeout(() => { trigger_next_tooltip(); setTimeout(() => { trigger_next_tooltip(); setTimeout(() => { trigger_next_tooltip(); }, 3000); }, 3000); }, 3000); }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const trigger_next_tooltip = () => {
        setShowTooltips(prev_tt => {
            let ind = prev_tt.findIndex(element => element === true);
            if (ind !== -1) {
                let new_tts = [false, false, false];
                if (ind + 1 === prev_tt.length) {
                    return new_tts;
                }
                new_tts[ind + 1] = true;
                return new_tts;
            }
            let new_tts = [true, false, false];
            return new_tts;
        })
    }

    const updateDimensions = () => {
        if (window.innerWidth >= 1490)
            setCol(3)
        else if (window.innerWidth >= 1110)
            setCol(4)
        else if (window.innerWidth >= 750)
            setCol(6)
        else
            setCol(12)
    }

    const exportData = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(userData)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "user_data.json";
        link.click();
    }

    const getMinimumSemesterOfCourse = (courseKey: string) => {
        const course = allCourses.find(({ key }) => {
            return key === courseKey
        })
        let minSemester = 100
        course?.regular_semester.forEach((regSem) => {
            minSemester = Math.min(regSem, minSemester)
        })
        return minSemester
    }

    const openDetailedView = (course: string) => {
        const searchRes = allCourses.find(c => c.key === course)
        if (!searchRes)
            return
        setSelCourse(searchRes);
        setForceUpdate(!forceUpdate);
        setShowReasoning(false)
        setShowDetail(true);
    }

    const openReasoningView = (course: string) => {
        const searchRes = allCourses.find(c => c.key === course)
        if (!searchRes)
            return
        setSelCourse(searchRes);
        setForceUpdate(!forceUpdate);
        setShowDetail(false)
        setShowReasoning(true);
    }

    let currentSemester = 1
    userData.forEach(item => {
        currentSemester = Math.max(currentSemester, item.semester)
    })

    return (
        <>
            <DetailedView selCourse={selCourse} openModal={showDetail} forceUpdate={forceUpdate} />
            {
                selCourse.key in recommendations.recommendations &&
                <ReasoningView reasoning={recommendations.recommendations[selCourse.key].reasoning} selCourse={selCourse} openModal={showReasoning} forceUpdate={forceUpdate}></ReasoningView>
            }
            <Container fluid className='top-button-row'>
                <Row>
                    <Col>
                        <a href='/'>
                            <Button ref={tt_target_1} className='home-button-recommendations button' title="Home">
                                <i className="fa-solid fa-house"></i>
                            </Button>
                            <Overlay target={tt_target_1.current} show={showTooltips[0]} placement="bottom">
                                <Tooltip id="overlay-example">
                                    Go to home screen
                                </Tooltip>
                            </Overlay>
                        </a>
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                        <Button ref={tt_target_2} className='home-button-recommendations button' title="Modify courses" onClick={() => {
                            navigate('/course-selector', { state: { userData, allCourses: allCourses } })
                        }}>
                            <i className="fa-solid fa-file-pen"></i>
                        </Button>
                        <Overlay target={tt_target_2.current} show={showTooltips[1]} placement="bottom">
                            <Tooltip id="overlay-example">
                                Change grades and scores of courses
                            </Tooltip>
                        </Overlay>
                    </Col>
                    <Col>
                        <Button ref={tt_target_3} className='home-button-recommendations button float-end' title="Export as json" onClick={exportData}>
                            <i className="fa-solid fa-file-export"></i>
                        </Button>
                        <Overlay target={tt_target_3.current} show={showTooltips[2]} placement="bottom">
                            <Tooltip id="overlay-example">
                                Export input data to JSON
                            </Tooltip>
                        </Overlay>
                    </Col>
                </Row>
            </Container>
            <Container fluid className='recommendations-container'>
                <Row className='filter-dropdown-row'>
                    <Col className='col-auto'>
                        <DropdownButton className='filter-dropdown' id="dropdown-basic-button" title={'Semester: ' + semesterFilter}>
                            <Dropdown.Item onClick={() => { setSemesterFilter('Winter') }}>Winter Semester</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setSemesterFilter('Summer') }}>Summer Semester</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setSemesterFilter('All') }}>All</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col className='col-auto'>
                        <DropdownButton className='filter-dropdown' id="dropdown-basic-button" title={'Course Type: ' + courseTypeFilter}>
                            <Dropdown.Item onClick={() => { setCourseTypeFilter('Mandatory') }}>Mandatory</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setCourseTypeFilter('Optional') }}>Optional</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setCourseTypeFilter('Practical') }}>Practical</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setCourseTypeFilter('All') }}>All</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
            </Container>
            <h1 className='recommendations-h1'>Recommendations for you</h1>
            <Container fluid className='recommendations-container'>
                <Row>
                    {Object.entries(recommendations.recommendations).map(([course, { score, reasoning }], index) => {
                        const item = allCourses.find(({ key }) => {
                            return key === course
                        })
                        if (!item || (semesterFilter === 'Winter' && item.semester === 'Summer Semester') || (semesterFilter === 'Summer' && item.semester === 'Winter Semester') || (courseTypeFilter !== 'All' && courseTypeFilter !== item.type))
                            return null
                        return (
                            <>
                                <Col key={index} className={'col-' + col.toString()}>
                                    <Card className='course-card' onClick={() => { openDetailedView(course) }}>
                                        <Container className='top-row-container'>
                                            <Row className='top-row'>
                                                <Col className='col-6'>
                                                    <p style={getScoreStyle(score)} className='score'>{(Math.floor(score * 100)).toString() + '%'}</p>
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
                                        <Button className='explanation-card' onClick={(e) => { openReasoningView(course); e.stopPropagation() }}>Explanation</Button>
                                        {item.type === 'Practical' &&
                                            <p className='practical-course-info'>
                                                <i className="fa-solid fa-circle-info" />
                                                The subject of this course varies. Please refer to a chair for further information.
                                            </p>
                                        }
                                        {getMinimumSemesterOfCourse(course) > currentSemester &&
                                            <p className='semester-warning'>
                                                <i className="fa-solid fa-triangle-exclamation" />
                                                This course may be too early for you.
                                            </p>
                                        }
                                    </Card>
                                </Col>
                            </>
                        )
                    })}
                </Row>
            </Container>
            <h1 className='recommendations-h1 all-courses'>All Courses</h1>
            {(courseTypeFilter === 'All' || courseTypeFilter === 'Mandatory') &&
                <>
                    <h2 className='recommendations-h2'>Mandatory Courses</h2>
                    <Container fluid className='recommendations-container'>
                        <Row>
                            {allCourses.map((item, index) => {
                                if (item.type === 'Mandatory' && (semesterFilter === 'All' || item.semester === 'Every Semester' || (semesterFilter === 'Summer' && item.semester === 'Summer Semester') || (semesterFilter === 'Winter' && item.semester === 'Winter Semester')))
                                    return (
                                        <Col key={index} className={'col-' + col.toString()}>
                                            <Card className='course-card' onClick={() => { openDetailedView(item.key) }}>
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
            }
            {(courseTypeFilter === 'All' || courseTypeFilter === 'Optional') &&
                <>
                    <h2 className='recommendations-h2'>Optional Courses</h2>
                    <Container fluid className='recommendations-container'>
                        <Row>
                            {allCourses.map((item, index) => {
                                if (item.type === 'Optional' && (semesterFilter === 'All' || item.semester === 'Every Semester' || (semesterFilter === 'Summer' && item.semester === 'Summer Semester') || (semesterFilter === 'Winter' && item.semester === 'Winter Semester')))
                                    return (
                                        <Col key={index} className={'col-' + col.toString()}>
                                            <Card className='course-card' onClick={() => { openDetailedView(item.key) }}>
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
            }
            {(courseTypeFilter === 'All' || courseTypeFilter === 'Practical') &&
                <>
                    <h2 className='recommendations-h2'>Practical Courses</h2>
                    <Container fluid className='recommendations-container'>
                        <Row>
                            {allCourses.map((item, index) => {
                                if (item.type === 'Practical' && (semesterFilter === 'All' || item.semester === 'Every Semester' || (semesterFilter === 'Summer' && item.semester === 'Summer Semester') || (semesterFilter === 'Winter' && item.semester === 'Winter Semester')))
                                    return (
                                        <Col key={index} className={'col-' + col.toString()}>
                                            <Card className='course-card' onClick={() => { openDetailedView(item.key) }}>
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
            }


        </>
    )
}

function getScoreStyle(score: number) {
    if (score >= 0.5)
        return { color: 'green' }
    if (score >= 0.25)
        return { color: 'orange' }
    return { color: 'red' }
}

export default Recommendations
import React, { useEffect, useState } from 'react'
import './Recommendations.css'
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton} from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import DetailedView from './DetailedView'

function Recommendations() {
    const navigate = useNavigate();
    // Gets user data from previous page
    const { state } = useLocation();
    const { user_data, recommendations, allCourses, unsavedData } = state;
    const [col, setCol] = useState(3)
    const [semesterFilter, setSemesterFilter] = useState('All')
    const [courseTypeFilter, setCourseTypeFilter] = useState('All')
    const [showDetail, setShowDetail] = useState(false);
    const [selCourse, setSelCourse] = useState(allCourses[0]);
    const [dirty, setDirty]=useState(unsavedData)

    useEffect(() => {
        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        if(dirty)
            window.addEventListener('beforeunload', alertUser)
    },
    // eslint-disable-next-line
    [])

    const alertUser=(e)=>{
        e.preventDefault()
        e.returnValue=''
    }

    const updateDimensions = () => {
        if (window.innerWidth >= 1330)
            setCol(3)
        else if (window.innerWidth >= 1002)
            setCol(4)
        else if (window.innerWidth >= 674)
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
        setDirty(false)
        window.removeEventListener('beforeunload', alertUser)
    }

    const getMinimumSemesterOfCourse = (courseKey) => {
        const course = allCourses.find(({ key }) => {
            return key === courseKey
        })
        let minSemester = 100
        course.regular_semester.forEach((regSem) => {
            let regSemInt = parseInt(regSem)
            if (regSemInt < minSemester)
                minSemester = regSemInt
        })
        return minSemester
    }

    const openDetailedView = (course) => {
        setSelCourse(allCourses.find(c => c.key === course));
        setShowDetail(true);
    }

    let currentSemester = 1
    user_data.forEach(item => {
        if (item.semester >= currentSemester)
            currentSemester = item.semester + 1
    })

    return (
        <>
            <DetailedView selCourse={selCourse} openModal={showDetail}></DetailedView>
            <Container fluid className='top-button-row'>
                <Row>
                    <Col>
                        <a href='/'>
                            <Button className='home-button-recommendations button'>
                                <i className="fa-solid fa-house"></i>
                            </Button>
                        </a>
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                        <Button className='home-button-recommendations button' onClick={() => {
                            window.removeEventListener('beforeunload', alertUser)
                            navigate('/course-selector', { state: { userData: user_data, allCourses: allCourses, dirty: dirty } })
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
                    {recommendations.map(({ course, score }, index) => {
                        const item = allCourses.find(({ key }) => {
                            return key === course
                        })
                        if ((semesterFilter === 'Winter' && item.semester === 'Summer Semester') || (semesterFilter === 'Summer' && item.semester === 'Winter Semester') || (courseTypeFilter !== 'All' && courseTypeFilter !== item.type))
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

function getScoreStyle(score) {
    if (score >= 0.5)
        return { color: 'green' }
    if (score >= 0.25)
        return { color: 'orange' }
    return { color: 'red' }
}

export default Recommendations
import React, { useState, useEffect } from 'react'
import './CourseSelector.css'
import { Container, Row, Col, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { sendDataToBackend } from '../Utils'
import Loading from './Loading'
import { useLocation } from 'react-router-dom'

function CourseSelector() {
    const {state} = useLocation();
    const {userData, allCourses, dirty}=state
    const navigate = useNavigate();
    const [currentCourseIndex, setCurrentCourseIndex] = useState(-1)
    const [semesterOfCurrentCourse, setSemesterOfCurrentCourse] = useState(-1) //-1: not set, 0: >6th
    const [likeCurrentCourse, setLikeCurrentCourse] = useState(-1) //-1: not set, 0: like, 1: neutral, 2: dislike
    const [gradeOfCurrentCourse, setGradeOfCurrentCourse] = useState(-1)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    let [unsavedData, setUnsavedData]=useState(dirty)

    const selectedCourses = useState(new Array(allCourses.length).fill(false))[0]
    const grades = ['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '5.0']

    userData.forEach(userDataItem => {
        selectedCourses[getIndexByKey(userDataItem.course, allCourses)]=true
    })

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const alertUser=(e)=>{
        e.preventDefault()
        e.returnValue=''
    }

    const showNextCourse = () => {
        if (currentCourseIndex !== -1 && (semesterOfCurrentCourse === -1 || likeCurrentCourse === -1 || gradeOfCurrentCourse === -1)) {
            setErrorMessage('Please fill in all the fields.')
            return
        }
        if (currentCourseIndex === -1) {
            let userDataToDelete = []
            userData.forEach((item, index) => {
                const courseIndex=getIndexByKey(item.course, allCourses)
                if (!selectedCourses[courseIndex])
                    userDataToDelete.push(index)
            })
            let offset=0
            userDataToDelete.forEach(index => {
                userData.splice(index-offset, 1)
                offset++
            })
        }
        else
            storeAndResetData()
        if (currentCourseIndex === selectedCourses.length - 1) {
            setIsLoading(true);
            sendDataToBackend(userData).then((recs) => {
                setIsLoading(false);
                navigate('/recommendations', { state: { user_data: userData, recommendations: recs, allCourses: allCourses, unsavedData: unsavedData } });
            }
            ).catch((err) => { console.err(err); })
        }
        for (let i = currentCourseIndex + 1; i < selectedCourses.length; i++) {
            if (selectedCourses[i]) {
                setCurrentCourseIndex(i)
                restoreCourseData(i)
                break
            }
            if (i === selectedCourses.length - 1) {
                setIsLoading(true);
                // eslint-disable-next-line
                sendDataToBackend(userData).then((recs) => {
                    setIsLoading(false);
                    navigate('/recommendations', { state: { user_data: userData, recommendations: recs, allCourses: allCourses, unsavedData: unsavedData } });
                }
                ).catch((err) => { console.err(err); })
            }
        }
    }
    const goBack = () => {
        storeAndResetData()
        if (currentCourseIndex === 0)
            setCurrentCourseIndex(-1)
        for (let i = currentCourseIndex - 1; i >= 0; i--) {
            if (selectedCourses[i]) {
                setCurrentCourseIndex(i)
                restoreCourseData(i)
                break
            }
            if (i === 0) {
                setCurrentCourseIndex(-1)
            }
        }
    }
    const storeAndResetData = () => {
        let found = false
        userData.forEach((item, index) => {
            if (allCourses[currentCourseIndex].key === item.course) {
                userData[index] = {
                    "course": allCourses[currentCourseIndex].key,
                    "semester": semesterOfCurrentCourse,
                    "like": likeCurrentCourse,
                    "grade": gradeOfCurrentCourse
                }
                found = true
            }
        })
        if (!found){
            userData.push({
                "course": allCourses[currentCourseIndex].key,
                "semester": semesterOfCurrentCourse,
                "like": likeCurrentCourse,
                "grade": gradeOfCurrentCourse
            })
        }
        setSemesterOfCurrentCourse(-1)
        setLikeCurrentCourse(-1)
        setGradeOfCurrentCourse(-1)
        setErrorMessage('')
    }
    const restoreCourseData = (courseIndex) => {
        userData.forEach(item => {
            if (allCourses[courseIndex].key === item.course) {
                setSemesterOfCurrentCourse(item.semester)
                setLikeCurrentCourse(item.like)
                setGradeOfCurrentCourse(item.grade)
            }
        })
    }
    const isLastCourse=()=>{
        if (currentCourseIndex === selectedCourses.length - 1) {
            return true
        }
        for (let i = currentCourseIndex + 1; i < selectedCourses.length; i++) {
            if (selectedCourses[i]) {
                return false
            }
            if (i === selectedCourses.length - 1) {
                return true
            }
        }
    }
    return (
        <> {isLoading === false && <>
        <Container fluid className='top-button-row'>
                <Row>
                    <Col>
                        <a href='/'>
                            <Button className='home-button-recommendations button'>
                                <i className="fa-solid fa-house"></i>
                            </Button>
                        </a>
                    </Col>
                </Row>
            </Container>
            {currentCourseIndex === -1 &&
                <>
                    <h1>First let's get to know you...</h1>
                    <h2>Which courses have you visited?</h2>
                    <Container className='ticks-container'>
                        {allCourses.map((item, index) => {
                            return (
                                <Row className='ticks-row' key={index}>
                                    <Col className='col-10'>
                                        {item.name}
                                    </Col>
                                    <Col className='col-2'>
                                        <Form>
                                            <Form.Check defaultChecked={selectedCourses[index]} className='toggle' type='switch' id='custom-switch' onChange={() => {
                                                selectedCourses[index] = !selectedCourses[index]
                                                unsavedData=true
                                            }}/>
                                        </Form>
                                    </Col>
                                </Row>
                            )
                        })}
                        <Row>
                            <Col md={{ span: 2, offset: 10 }} sm={{ span: 2, offset: 10 }}>
                                <Button className='button done-button' onClick={showNextCourse}>
                                    Next
                                </Button>
                            </Col>
                        </Row>

                    </Container>
                </>
            }
            {currentCourseIndex !== -1 &&
                <>
                    <h1>Questions regarding {allCourses[currentCourseIndex].name}</h1>
                    <h2>Which grade did you receive?</h2>
                    <Container className='form-container'>
                        <Form>
                            {grades.map((grade, index) => {
                                return (
                                    <Form.Check checked={grade === gradeOfCurrentCourse} key={index} inline name='group-1' type='radio' id='default-radio' label={grade} onChange={() => {
                                        setGradeOfCurrentCourse(grade)
                                        setUnsavedData(true)
                                    }} />
                                )
                            })}
                        </Form>
                    </Container>
                    <h2 style={{ marginTop: '20px' }}>In which semester did you work on this module?</h2>
                    <Container className='form-container'>
                        <DropdownButton id="dropdown-basic-button" title={semesterOfCurrentCourse === -1 ? 'Semester' : makeOrdinal(semesterOfCurrentCourse)}>
                            <Dropdown.Item onClick={() => {
                                setSemesterOfCurrentCourse(1)
                                setUnsavedData(true)
                            }}>1st</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSemesterOfCurrentCourse(2)
                                setUnsavedData(true)
                            }}>2nd</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSemesterOfCurrentCourse(3)
                                setUnsavedData(true)
                            }}>3rd</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSemesterOfCurrentCourse(4)
                                setUnsavedData(true)
                            }}>4th</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSemesterOfCurrentCourse(5)
                                setUnsavedData(true)
                            }}>5th</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSemesterOfCurrentCourse(6)
                                setUnsavedData(true)
                            }}>6th</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSemesterOfCurrentCourse(0)
                                setUnsavedData(true)
                            }}>{'>'} 6th</Dropdown.Item>
                        </DropdownButton>
                    </Container>
                    <h2 style={{ marginTop: '20px' }}>Did you like it?</h2>
                    <Container className='form-container'>
                        <Row>
                            <Col className='col-auto'>
                                <Button className={likeCurrentCourse === 0 ? '' : 'like-button-inactive'} onClick={() => {
                                    setLikeCurrentCourse(0)
                                    setUnsavedData(true)
                                }}>
                                    <span className="material-symbols-outlined">
                                        thumb_up
                                    </span>
                                </Button>
                            </Col>
                            <Col className='col-auto'>
                                <Button className={likeCurrentCourse === 1 ? '' : 'like-button-inactive'} onClick={() => {
                                    setLikeCurrentCourse(1)
                                    setUnsavedData(true)
                                }}>
                                    <span className="material-symbols-outlined">
                                        horizontal_rule
                                    </span>
                                </Button>
                            </Col>
                            <Col className='col-auto'>
                                <Button className={likeCurrentCourse === 2 ? '' : 'like-button-inactive'} onClick={() => {
                                    setLikeCurrentCourse(2)
                                    setUnsavedData(true)
                                }}>
                                    <span className="material-symbols-outlined">
                                        thumb_down
                                    </span>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                    <Container className='bottom-buttons-container'>
                        <Row>
                            <Col>
                                <Button className='button left-button' onClick={goBack}>
                                    <span className="material-symbols-outlined arrow">
                                        arrow_left
                                    </span>
                                </Button>
                                {!isLastCourse() &&
                                    <Button className='button right-button' onClick={showNextCourse}>
                                        <span className="material-symbols-outlined arrow">
                                            arrow_right
                                        </span>
                                    </Button>
                                }
                            </Col>
                            {isLastCourse() &&
                                <Col>
                                    <Button className='button finish-button' onClick={showNextCourse}>
                                        Finish
                                    </Button>
                                </Col>
                            }
                        </Row>
                    </Container>
                    {errorMessage !== '' &&
                        <p className='error'><span className="material-symbols-outlined error-icon">error</span>{errorMessage}</p>
                    }
                </>
            }
        </>}
            {isLoading === true && <> <Loading></Loading> </>}
        </>
    )
}

export default CourseSelector

function makeOrdinal(number) {
    switch (number) {
        case 0: return '> 6th'
        case 1: return '1st'
        case 2: return '2nd'
        case 3: return '3rd'
        default: return number.toString() + 'th'
    }
}

function getIndexByKey(key, allCourses){
    let res
    allCourses.forEach((course, index)=>{
        if(course.key===key)
            res=index
    })
    return res
}
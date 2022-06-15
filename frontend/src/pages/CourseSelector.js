import React, {useState} from 'react'
import './CourseSelector.css'
import {Container, Row, Col, Button, Form, Dropdown, DropdownButton} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import {sendDataToBackend} from '../Utils'

export const userData=[]

function CourseSelector(){
    const navigate = useNavigate();
    const allCourses=require('../data/allCourses.json')
    const [currentCourse, setCurrentCourse]=useState(-1)
    const [semesterOfCurrentCourse, setSemesterOfCurrentCourse]=useState(-1) //-1: not set, 0: >6th
    const [likeCurrentCourse, setLikeCurrentCourse]=useState(-1) //-1: not set, 0: like, 1: neutral, 2: dislike
    const [gradeOfCurrentCourse, setGradeOfCurrentCourse]=useState(-1)
    const [errorMessage, setErrorMessage]=useState('')
    const selectedCourses=useState(new Array(allCourses.length).fill(false))[0]
    const grades=['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '5.0']
    const showNextCourse=()=>{
        if(currentCourse!==-1 && (semesterOfCurrentCourse===-1 || likeCurrentCourse===-1 || gradeOfCurrentCourse===-1)){
            setErrorMessage('Please fill in all the fields.')
            return
        }
        if(currentCourse===-1){
            let userDataToDelete=[]
            userData.forEach((item, index)=>{
                if(!selectedCourses[item.course])
                    userDataToDelete.push(index)
            })
            userDataToDelete.forEach(index=>{
                userData.splice(index, 1)
            })
        }
        else
            storeAndResetData()
        if(currentCourse===selectedCourses.length-1){
            navigate('/recommendations')
            sendDataToBackend(userData)
        }
        for(let i=currentCourse+1; i<selectedCourses.length; i++){
            if(selectedCourses[i]){
                setCurrentCourse(i)
                restoreCourseData(i)
                break
            }
            if(i===selectedCourses.length-1){
                navigate('/recommendations')
                sendDataToBackend(userData)
            }
        }
    }
    const goBack=()=>{
        storeAndResetData()
        if(currentCourse===0)
            setCurrentCourse(-1)
        for(let i=currentCourse-1; i>=0; i--){
            if(selectedCourses[i]){
                setCurrentCourse(i)
                restoreCourseData(i)
                break
            }
            if(i===0){
                setCurrentCourse(-1)
            }
        }
    }
    const storeAndResetData=()=>{
        let found=false
        userData.forEach((item, index)=>{
            if(currentCourse===item.course){
                userData[index]={
                    "course":currentCourse,
                    "semester":semesterOfCurrentCourse,
                    "like":likeCurrentCourse,
                    "grade":gradeOfCurrentCourse
                }
                found=true
            }
        })
        if(!found)
            userData.push({
                "course":currentCourse,
                "semester":semesterOfCurrentCourse,
                "like":likeCurrentCourse,
                "grade":gradeOfCurrentCourse
            })
        setSemesterOfCurrentCourse(-1)
        setLikeCurrentCourse(-1)
        setGradeOfCurrentCourse(-1)
        setErrorMessage('')
    }
    const restoreCourseData=(course)=>{
        userData.forEach(item=>{
            if(course===item.course){
                setSemesterOfCurrentCourse(item.semester)
                setLikeCurrentCourse(item.like)
                setGradeOfCurrentCourse(item.grade)
            }
        })
    }
    return(
        <>
            <a href='/'>
                <Button className='home-button button'>
                    <i className="fa-solid fa-house"></i>
                </Button>
            </a>
            {currentCourse===-1 &&
                <>
                    <h1>First let's get to know you...</h1>
                    <h2>Which courses have you visited?</h2>
                    <Container  className='ticks-container'>
                    {allCourses.map((item, index) => {
                        return(
                                <Row style={{marginBottom: '10px'}} key={index}>
                                    <Col className='col-10'>
                                        {item.name}
                                    </Col>
                                    <Col className='col-2'>
                                        <Form>
                                            <Form.Check defaultChecked={selectedCourses[index]} className='toggle' type='switch' id='custom-switch' onChange={() => selectedCourses[index]=!selectedCourses[index]}/>
                                        </Form>
                                    </Col>
                                </Row>
                        )
                    })}
                    <Row>
                        <Col md={{span:2, offset: 10}} sm={{span:2, offset: 10}}>
                            <Button className='button done-button' onClick={showNextCourse}>
                                Next
                            </Button>
                        </Col>
                    </Row>
                    
                    </Container>
                </>
            }
            {currentCourse!==-1 &&
                <>
                    <h1>Questions regarding {allCourses[currentCourse].name}</h1>
                    <h2>Which grade did you receive?</h2>
                    <Container className='form-container'>
                        <Form>
                            {grades.map((grade, index) => {
                                return(
                                    <Form.Check checked={grade===gradeOfCurrentCourse} key={index} inline name='group-1' type='radio' id='default-radio' label={grade} onChange={()=>setGradeOfCurrentCourse(grade)}/>
                                )
                            })}
                        </Form>
                    </Container>
                    <h2 style={{marginTop: '20px'}}>In which semester did you work on this module?</h2>
                    <Container className='form-container'>
                        <DropdownButton id="dropdown-basic-button" title={semesterOfCurrentCourse===-1?'Semester':makeOrdinal(semesterOfCurrentCourse)}>
                            <Dropdown.Item onClick={()=>setSemesterOfCurrentCourse(1)}>1st</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setSemesterOfCurrentCourse(2)}>2nd</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setSemesterOfCurrentCourse(3)}>3rd</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setSemesterOfCurrentCourse(4)}>4th</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setSemesterOfCurrentCourse(5)}>5th</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setSemesterOfCurrentCourse(6)}>6th</Dropdown.Item>
                            <Dropdown.Item onClick={()=>setSemesterOfCurrentCourse(0)}>{'>'} 6th</Dropdown.Item>
                        </DropdownButton>
                    </Container>
                    <h2 style={{marginTop: '20px'}}>Did you like it?</h2>
                    <Container className='form-container'>
                        <Row>
                            <Col className='col-auto'>
                                <Button className={likeCurrentCourse===0?'':'like-button-inactive'} onClick={()=>setLikeCurrentCourse(0)}>
                                    <span className="material-symbols-outlined">
                                        thumb_up
                                    </span>
                                </Button>
                            </Col>
                            <Col className='col-auto'>
                                <Button className={likeCurrentCourse===1?'':'like-button-inactive'} onClick={()=>setLikeCurrentCourse(1)}>
                                    <span className="material-symbols-outlined">
                                        horizontal_rule
                                    </span>
                                </Button>
                            </Col>
                            <Col className='col-auto'>
                                <Button className={likeCurrentCourse===2?'':'like-button-inactive'} onClick={()=>setLikeCurrentCourse(2)}>
                                    <span className="material-symbols-outlined">
                                        thumb_down
                                    </span>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                    <Container className='ticks-container'>
                        <Row>
                            <Col>
                                <Button className='button left-button' onClick={goBack}>
                                    <span className="material-symbols-outlined arrow">
                                        arrow_left
                                    </span>
                                </Button>
                                <Button className='button right-button' onClick={showNextCourse}>
                                    <span className="material-symbols-outlined arrow">
                                        arrow_right
                                    </span>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                    {errorMessage!=='' &&
                        <p className='error'><span className="material-symbols-outlined error-icon">error</span>{errorMessage}</p>
                    }
                </>
            }
        </>
    )
}

export default CourseSelector

function makeOrdinal(number){
    switch(number){
        case 0: return '> 6th'
        case 1: return '1st'
        case 2: return '2nd'
        case 3: return '3rd'
        default: return number.toString()+'th'
    }
}
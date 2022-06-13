import React, {useState} from 'react'
import './CourseSelector.css'
import {Container, Row, Col, Button, Form, Dropdown, DropdownButton} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

function CourseSelector(){
    const navigate = useNavigate();
    const [currentCourse, setCurrentCourse]=useState(-1)
    const ticked=useState([])[0]
    const allCourses=require('../data/allCourses.json')
    const grades=['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '5.0']
    const showNextCourse=()=>{
        if(currentCourse===ticked.length-1)
        navigate('/recommendations')
        for(let i=currentCourse+1; i<ticked.length; i++){
            if(ticked[i]){
                setCurrentCourse(i)
                break
            }
            if(i>=ticked.length-1)
                navigate('/recommendations')
        }
    }
    if(currentCourse===-1){
        for(let i=0; i<allCourses.length; i++)
            ticked[i]=false
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
                    {allCourses.map((item, index) => {
                        return(
                            <Container key={index} className='ticks-container'>
                                <Row>
                                    <Col className='col-10'>
                                        {item.name}
                                    </Col>
                                    <Col className='col-2'>
                                        <Form>
                                            <Form.Check className='toggle' type='switch' id='custom-switch' onChange={() => ticked[index]=!ticked[index]}/>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        )
                    })}
                    <Button className='button done-button' onClick={showNextCourse}>
                        Done
                    </Button>
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
                                    <Form.Check key={index} inline name='group-1' type='radio' id='default-radio' label={grade}/>
                                )
                            })}
                        </Form>
                    </Container>
                    <h2 style={{marginTop: '20px'}}>In which semester did you work on this module?</h2>
                    <Container className='form-container'>
                        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                            <Dropdown.Item>1st</Dropdown.Item>
                            <Dropdown.Item>2nd</Dropdown.Item>
                            <Dropdown.Item>3rd</Dropdown.Item>
                            <Dropdown.Item>4th</Dropdown.Item>
                            <Dropdown.Item>5th</Dropdown.Item>
                            <Dropdown.Item>6th</Dropdown.Item>
                            <Dropdown.Item>more than 6th</Dropdown.Item>
                        </DropdownButton>
                    </Container>
                    <h2 style={{marginTop: '20px'}}>Did you like it?</h2>
                    <Container className='form-container'>
                        <Row>
                            <Col className='col-auto'>
                                <Button className='like-button'>
                                    <span class="material-symbols-outlined">
                                        thumb_up
                                    </span>
                                </Button>
                            </Col>
                            <Col className='col-auto'>
                                <Button className='like-button'>
                                    <span class="material-symbols-outlined">
                                        horizontal_rule
                                    </span>
                                </Button>
                            </Col>
                            <Col className='col-auto'>
                                <Button className='like-button'>
                                    <span class="material-symbols-outlined">
                                        thumb_down
                                    </span>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                    
                    <Button className='done-button button' onClick={showNextCourse}>
                        Done
                    </Button>
                </>
            }
        </>
    )
}

export default CourseSelector
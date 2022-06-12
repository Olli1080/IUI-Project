import './CourseSelector.css'
import {Container, Row, Col, Button} from 'react-bootstrap'
import Toggle from 'react-toggle'
import "react-toggle/style.css"

function CourseSelector(){
    const allCourses=require('../data/allCourses.json')
    const ticked=[]
    allCourses.forEach(course => ticked.push(false))
    return(
        <>
            <a href='/'>
                <Button className='home-button'>
                    <i className="fa-solid fa-house"></i>
                </Button>
            </a>
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
                                <Toggle icons={false} onChange={() => ticked[index]=!ticked[index]}/>
                            </Col>
                        </Row>
                    </Container>
                )
            })}
            <Button className='done-button button' onClick={() => console.log(ticked)}>
                Done
            </Button>
        </>
    )
}

export default CourseSelector
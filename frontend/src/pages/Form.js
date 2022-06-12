import './Form.css'
import {Container, Row, Col} from 'react-bootstrap'

function Form(){
    let allCourses=require('../data/allCourses.json')
    return(
        <>
            <h1>First let's get to know you...</h1>
            <h2>Which courses have you visited?</h2>
            {allCourses.map((item, index) => {
                return(
                    <Container key={index} fluid className='container'>
                        <Row>
                            <Col className='col-10'>
                                {item.name}
                            </Col>
                            <Col className='col-2'>
                                
                            </Col>
                        </Row>
                    </Container>
                )
            })}
        </>
    )
}

export default Form
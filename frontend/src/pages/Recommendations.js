import './Recommendations.css'
import {Container, Row, Col, Card, Button} from 'react-bootstrap'

function Recommendations(){
    let recommendations=require('../data/recommendations.json')
    let allCourses=require('../data/allCourses.json')
    return(
        <>
            <a href='/'>
                <Button className='home-button button'>
                    <i className="fa-solid fa-house"></i>
                </Button>
            </a>
            <h1>Recommendations for you</h1>
            <Container fluid className='container'>
                <Row>
                    {recommendations.map((item, index) =>{
                        return(
                            <Col key={index} className='col-3'>
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
            <Container fluid className='container'>
                <Row>
                    {allCourses.map((item, index) =>{
                        return(
                            <Col key={index} className='col-3'>
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
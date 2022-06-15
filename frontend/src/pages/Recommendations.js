import './Recommendations.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

function Recommendations() {
    //let recommendations = require('../data/recommendations.json')
    let allCourses = require('../data/allCourses.json')
    // Gets user data from previous page
    const {state} = useLocation();
    const {user_data, recommendations} = state;


    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
          JSON.stringify(user_data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "user_data.json";
        link.click();
    };

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
            <Container fluid className='container'>
                <Row>
                    {recommendations.map((item, index) => {
                        return (
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
                    {allCourses.map((item, index) => {
                        return (
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
import './Recommendations.css'
import {Container, Row, Col, Card} from 'react-bootstrap'

function Recommendations(){
    let recommendations=require('../data/recommendations.json')
    return(
        <>
            <h1>Recommendations for you</h1>
            <Container fluid className='container'>
                <Row>
                    {recommendations.map((item, index) =>{
                        return(
                            <Col key={index} className='col-3'>
                                <Card>
                                    <p>Modul</p>
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
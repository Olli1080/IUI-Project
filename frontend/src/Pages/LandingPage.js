import React from "react";
import {Card, Container, Row, Button, Col} from 'react-bootstrap'
import './LandingPage.css'

function LandingPage(){
    let userData
    const hiddenFileInput = React.useRef(null);
    const handleClick = e => {
        hiddenFileInput.current.click()
    };
    const handleChange = e => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            userData=JSON.parse(text)
        };
        reader.readAsText(e.target.files[0]);
    };
    return(
        <div className='card-container'>
            <Card className='card'>
                    <h1>Have you been here before?</h1>
                    <Container fluid className='container'>
                        <Row>
                            <Col className='col-6'>
                                <a href='/Moritz-Seine-Seite'>
                                    <Button className='button'>No, I'm new</Button>
                                </a>
                            </Col>
                            <Col className='col-6'>
                                <input type="file" id="file" accept='.json' ref={hiddenFileInput} style={{ display: "none" }} onChange={handleChange}/>
                                <Button className='button' onClick={handleClick}>Yes, upload existing data</Button>
                            </Col>
                        </Row>
                    </Container>
            </Card>
        </div>
    )
}

export default LandingPage
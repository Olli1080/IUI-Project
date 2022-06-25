import React from "react";
import {Card, Container, Row, Button, Col} from 'react-bootstrap'
import './LandingPage.css'
import {useNavigate} from 'react-router-dom'

function LandingPage(){
    const navigate = useNavigate();
    let userData
    const hiddenFileInput = React.useRef(null)
    const handleClick = () => {
        hiddenFileInput.current.click()
    };
    const handleChange = e => {
        e.preventDefault();
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            userData=JSON.parse(text)
            navigate('/course-selector', { state: { userData: userData } });
        };
        reader.readAsText(e.target.files[0])
    };
    return(
        <div className='overall-container'>
            <Card className='landing-card'>
                    <h1>Have you been here before?</h1>
                    <Container fluid className='container'>
                        <Row>
                            <Col className='card-col col-6'>
                                <Button className='button' onClick={()=>{
                                    navigate('/course-selector', { state: { userData: [] } })
                                }}>No, I'm new</Button>
                            </Col>
                            <Col className='card-col col-6'>
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
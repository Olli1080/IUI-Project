import React, {useState} from "react";
import {Card, Container, Row, Button, Col} from 'react-bootstrap'
import './LandingPage.css'
import {useNavigate} from 'react-router-dom'
import {sendDataToBackend} from '../Utils'
import Loading from './Loading'

function LandingPage(){
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            sendDataToBackend(userData).then((recs) => {
                setIsLoading(false);
                console.log(recs);
                navigate('/recommendations', { state: { user_data: userData, recommendations: recs } });
            }
            ).catch((err) => { console.log(err); })
        };
        reader.readAsText(e.target.files[0])
    };
    return(
        <div className='overall-container'>
            {!isLoading &&
                <Card className='landing-card'>
                        <h1>Have you been here before?</h1>
                        <Container fluid className='container'>
                            <Row>
                                <Col className='card-col col-6'>
                                    <a href='/course-selector'>
                                        <Button className='button'>No, I'm new</Button>
                                    </a>
                                </Col>
                                <Col className='card-col col-6'>
                                    <input type="file" id="file" accept='.json' ref={hiddenFileInput} style={{ display: "none" }} onChange={handleChange}/>
                                    <Button className='button' onClick={handleClick}>Yes, upload existing data</Button>
                                </Col>
                            </Row>
                        </Container>
                </Card>
            }
            {isLoading && <Loading/>}
        </div>
    )
}

export default LandingPage
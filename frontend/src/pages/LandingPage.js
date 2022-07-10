import React, { useState, useEffect } from "react";
import { Card, Container, Row, Button, Col } from 'react-bootstrap'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom'
import { sendDataToBackend } from '../Utils'
import { getCourseJson } from '../Utils'
import Loading from './Loading'
import ErrorMessage from "./ErrorMessage";

let userData

function LandingPage() {
    const navigate = useNavigate();

    // Get Course Data at beginning
    const [isLoading, setIsLoading] = useState(true);
    const hiddenFileInput = React.useRef(null)
    const [courseData, setCourseData] = useState();
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        getCourseJson().then((courses) => {
            setIsLoading(false);
            setCourseData(courses);
        }
        ).catch((err) => {setErrorMessages(e_m => {return [...e_m,err]})}); //console.err(err);


        const localStorageUserData = JSON.parse(localStorage.getItem('courseRecUserData'))
        if (localStorageUserData) {
            userData = localStorageUserData
        }
    }, []);


    const handleClick = () => {
        hiddenFileInput.current.click()
    };


    const handleChange = e => {
        e.preventDefault();
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            userData = JSON.parse(text)
            setIsLoading(true);
            sendDataToBackend(userData).then((recs) => {
                setIsLoading(false);
                localStorage.setItem('courseRecUserData', JSON.stringify(userData))
                navigate('/recommendations', { state: { user_data: userData, recommendations: recs, allCourses: courseData } });
            }
            ).catch((err) => {setErrorMessages(e_m => {return [...e_m,err]})})
        };
        reader.readAsText(e.target.files[0])
    };
    return (
        <>
            <ErrorMessage error_messages={errorMessages}></ErrorMessage>
            {!isLoading &&
                <div className='overall-container'>
                    <Card className='landing-card'>
                        <h1 className='card-headline'>Have you been here before?</h1>
                        <Container fluid className='container'>
                            <Row>
                                <Col className='card-col'>
                                    <Button className='button' onClick={() => {
                                        navigate('/course-selector', { state: { userData: [], allCourses: courseData } })
                                    }}>No, I'm new</Button>
                                </Col>
                                <Col className='card-col'>
                                    <input type="file" id="file" accept='.json' ref={hiddenFileInput} style={{ display: "none" }} onChange={handleChange} />
                                    <Button className='button' onClick={handleClick}>Yes, upload file</Button>
                                </Col>
                                <Col className='card-col'>
                                    <Button className='button' disabled={userData === undefined} onClick={() => {
                                        setIsLoading(true);
                                        sendDataToBackend(userData).then((recs) => {
                                            setIsLoading(false);
                                            localStorage.setItem('courseRecUserData', JSON.stringify(userData))
                                            navigate('/recommendations', { state: { user_data: userData, recommendations: recs, allCourses: courseData } });
                                        }
                                        ).catch((err) => {setErrorMessages(e_m => {return [...e_m,err]})})
                                    }}>Yes, use data from last time</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Card>
                </div>
            }
            {isLoading && <><Loading></Loading></>}
        </>
    )
}

export default LandingPage
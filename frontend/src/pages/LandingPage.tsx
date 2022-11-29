import React, { useState, useEffect } from "react";
import { Card, Container, Row, Button, Col } from 'react-bootstrap'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom'
import { sendDataToBackend, getCourseJson } from '../Utils'
import Loading from './Loading'
import ErrorMessage from "./ErrorMessage";

import type { Course, UserData } from '../Utils'
import type { ChangeEventHandler, MouseEventHandler } from 'react'

let userData: UserData | undefined

function LandingPage() {
    const navigate = useNavigate();

    // Get Course Data at beginning
    const [isLoading, setIsLoading] = useState(true);
    const hiddenFileInput = React.useRef<HTMLInputElement>(null)
    const [courseData, setCourseData] = useState<Array<Course>>();
    const [errorMessages, setErrorMessages] = useState<Array<any>>([]);

    useEffect(() => {
        getCourseJson().then((courses) => {
            setIsLoading(false);
            setCourseData(courses);
        }
        ).catch((err) => {setErrorMessages(e_m => {return [...e_m,err]})}); //console.err(err);

        const localItem = localStorage.getItem('courseRecUserData')
        userData = (localItem) ? JSON.parse(localItem) : {}
    }, []);


    const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
        hiddenFileInput.current?.click()
    };


    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        e.preventDefault();
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result
            if (!text)
                return

            userData = ((text instanceof ArrayBuffer) 
                ? Buffer.from(text).toJSON() 
                : JSON.parse(text)) as UserData

            setIsLoading(true);
            sendDataToBackend(userData).then((recs) => {
                setIsLoading(false);
                localStorage.setItem('courseRecUserData', JSON.stringify(userData))
                navigate('/recommendations', { state: { userData, recommendations: recs, allCourses: courseData, showTutorial: false} });
            }
            ).catch((err) => {setErrorMessages(e_m => {return [...e_m,err]})})
        };
        if (e.target.files)
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
                                        navigate('/course-selector', { state: { userData: [], allCourses: courseData, showTutorial: true} })
                                    }}>No, I'm new</Button>
                                </Col>
                                <Col className='card-col'>
                                    <input type="file" id="file" accept='.json' ref={hiddenFileInput} style={{ display: "none" }} onChange={handleChange} />
                                    <Button className='button' onClick={handleClick}>Yes, upload file</Button>
                                </Col>
                                <Col className='card-col'>
                                    <Button className='button' disabled={userData === undefined} onClick={() => {
                                        setIsLoading(true);
                                        sendDataToBackend(userData!).then((recs) => {
                                            setIsLoading(false);
                                            localStorage.setItem('courseRecUserData', JSON.stringify(userData))
                                            navigate('/recommendations', { state: { userData, recommendations: recs, allCourses: courseData, showTutorial: false} });
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
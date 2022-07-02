import React, {useState, useEffect} from "react";
import {Card, Container, Row, Button, Col} from 'react-bootstrap'
import './LandingPage.css'
import {useNavigate} from 'react-router-dom'
import {getCourseJson} from '../Utils'
import Loading from './Loading'

function LandingPage(){
    const navigate = useNavigate();

    // Get Course Data at beginning
    const [isLoading, setIsLoading] = useState(true);
    let userData
    const hiddenFileInput = React.useRef(null)
    const [courseData, setCourseData] = useState();

    useEffect(() => {
        getCourseJson().then((courses) => {
            setIsLoading(false);
            setCourseData(courses);
        }
        ).catch((err) => { console.err(err); })

    }, []);


    const handleClick = () => {
        hiddenFileInput.current.click()
    };

    
    const handleChange = e => {
        e.preventDefault();
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            userData=JSON.parse(text)
            navigate('/course-selector', { state: { userData: userData, allCourses: courseData, dirty: false} });
        };
        reader.readAsText(e.target.files[0])
    };
    return(
        <>
        {!isLoading &&
        <div className='overall-container'>
            <Card className='landing-card'>
                    <h1 className='card-headline'>Have you been here before?</h1>
                    <Container fluid className='container'>
                        <Row>
                            <Col className='card-col col-6'>
                                <Button className='button' onClick={()=>{
                                    navigate('/course-selector', { state: { userData: [], allCourses:  courseData, dirty: false} })
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
        }
        {isLoading && <><Loading></Loading></>}
        </>
    )
}

export default LandingPage
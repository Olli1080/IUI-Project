import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, Badge, Form} from 'react-bootstrap'
import "./DetailedView.css"

function DetailedView(props) {
    const { selCourse, openModal } = props;
    const [show, setShow] = useState(false);
    const [course, setCourse] = useState(selCourse);
    const handleClose = () => { setShow(false); };

    const property_int_name_to_name = {
        "lp": "ECTS",
        "type": "Course Type",
        "semester": "Semester",
        "languages": "Languages",
        "learning-goals": "Learning Goals",
        "content": "Content",
        "duration": "Duration (in Semesters)",
        "regular_semester": "Semesters students usually take the course:"
    }

    useEffect(() => {
        setCourse(selCourse)
        setShow(openModal)
    }, [selCourse, openModal]);

    return (
        <>
            <Modal className="dv-modal" show={show} onHide={handleClose} centered={true} animation={true} scrollable={true} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{course.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        {Object.entries(course).map((property, index) => {
                            if (!["name", "key", "languages", "content", "learning-goals", "regular_semester"].includes(property[0])) {
                                return (
                                    <Row className='detail-row' key={index}>
                                        <Col>
                                            <div className="course-property">
                                                {property_int_name_to_name[property[0]]}
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="course-value">
                                                {property[1]}
                                            </div>
                                        </Col>
                                    </Row>
                                )
                            }

                            if (["languages", "regular_semester"].includes(property[0])) {
                                return (
                                    <Row className='detail-row' key={index}>
                                        <Col>
                                            <div className="course-property">
                                                {property_int_name_to_name[property[0]]}
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="course-value">
                                                {property[1].map(((elem, i) => { return (<Badge bg="detail-badge" key={i}>{elem}</Badge>) }))}
                                            </div>
                                        </Col>
                                    </Row>
                                )
                            }

                            if (["content", "learning-goals"].includes(property[0])) {
                                return (
                                    <Row className='detail-row' key={index}>
                                        <Col>
                                            <div className="course-property">
                                                {property_int_name_to_name[property[0]]}
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="course-value">
                                                <Form.Control className="detail-textarea" as="textarea" id="inputGroup-sizing-lg" defaultValue={property[1]} readOnly></Form.Control>
                                            </div>
                                        </Col>
                                    </Row>
                                )
                            }

                            return null;
                        })}
                    </Container>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default DetailedView
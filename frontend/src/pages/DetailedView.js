import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, ModalTitle } from 'react-bootstrap'
import "./DetailedView.css"

function DetailedView(props) {
    const { selCourse, openModal } = props;
    const [show, setShow] = useState(false);
    const [course, setCourse] = useState(selCourse);
    const handleClose = () => setShow(false);

    useEffect(() => {
        setCourse(selCourse)
        setShow(openModal)
    }, [selCourse, openModal]);

    return (
        <>
            <Modal className="dv-modal" show={show} onHide={handleClose} centered={true} animation={true} scrollable={true}>
                <Container>
                    <Row>
                        <Col>
                            <div className='courseName'>
                                {course.name}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal>

        </>
    )
}

export default DetailedView
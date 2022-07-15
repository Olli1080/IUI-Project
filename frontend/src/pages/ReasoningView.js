import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, Badge, Form} from 'react-bootstrap'
import "./ReasoningView.css"

function DetailedView(props) {
    const { selCourse, openModal, forceUpdate, reasoning } = props;
    const [show, setShow] = useState(false);
    const [course, setCourse] = useState(selCourse);
    const [reason, setReasoning] = useState(reasoning)
    const [fUpdate, setFUpdate] = useState(forceUpdate);
    const handleClose = () => { setShow(false); };
    if (fUpdate) {};

    useEffect(() => {
        setCourse(selCourse);
        setShow(openModal);
        setFUpdate(forceUpdate);
        setReasoning(reasoning)
    }, [selCourse, openModal, forceUpdate, reasoning]);

    return (
        <>
            <Modal className="dv-modal" show={show} onHide={handleClose} centered={true} animation={true} scrollable={true} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{"Reasoning for " + course.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <p>
                                    Similar users to you have rated this module with:
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                <span className="material-symbols-outlined">
                                    thumb_up
                                </span>
                                <span className="material-symbols-outlined">
                                    horizontal_rule
                                </span>
                                <span className="material-symbols-outlined">
                                    thumb_down
                                </span>
                            </div>
                        </Row>
                        <Row style={{height: 5}}></Row>
                        <Row>
                            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                {
                                    [2, 1, 0].map((val) => {
                                        return <div style={{width: 24, textAlign: 'center'}}>{(val in reason.ratings) ? reason.ratings[val] : 0}</div>
                                    })
                                }
                            </div>
                        </Row>
                        <hr/>
                        <Row>
                            <p>
                                Similar users to you have taken this module with the following grades:
                            </p>
                            <table style={{textAlign: 'center'}} className="table table-bordered">
                                <thead style={{color: 'whitesmoke', backgroundColor: '#5e2b97'}}>
                                    <tr>
                                    {
                                        ['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '5.0'].map((val) => {
                                            return <th scope='col'>{val}</th>
                                        })
                                    }    
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    {
                                        ['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '5.0'].map((val) => {
                                            return <td>{(val in reason.grades) ? reason.grades[val] : 0}</td>
                                        })
                                    }
                                    </tr>
                                </tbody>
                            </table>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default DetailedView
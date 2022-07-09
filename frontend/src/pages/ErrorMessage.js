import React, { useState, useEffect } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import "./ErrorMessage.css"

function ErrorMessage(props) {
    // const { selCourse, openModal, forceUpdate } = props;
    // const [show, setShow] = useState(false);

    // useEffect(() => {
    //     setCourse(selCourse);
    //     setShow(openModal);
    //     setFUpdate(forceUpdate);
    // },);
    const { error_messages } = props;

    const [show, setShow] = useState(true);
    const [errors, setErrors] = useState(error_messages);

    useEffect(() => {
        setErrors(error_messages);
        setShow(true);
    }, [error_messages]);

    return (
        <>
            <ToastContainer position="bottom-end" className="p-3">
            {errors.map((property, index) => {
                return (
                <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide bg="danger">
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Problem with the backend.</strong>
                        {/* <small>11 mins ago</small> */}
                    </Toast.Header>
                    <Toast.Body>{property}</Toast.Body>
                </Toast>) })}
            </ToastContainer>
        </>
    )
}

export default ErrorMessage
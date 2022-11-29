import React, { useState, useEffect } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import "./ErrorMessage.css"

function ErrorMessage(props: { error_messages: Array<any> }) {
    // const { selCourse, openModal, forceUpdate } = props;
    // const [show, setShow] = useState(false);

    // useEffect(() => {
    //     setCourse(selCourse);
    //     setShow(openModal);
    //     setFUpdate(forceUpdate);
    // },);
    const { error_messages } = props;

    const [show, setShow] = useState(new Array(error_messages.length).fill(true));
    const [errors, setErrors] = useState(error_messages);

    useEffect(() => {
        setErrors(e_previous => {
            const new_errors = error_messages.filter(x => !e_previous.includes(x));
            setShow(new Array(new_errors.length).fill(true))
            return new_errors;
        });
    }, [error_messages]);

    return (
        <>
            <ToastContainer position="bottom-end" className="p-3">
            {
            errors.map((property, index) => {
                return ( 
                <Toast onClose={() => {let current_show = JSON.parse(JSON.stringify(show));; current_show[index] = false; setShow(current_show);}} show={show[index]} delay={5000} autohide bg="danger">
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{property.name}</strong>
                        {/* <small>11 mins ago</small> */}
                    </Toast.Header>
                    <Toast.Body>{property.message}</Toast.Body>
                </Toast>) })}
            </ToastContainer>
        </>
    )
}

export default ErrorMessage
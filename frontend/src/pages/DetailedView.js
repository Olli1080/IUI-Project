import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
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
            <Modal className="dv-modal" show={show} onHide={handleClose} centered={true} animation={false}
                    style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    {course.name}
            </Modal>

        </>
    )
}

export default DetailedView
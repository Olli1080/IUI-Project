import { Spinner} from 'react-bootstrap'
import "./Loading.css"

function Loading() {
    // Has to be made more beautiful xP
    return (
        <>
            <div
                style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Spinner className="spinner" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>,
        </>
    )
}

export default Loading
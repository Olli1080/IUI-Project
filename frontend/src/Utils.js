export async function sendDataToBackend(data){
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {controller.abort();},  3000)

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
    };

    const response = await fetch('http://localhost:5000/userdata', requestOptions).catch( err => {clearTimeout(timeoutId); throw new Error("Timeout Error: Could not send user data to backend.")});

    if (!response.ok) {
        clearTimeout(timeoutId);
        throw new Error("HTTP status " + response.status);
    }

    clearTimeout(timeoutId);
    return response.json();
}


export async function getCourseJson(data){
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {controller.abort();},  3000)
    
    const requestOptions = {
        signal: controller.signal
    };
    
    const response = await fetch('http://localhost:5000/course_data', requestOptions).catch( err => {clearTimeout(timeoutId); throw new Error("Timeout Error: Could not fetch course data from backend.")});

    if (!response.ok) {
        clearTimeout(timeoutId);
        throw new Error("HTTP status " + response.status);
    }

    clearTimeout(timeoutId);
    return response.json();
}
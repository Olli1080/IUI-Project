export async function sendDataToBackend(data){
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    return fetch('http://localhost:5000/userdata', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            return response.json();
        });
}


export async function getCourseJson(data){
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {controller.abort();},  3000)
    
    const requestOptions = {
        signal: controller.signal
    };
    
    const response = await fetch('http://localhost:5000/course_data', requestOptions).catch( err => {clearTimeout(timeoutId); throw new Error("Timeout Error")});

    if (!response.ok) {
        clearTimeout(timeoutId);
        throw new Error("HTTP status " + response.status);
    }

    clearTimeout(timeoutId);
    return response.json();
}
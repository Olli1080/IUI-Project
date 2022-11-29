export async function sendDataToBackend(data: UserData){
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
    return response.json() as Promise<Response>;
}

export type Languages = 'de' | 'en'
export type CourseType = 'Practical' | 'Mandatory' | 'Optional'

export type UserData = Array<{
    course: string
    semester: number,
    like: number,
    grade: string
}>

export type State = { userData: UserData, allCourses: Array<Course>, showTutorial: boolean }
export type Similarity = { max: number, avg: number, min: number }
export type Reason = { grades: Record<string, number>, ratings: Record<string, number> }
export type Recommendation = { score: number, reasoning: Reason }
export type Response = { similarity: Similarity, recommendations: Record<string, Recommendation> }

export type Course = {
    name: string
    key: string
    lp: number
    type: CourseType
    semester: string
    languages: Array<Languages>
    'learning-goals': string
    content: string
    duration: number
    regular_semester: Array<number>
}

type ResponseCourse = {
    name: string
    key: string
    lp: string
    type: CourseType
    semester: string
    languages: Array<Languages>
    'learning-goals': string
    content: string
    duration: string
    regular_semester: Array<string>
}

export async function getCourseJson(){
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
    let json = (await response.json()) as Array<ResponseCourse>
    return JSON.parse(JSON.stringify(json), (key, value) => {
        if (['lp', 'duration'].includes(key))
            return parseInt(value)
        if (key === 'regular_semester')
            return ((value) as Array<string>).map((val) => parseInt(val))
        return value
    }) as Array<Course>
}
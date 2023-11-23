import axios from "axios";
export const domain1 = 'https://ameliachen.site'
export const domain = 'http://localhost:3000'


const problemsRequest = axios.create({
  baseURL: `${domain}/api/problems`
})

const userRequest = axios.create({
  baseURL: `${domain}/api/user`
})


// problems
export const apiProblemsItem = () => problemsRequest.get('')
export const apiProblemItem = (id) => problemsRequest.get(`/${id}`)
// submission
export const apiProblemSubmission = (id, payload) => problemsRequest.post(`/${id}/submit`, payload)
export const apiProblemSubmissionItem = (id, submittedId) => problemsRequest.get(`/${id}/submissions/${submittedId}`)
export const apiProblemSubmissionItems = (id) => problemsRequest.get(`/${id}/submissions`)


// user
export const apiUserSignIn = (payload) => userRequest.post('/signin', payload)
export const apiUserSignUp = (payload) => userRequest.post('/signup', payload)
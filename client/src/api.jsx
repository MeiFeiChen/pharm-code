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
export const apiProblemSubmission = (id, payload, config) => problemsRequest.post(`/${id}/submit`, payload, config)
export const apiProblemSubmissionItem = (id, submittedId, config) => problemsRequest.get(`/${id}/submissions/${submittedId}`, config)
export const apiProblemSubmissionItems = (id, config) => problemsRequest.get(`/${id}/submissions`, config)


// user
export const apiUserSignIn = (payload) => userRequest.post('/signin', payload)
export const apiUserSignUp = (payload) => userRequest.post('/signup', payload)
export const apiUserSubmissionItems = (config) => userRequest.get('/submissions', config)
export const apiUserProfile = (config) => userRequest.get('/profile', config)
import axios from "axios";

const problemsRequest = axios.create({
  baseURL: `${import.meta.env.VITE_DOMAIN}/api/problems`
})

const userRequest = axios.create({
  baseURL: `${import.meta.env.VITE_DOMAIN}/api/user`
})

const assistanceRequest = axios.create({
  baseURL: `${import.meta.env.VITE_DOMAIN}/api/assistance`
})

const adminRequest = axios.create({
  baseURL: `${import.meta.env.VITE_DOMAIN}/api/admin`
})


// problems
export const apiProblemsItem = () => problemsRequest.get('')
export const apiProblemItem = (id) => problemsRequest.get(`/${id}`)

// submission
export const apiProblemSubmission = (id, payload, config) => problemsRequest.post(`/${id}/submit`, payload, config)
export const apiProblemSubmissionItem = (id, submittedId, config) => problemsRequest.get(`/${id}/submissions/${submittedId}`, config)
export const apiProblemSubmissionItems = (id, config) => problemsRequest.get(`/${id}/submissions`, config)
export const apiTestSubmission = (id, payload) => problemsRequest.post(`/${id}/test`, payload)

// discussion
export const apiPostSend = (id, payload, config) => problemsRequest.post(`/${id}/discussion`, payload, config)
export const apiPostItems = (id) => problemsRequest.get(`/${id}/discussion`)

// single post
export const apiPostItem = (id, postId) => problemsRequest.get(`/${id}/discussion/${postId}`)
export const apiPostMessageItem = (id, postId) => problemsRequest.get(`/${id}/discussion/${postId}/messages`)
export const apiLeavePostMessage = (id, postId, payload, config) => problemsRequest.post(`/${id}/discussion/${postId}/messages`, payload, config)

// user
export const apiUserSignIn = (payload) => userRequest.post('/signin', payload)
export const apiUserSignUp = (payload) => userRequest.post('/signup', payload)
export const apiUserSubmissionItems = (config) => userRequest.get('/submissions', config)
export const apiUserProfile = (config) => userRequest.get('/profile', config)
export const apiUserProfileDetail = (config) => userRequest.get('/profile/details', config)

// assistance
export const apiAssistanceItem = (payload) => assistanceRequest.post('', payload)

// admin
export const apiAdminGetUsers = (config) => adminRequest.get('/users')
export const apiAdminGetSubmissions = (config) => adminRequest.get('/submissions')
export const apiAdminGetProblemList = (config) => adminRequest.get('/problemlist')
export const apiAdminUpdateProblem = (payload, config) => adminRequest.post('/problem', payload)
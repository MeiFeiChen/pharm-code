import axios from "axios";
export const domain = 'http://localhost:3000'


export const problemsRequest = axios.create({
  baseURL: `${domain}/api/problems`
});

export const apiProblemsItem = () => problemsRequest.get('')
export const apiProblemItem = (id) => problemsRequest.get(`/${id}`)

export const apiProblemSubmission = (id, payload) => problemsRequest.post(`/${id}/submit`, payload)

export const apiProblemSubmissionItem = (id, submittedId) => problemsRequest.get(`/${id}/submissions/${submittedId}`)
export const apiProblemSubmissionItems = (id) => problemsRequest.get(`/${id}/submissions`)
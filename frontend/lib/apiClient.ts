import * as Sentry from '@sentry/nextjs'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
})

apiClient.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    Sentry.captureException(error)
    return Promise.reject(error)
  }
)

export default apiClient

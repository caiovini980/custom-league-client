import { ApisauceInstance, CancelToken, create } from 'apisauce'

const cancelTokenSource = CancelToken.source

const apiSauceInstance = (url?: string): ApisauceInstance => {
  const instance = create({
    baseURL: url,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return instance
}

export { apiSauceInstance, cancelTokenSource }

import { ApiResponse } from 'apisauce'
import { ServerData } from '@render/typings/generic.typing'

export const parseResponseData = <T>(response: ApiResponse<ServerData<T>>): ServerData<T> => {
  const data = response.data

  if (data) {
    return {
      success: response.ok,
      body: data.body as never,
      msg: data.msg,
      code: data.code,
      status: data.status,
      headers: response.headers
    }
  }
  switch (response.problem) {
    case 'CANCEL_ERROR': {
      // eslint-disable-next-line no-console
      console.warn('request cancelada')
      break
    }
  }

  return {
    success: false,
    msg: response.problem || '',
    code: 'UNKNOWN_ERROR',
    status: `${response.status}` || '500',
    body: null
  }
}

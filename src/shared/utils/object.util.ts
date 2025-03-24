export const objectToQuery = (obj: Record<string, unknown>): string => {
  let query = '?'

  const trs = (ob: Record<string, unknown>, key: null | string = null) => {
    Object.entries(ob).map((elem) => {
      if (typeof elem[1] !== 'object') {
        if (key) {
          query += `${key}[${elem[0]}]=${elem[1]}&`
        } else if (elem[1] !== undefined) {
          query += elem[0] + '=' + elem[1] + '&'
        }
      } else {
        trs(<Record<string, unknown>>elem[1], elem[0])
      }
    })
  }
  trs(obj)

  return query.substring(0, query.length - 1)
}

export const objectToFormData = (obj: Record<string, any>) => {
  const formData = new URLSearchParams()
  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value as any)
  })

  return formData
}

export const queryToObject = (query: string) => {
  let queryString = query

  if (query.startsWith('?')) {
    queryString = query.slice(1)
  }

  const obj: Record<string, any> = {}

  if (queryString) {
    queryString = queryString.split('#')[0]
    const arr = queryString.split('&')

    for (let i = 0; i < arr.length; i++) {
      // separate the keys and the values
      const [paramName, ...paramValueSplit] = arr[i].split('=')
      // set parameter name and value (use 'true' if empty)
      const paramValueTemp = paramValueSplit.join('=')
      const paramValue = typeof paramValueTemp === 'undefined' ? true : paramValueTemp

      // (optional) keep case consistent
      // paramName = paramName.toLowerCase();
      // if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {
        // create key if it doesn't exist
        const key = paramName.replace(/\[(\d+)?\]/, '')
        if (!obj[key]) obj[key] = []

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          const index = /\[(\d+)\]/.exec(paramName)
          if (index) {
            obj[key][index[1]] = paramValue
          }
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue)
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]]
          obj[paramName].push(paramValue)
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue)
        }
      }
    }
  }

  return obj
}

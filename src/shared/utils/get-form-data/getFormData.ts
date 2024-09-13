
export const getFormData = <T extends Record<string, any>>( elem: HTMLFormElement ): T => {
  
  const formData = new FormData(elem)

  //@ts-ignore
  const data = [...formData]

  return data.reduce<any>((acc, arr) => {
    acc[arr[0]] = arr[1]
    return acc
  }, {})
}
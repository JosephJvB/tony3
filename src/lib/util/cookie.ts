export const getCookie = (key: string) =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
    ?.split('=')[1]

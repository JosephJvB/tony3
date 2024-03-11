import type { MiddlewareHandler } from 'astro'

export const onRequest: MiddlewareHandler = async (
  { cookies, redirect, request },
  next
) => {
  const PRE_AUTH_URLS = ['/', '/callback']
  if (PRE_AUTH_URLS.includes(new URL(request.url).pathname)) {
    return next()
  }

  const token = cookies.get('spotify_token')
  if (!token?.value) {
    return redirect('/')
  }

  return next()
}

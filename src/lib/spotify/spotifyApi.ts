import type { ISpotifyProfile, ISpotifyTokenResponse } from 'jvb-spotty-models'

export const getBasicAuthHeaders = () => {
  const basicAuth = Buffer.from(
    [
      import.meta.env.SPOTIFY_CLIENT_ID,
      import.meta.env.SPOTIFY_CLIENT_SECRET,
    ].join(':')
  ).toString('base64')

  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${basicAuth}`,
  }
}

export const getCallbackUrl = () => {
  const searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: import.meta.env.SPOTIFY_CLIENT_ID,
    scope:
      'user-read-private user-read-email user-top-read user-read-recently-played',
    redirect_uri: import.meta.env.PUBLIC_SPOTIFY_REDIRECT_URL,
  })

  return 'https://accounts.spotify.com/authorize?' + searchParams
}

export type SpotifyToken = ISpotifyTokenResponse & {
  ts: number
}
export const submitAuthCode = async (authCode: string) => {
  const searchParams = new URLSearchParams({
    code: authCode,
    grant_type: 'authorization_code',
    redirect_uri: import.meta.env.PUBLIC_SPOTIFY_REDIRECT_URL,
  })

  const response = await fetch(
    'https://accounts.spotify.com/api/token?' + searchParams,
    {
      method: 'post',
      headers: getBasicAuthHeaders(),
    }
  )

  const json = await response.json()

  if (!response.ok) {
    throw new Error('submitAuthCode failed:\n' + JSON.stringify(json))
  }

  return {
    ...json,
    ts: Date.now(),
  } as SpotifyToken
}

export const getProfile = async (token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error('getProfile failed:\n' + JSON.stringify(json))
  }

  return json as ISpotifyProfile
}

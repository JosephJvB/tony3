import { atom } from 'nanostores'

export type S3PlaylistJson = {
  id: string
  name: string
  description: string
  trackIds: string[]
}
export type ServerData<T> = {
  status: 'empty' | 'loaded' | 'fetching'
  data: T
}
export const s3Playlists = atom<ServerData<S3PlaylistJson[]>>({
  status: 'empty',
  data: [],
})

const loadS3PlaylistsJson = async () => {
  const response = await fetch(
    'https://tony2stack-web-assets.s3.eu-west-2.amazonaws.com/json/spotify-playlists.json'
  )
  const json = await response.json()

  if (!response.ok) {
    throw new Error('loadS3PlaylistsJson failed:\n' + JSON.stringify(json))
  }

  return json as S3PlaylistJson[]
}
s3Playlists.subscribe(async (state) => {
  if (state.status !== 'empty') {
    return
  }

  const nextState: ServerData<S3PlaylistJson[]> = {
    status: 'loaded',
    data: [],
  }

  try {
    nextState.data = await loadS3PlaylistsJson()
  } catch (error) {
    console.error(error)
  }

  s3Playlists.set(nextState)
})

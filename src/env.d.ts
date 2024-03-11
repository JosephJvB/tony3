/// <reference types="astro/client" />

import type { SpotifyToken } from './lib/spotify/spotifyApi'

interface ImportMetaEnv {
  readonly PUBLIC_SPOTIFY_REDIRECT_URL: string
  readonly SPOTIFY_CLIENT_ID: string
  readonly SPOTIFY_CLIENT_SECRET: string
}

import './globals.css'

export const metadata = {
  title: 'Downify - Download Media API',
  description: 'Download video from Instagram, Facebook, X, Threads, TikTok, Spotify, SoundCloud',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
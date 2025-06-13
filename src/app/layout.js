import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: "TinDoog",
  description: "Tinder for dogs",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

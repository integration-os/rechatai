// app/providers.tsx

import {NextUIProvider} from '@nextui-org/react'

export function NextUIProviders({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}
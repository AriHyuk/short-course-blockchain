import { cookieStorage, createStorage, http } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { avalancheFuji } from '@reown/appkit/networks'

// ⚠️ PASTE PROJECT ID KAMU DI SINI (Di dalam kutip)
export const projectId = 'd504798d99a362720552e4ed97f2e750'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [avalancheFuji]

//Setup Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
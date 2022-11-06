import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.BSC]: '0xC7689FbB6c65394157fb084caC4D327BAF14fd74',
  [SupportedChainId.ARBITRUM_ONE]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
}
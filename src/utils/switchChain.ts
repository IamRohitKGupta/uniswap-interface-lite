import { Connector } from '@web3-react/types'
import { getChainInfo } from '../constants/chainInfo'
import { isSupportedChain, SupportedChainId } from '../constants/chains'

export const switchChain = async (connector: Connector, chainId: SupportedChainId) => {
  if (!isSupportedChain(chainId)) {
    throw new Error(`Chain ${chainId} not supported for connector (${typeof connector})`)
  } else {
    const info = getChainInfo(chainId)
    const addChainParameter = {
      chainId,
      chainName: info.label,
      nativeCurrency: info.nativeCurrency,
      blockExplorerUrls: [info.explorer],
    }
    await connector.activate(addChainParameter)
  }
}

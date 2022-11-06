import { useWeb3React } from '@web3-react/core'
import { ConnectionType } from '../../connection'
import { NavBarVariant, useNavBarFlag } from '../../featureFlags/flags/navBar'
import styled from 'styled-components/macro'

import Identicon from '../Identicon'

const IconWrapper = styled.div<{ size?: number }>`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    align-items: flex-end;
  `};
`

const useIcon = (connectionType: ConnectionType) => {
  const { account } = useWeb3React()
  const isNavbarEnabled = useNavBarFlag() === NavBarVariant.Enabled

  if ((isNavbarEnabled) || connectionType === ConnectionType.INJECTED) {
    return <Identicon />
  } 

  return undefined
}

export default function StatusIcon({ connectionType, size }: { connectionType: ConnectionType; size?: number }) {
  const icon = useIcon(connectionType)

  return (
    <IconWrapper size={size ?? 16}>
      {icon}
    </IconWrapper>
  )
}

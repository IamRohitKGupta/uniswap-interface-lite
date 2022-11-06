import { Box, BoxProps } from '../../theme/helper/Box'
import { useIsMobile } from '../../hooks/useIsMobile'
import { ForwardedRef, forwardRef } from 'react'

import * as styles from './NavDropdown.css'

export const NavDropdown = forwardRef((props: BoxProps, ref: ForwardedRef<HTMLElement>) => {
  const isMobile = useIsMobile()
  return <Box ref={ref} className={isMobile ? styles.mobileNavDropdown : styles.NavDropdown} {...props} />
})

NavDropdown.displayName = 'NavDropdown'

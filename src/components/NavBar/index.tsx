import { Trans } from '@lingui/macro'
import Web3Status from '../Web3Status'
import { Box } from '../../theme/helper/Box'
import { Row } from '../../theme/helper/Flex'
import { UniIcon } from '../../theme/helper/icons'
import { ReactNode } from 'react'
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom'

import { ChainSelector } from './ChainSelector'
import { MenuDropdown } from './MenuDropdown'
import * as styles from './style.css'

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
}

interface MenuItemExtProps {
  href: string
  target: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
}

const MenuItem = ({ href, id, isActive, children }: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </NavLink>
  )
}

const MenuItemExt = ({ href, target, id, isActive, children }: MenuItemExtProps) => {
  return (
    <a
      href={href}
      target={target}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </a>
  )
}

const PageTabs = () => {
  const { pathname } = useLocation()

  return (
    <>
      <MenuItem href="/presale" isActive={pathname.startsWith('/presale')}>
        <Trans>Presale</Trans>
      </MenuItem>
      <MenuItemExt href="https://app.uniswap.org/" target="_blank">
        <Trans>Swap</Trans>
      </MenuItemExt>
    </>
  )
}

const Navbar = () => {
  const { pathname } = useLocation()

  return (
    <>
      <nav className={styles.nav}>
        <Box display="flex" height="full" flexWrap="nowrap" alignItems="stretch">
          <Box className={styles.leftSideContainer}>
            <Box as="a" href="#/swap" className={styles.logoContainer}>
              <UniIcon width="48" height="48" className={styles.logo} />
            </Box>
            <Box display={{ sm: 'flex', lg: 'none' }}>
              <ChainSelector leftAlign={true} />
            </Box>
            <Row gap="8" display={{ sm: 'none', lg: 'flex' }}>
              <PageTabs />
            </Row>
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box display={{ sm: 'none', lg: 'flex' }}>
                <MenuDropdown />
              </Box>
              <Box display={{ sm: 'none', lg: 'flex' }}>
                <ChainSelector />
              </Box>
              <Web3Status />
            </Row>
          </Box>
        </Box>
      </nav>
      <Box className={styles.mobileBottomBar}>
        <PageTabs />
        <Box marginY="4">
          <MenuDropdown />
        </Box>
      </Box>
    </>
  )
}

export default Navbar

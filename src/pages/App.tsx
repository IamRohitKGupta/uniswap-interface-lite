import Loader from '../components/Loader'
import { useFeatureFlagsIsLoaded } from '../featureFlags'
import { NavBarVariant, useNavBarFlag } from '../featureFlags/flags/navBar'
import { RedesignVariant, useRedesignFlag } from '../featureFlags/flags/redesign'
import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useIsDarkMode } from '../state/user/hooks'
import styled from 'styled-components/macro'
import { Z_INDEX } from '../theme/zIndex'

import { useAnalyticsReporter } from '../components/analytics'
import NavBar from '../components/NavBar'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import { RedirectPathToPresaleOnly } from './Presale/redirects'
import Presale from './Presale'


const AppWrapper = styled.div<{ redesignFlagEnabled: boolean }>`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  font-feature-settings: ${({ redesignFlagEnabled }) =>
    redesignFlagEnabled ? undefined : "'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on"};
`

const BodyWrapper = styled.div<{ navBarFlag: NavBarVariant }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ navBarFlag }) => (navBarFlag === NavBarVariant.Enabled ? `72px 0px 0px 0px` : `120px 0px 0px 0px`)};
  align-items: center;
  flex: 1;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    padding: 52px 0px 16px 0px;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: ${Z_INDEX.sticky};
`

const Marginer = styled.div`
  margin-top: 5rem;
`

// this is the same svg defined in assets/images/blue-loader.svg
// it is defined here because the remote asset may not have had time to load when this file is executing

export default function App() {
  const isLoaded = useFeatureFlagsIsLoaded()
  const navBarFlag = useNavBarFlag()
  const redesignFlagEnabled = useRedesignFlag() === RedesignVariant.Enabled

  const { pathname } = useLocation()
  const isDarkMode = useIsDarkMode()

  useAnalyticsReporter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <DarkModeQueryParamReader />
      <AppWrapper redesignFlagEnabled={redesignFlagEnabled}>
        
          <HeaderWrapper>
            <NavBar />
          </HeaderWrapper>
          <BodyWrapper navBarFlag={navBarFlag}>
            <Suspense fallback={<Loader />}>
              {isLoaded ? (
                <Routes>
                  <Route path="presale" element={<Presale />} />
                  <Route path="*" element={<RedirectPathToPresaleOnly />} />
                </Routes>
              ) : (
                <Loader />
              )}
            </Suspense>
            <Marginer />
          </BodyWrapper>
        
      </AppWrapper>
    </>
  )
}

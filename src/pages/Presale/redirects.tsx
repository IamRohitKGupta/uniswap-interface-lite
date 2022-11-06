import { useEffect } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useAppDispatch } from '../../state/hooks'

import { ApplicationModal, setOpenModal } from '../../state/application/reducer'

// Redirects to presale but only replace the pathname
export function RedirectPathToPresaleOnly() {
  const location = useLocation()
  return <Navigate to={{ ...location, pathname: '/presale' }} replace />
}

// Redirects from the /swap/:outputCurrency path to the /swap?outputCurrency=:outputCurrency format
export function RedirectToPresale() {
  const location = useLocation()
  const { search } = location
  const { outputCurrency } = useParams<{ outputCurrency: string }>()

  return (
    <Navigate
      to={{
        ...location,
        pathname: '/presale',
        search:
          search && search.length > 1
            ? `${search}&outputCurrency=${outputCurrency}`
            : `?outputCurrency=${outputCurrency}`,
      }}
      replace
    />
  )
}

export function OpenClaimAddressModalAndRedirectToPresale() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setOpenModal(ApplicationModal.ADDRESS_CLAIM))
  }, [dispatch])
  return <RedirectPathToPresaleOnly />
}

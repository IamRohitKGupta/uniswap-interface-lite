import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import multicall from '../lib/state/multicall'
import { load, save } from 'redux-localstorage-simple'
import { isTestEnv } from '../utils/env'

import application from './application/reducer'
import connection from './connection/reducer'
import { updateVersion } from './global/actions'
import transactions from './transactions/reducer'
import user from './user/reducer'
import wallets from './wallets/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const store = configureStore({
  reducer: {
    application,
    user,
    connection,
    transactions,
    wallets,
    multicall: multicall.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true })
      .concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: isTestEnv() }),
})

store.dispatch(updateVersion())

setupListeners(store.dispatch)

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

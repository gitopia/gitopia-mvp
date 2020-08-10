import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"

const { createAction } = buildActionCreator({
  prefix: "argit/"
})

export const updateRepositories: ActionCreator<{
  repositories: Repository[]
}> = createAction("update-repos")

export const loadAddress: ActionCreator<{
  address: string
}> = createAction("load-address")

export const loadKeyFile: ActionCreator<{
  keyFileName: string
}> = createAction("load-keyfile")

export const setIsAuthenticated: ActionCreator<{
  isAuthenticated: boolean
}> = createAction("set-is-authenticated")

export const openLoginModal: ActionCreator<{}> = createAction(
  "open-login-modal"
)

export const closeLoginModal: ActionCreator<{}> = createAction(
  "close-login-modal"
)

export const setActiveRepository: ActionCreator<{
  activeRepository: string
}> = createAction("set-active-repo")

export const loadNotifications: ActionCreator<{
  notifications: Notification[]
}> = createAction("load-notifications")

export type Repository = {
  name: string
  description: string
}
export type Notification = {
  type: string
  action: string
  txid: string
}
export type ArgitState = {
  repositories: Repository[]
  isAuthenticated: boolean
  address: string | null
  openedLoginModal: boolean
  keyFileName: string | null
  activeRepository: string | null
  notifications: Notification[]
}

const initialState: ArgitState = {
  repositories: [],
  isAuthenticated: false,
  address: null,
  openedLoginModal: false,
  keyFileName: null,
  activeRepository: null,
  notifications: []
}

export const reducer: Reducer<ArgitState> = createReducer(initialState)
  .case(setIsAuthenticated, (state, payload) => {
    return {
      ...state,
      isAuthenticated: payload.isAuthenticated
    }
  })
  .case(loadAddress, (state, payload) => {
    return {
      ...state,
      address: payload.address
    }
  })
  .case(updateRepositories, (state, payload) => {
    return {
      ...state,
      repositories: payload.repositories
    }
  })
  .case(openLoginModal, state => {
    return { ...state, openedLoginModal: true }
  })
  .case(closeLoginModal, state => {
    return { ...state, openedLoginModal: false }
  })
  .case(loadKeyFile, (state, payload) => {
    return { ...state, keyFileName: payload.keyFileName }
  })
  .case(loadNotifications, (state, payload) => {
    return { ...state, notifications: payload.notifications }
  })
  .case(setActiveRepository, (state, payload) => {
    return { ...state, activeRepository: payload.activeRepository }
  })

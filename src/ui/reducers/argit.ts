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
  repositories: []
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
export const userLogout: ActionCreator<{}> = createAction("user-logout")
export const setLastSynced: ActionCreator<{}> = createAction(
  "update-last-synced"
)

export const closeLoginModal: ActionCreator<{}> = createAction(
  "close-login-modal"
)

export const openSponsorModal: ActionCreator<{}> = createAction(
  "open-sponsor-modal"
)

export const closeSponsorModal: ActionCreator<{}> = createAction(
  "close-sponsor-modal"
)

export const setRepositoryURL: ActionCreator<{
  repositoryURL: string
}> = createAction("set-repository-url")

export const setRepositoryHead: ActionCreator<{
  repositoryHead: string | null
}> = createAction("set-repository-head")

export const updateFilterIndex: ActionCreator<{
  filterIndex: number
}> = createAction("update-filter-index")
export const loadRefs: ActionCreator<{
  refs: []
}> = createAction("load-refs")
export const updateCurrentRef: ActionCreator<{
  currentRef: string
}> = createAction("update-current-ref")

export const loadNotifications: ActionCreator<{
  notifications: Notification[]
}> = createAction("load-notifications")

export const setTxLoading: ActionCreator<{
  loading: boolean
}> = createAction("set-tx-loading")

export const setPageLoading: ActionCreator<{
  loading: boolean
}> = createAction("set-page-loading")

export const loadActivities: ActionCreator<{
  activities: Activity[]
}> = createAction("load-activities")

export const updateRepository: ActionCreator<{
  repository: {
    name: string
    description: string
    owner: { name: string }
  }
}> = createAction("update-repo")

export const updateMainItems: ActionCreator<{
  mainItems: { repos: {}; activities: {} }
}> = createAction("update-main-items")

export const updatePage: ActionCreator<{
  page: string
}> = createAction("update-page")
export const setWallet: ActionCreator<{
  wallet: string
}> = createAction("set-wallet")

export type Repository = {
  name: string
  description: string
  txid: string
  status: string
}
export type Notification = {
  type: string
  action: string
  txid: string
}

export type Activity = {
  txid: string
  type: string
  repoName: string
  key: string
  value: string
  unixTime: string
}

export type ArgitState = {
  repositories: []
  isAuthenticated: boolean
  address: string | null
  openedLoginModal: boolean
  openedSponsorModal: boolean
  keyFileName: string | null
  repositoryURL: string | null
  repositoryHead: string | null
  notifications: Notification[]
  txLoading: boolean
  pageLoading: boolean
  activities: Activity[]
  repository: {
    name: string
    description: string
    owner: { name: string }
  }
  filterIndex: Number
  mainItems: { repos: {}; activities: {} }
  page: string
  wallet: string
  lastSynced: number
  refs: []
  currentRef: string
}

const initialState: ArgitState = {
  repositories: [],
  isAuthenticated: false,
  address: null,
  openedLoginModal: false,
  openedSponsorModal: false,
  keyFileName: null,
  repositoryURL: null,
  repositoryHead: null,
  notifications: [],
  txLoading: false,
  pageLoading: false,
  activities: [],
  repository: {
    name: "",
    description: "",
    owner: { name: "" }
  },
  mainItems: { repos: {}, activities: {} },
  filterIndex: 0,
  page: "main",
  wallet: "",
  lastSynced: new Date().getTime(),
  refs: [],
  currentRef: "refs/heads/master"
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
  .case(openSponsorModal, state => {
    return { ...state, openedSponsorModal: true }
  })
  .case(closeSponsorModal, state => {
    return { ...state, openedSponsorModal: false }
  })
  .case(setRepositoryURL, (state, payload) => {
    return { ...state, repositoryURL: payload.repositoryURL }
  })
  .case(setRepositoryHead, (state, payload) => {
    return { ...state, repositoryHead: payload.repositoryHead }
  })
  .case(loadKeyFile, (state, payload) => {
    return { ...state, keyFileName: payload.keyFileName }
  })
  .case(loadNotifications, (state, payload) => {
    return { ...state, notifications: payload.notifications }
  })
  .case(setTxLoading, (state, payload) => {
    return { ...state, txLoading: payload.loading }
  })
  .case(setPageLoading, (state, payload) => {
    return { ...state, pageLoading: payload.loading }
  })
  .case(setWallet, (state, payload) => {
    return { ...state, wallet: payload.wallet }
  })
  .case(loadActivities, (state, payload) => {
    return { ...state, activities: payload.activities }
  })
  .case(updateRepository, (state, payload) => {
    return { ...state, repository: payload.repository }
  })
  .case(setLastSynced, state => {
    return { ...state, lastSynced: new Date().getTime() }
  })
  .case(updateMainItems, (state, payload) => {
    return {
      ...state,
      mainItems: { ...state.mainItems, ...payload.mainItems }
    }
  })
  .case(updateFilterIndex, (state, payload) => {
    return {
      ...state,
      filterIndex: payload.filterIndex
    }
  })
  .case(updatePage, (state, payload) => {
    return {
      ...state,
      page: payload.page
    }
  })
  .case(loadRefs, (state, payload) => {
    return {
      ...state,
      refs: payload.refs
    }
  })
  .case(updateCurrentRef, (state, payload) => {
    return {
      ...state,
      currentRef: payload.currentRef
    }
  })
  .case(userLogout, () => {
    return {
      ...initialState
    }
  })

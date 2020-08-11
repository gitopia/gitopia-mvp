import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"

const { createAction } = buildActionCreator({
  prefix: "navigation/"
})

export const updateRepositories: ActionCreator<{
  repositories: Repository[]
}> = createAction("update-repos")

export const changeActiveSidebarItem: ActionCreator<{
  activeItem: string
}> = createAction("load-address")

export const changeSidebarVisibility: ActionCreator<{
  sidebarVisibility: string
}> = createAction("load-keyfile")

export const changeSidebarPosition: ActionCreator<{
  sidebarPosition: string
}> = createAction("set-is-authenticated")

export const openSidebar: ActionCreator<{}> = createAction("open-sidebar")

export const closeSidebar: ActionCreator<{}> = createAction("close-sidebar")

export type Repository = {
  name: string
  description: string
}
export type NavigationState = {
  sidebarOpened: boolean
  activeItem: string
  sidebarPosition: string
  sidebarVisibility: string
}

const initialState: NavigationState = {
  sidebarOpened: false,
  activeItem: window.location.pathname,
  sidebarPosition: "left",
  sidebarVisibility: "show"
}

export const reducer: Reducer<NavigationState> = createReducer(initialState)
  .case(openSidebar, state => {
    return {
      ...state,
      sidebarOpened: true
    }
  })
  .case(closeSidebar, state => {
    return {
      ...state,
      sidebarOpened: false
    }
  })
  .case(changeSidebarPosition, (state, payload) => {
    return {
      ...state,
      sidebarPosition: payload.sidebarPosition
    }
  })
  .case(changeSidebarVisibility, (state, payload) => {
    return { ...state, sidebarVisibility: payload.sidebarVisibility }
  })
  .case(changeActiveSidebarItem, (state, payload) => {
    return { ...state, activeItem: payload.activeItem }
  })

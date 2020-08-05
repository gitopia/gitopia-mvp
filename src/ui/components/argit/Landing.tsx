import * as React from "react"
import { Root } from "../atoms/Root"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { LayoutManager } from "../organisms/LayoutManager"
import { Grid, GridArea } from "../utils/Grid"
import { connect } from "react-redux"
import {
  Repository,
  setIsAuthenticated,
  loadAddress,
  updateRepositories
} from "../../reducers/argit"
import { connector } from "../../actionCreators"
import { storage } from "redux-persist/lib/storage"
import Arweave from "arweave/web"
import delay from "delay"
import { Repositories } from "./Repositories"
import { HomePage } from "./HomePage"
import { DashboardNew } from "./DashboardNew"

// export const GlobalHeader = connector(
//     state => ({
//       mainLayout: state.app.mainLayout,
//       networkOnline: state.app.networkOnline,
//       currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
//     }),
//     actions => {
//       return {
//         pushScene: actions.app.pushScene,
//         openLoginModal: actions.argit.openLoginModal
//       }
//     }
//   )(function GlobalHeaderImpl(props) {
//     return (

//     )
//   })
export const Landing = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated,
    repositories: state.argit.repositories,
    address: state.argit.address
  }),
  actions => ({})
)(function LandingImpl(props) {
  //   if props.isAuthenticated) {
  //     return
  //   }

  //   console.log(txids)
  //   let repository = {}

  return (
    <Root data-testid="main">
      {/* prettier-ignore */}
      <Grid
        columns={[]}
        rows={[

        ]}
        areas={[

        ]}
        width="100vw"
        height="100vh"
      >
        { props.isAuthenticated &&
        <GridArea
          name="header"
        >
         <GlobalHeader />
        </GridArea>
}
        { props.isAuthenticated &&  <DashboardNew />}

          {/* <LayoutManager /> */}
         {!props.isAuthenticated && <HomePage />}
        
      </Grid>
    </Root>
  )
})

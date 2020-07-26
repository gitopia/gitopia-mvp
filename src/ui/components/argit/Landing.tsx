import * as React from "react"
import { Root } from "../atoms/Root"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { LayoutManager } from "../organisms/LayoutManager"
import { Grid, GridArea } from "../utils/Grid"
import { connect } from "react-redux"
import { setIsAuthenticated, loadAddress } from "../../reducers/argit"
import { connector } from "../../actionCreators"
import { lifecycle } from "recompose"
import { storage } from "redux-persist/lib/storage"
import Arweave from "arweave/web"
import delay from "delay"

type ConnectedProps = {
  isAuthenticated: boolean
  setIsAuthenticated: typeof setIsAuthenticated
  loadAddress: typeof loadAddress
}

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
    isAuthenticated: state.argit.isAuthenticated
  }),
  actions => {
    return {
      setIsAuthenticated: actions.argit.setIsAuthenticated,
      loadAddress: actions.argit.loadAddress
    }
  },
  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      // UI Boot
      await delay(150)
      const { isAuthenticated, ...actions } = this.props

      if (isAuthenticated) {
        const arweave = Arweave.init({})
        const address = await arweave.wallets.jwkToAddress(
          JSON.parse(String(sessionStorage.getItem("keyfile")))
        )
        actions.loadAddress({ address })
      }
    }
  })
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
        columns={["1fr"]}
        rows={[
          "32px",
          "1fr"
        ]}
        areas={[
          ["header"],
          ["content"]
        ]}
        width="100vw"
        height="100vh"
      >
        <GridArea
          name="header"
        >
          <GlobalHeader />
        </GridArea>
        <GridArea
          name="content"
        >
          {/* <LayoutManager /> */}
        </GridArea>
      </Grid>
    </Root>
  )
})

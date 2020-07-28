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
import { lifecycle } from "recompose"
import { storage } from "redux-persist/lib/storage"
import Arweave from "arweave/web"
import delay from "delay"
import { Link } from "react-router-dom"

type ConnectedProps = {
  isAuthenticated: boolean
  repositories: Repository[]
  setIsAuthenticated: typeof setIsAuthenticated
  loadAddress: typeof loadAddress
  updateRepositories: typeof updateRepositories
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
    isAuthenticated: state.argit.isAuthenticated,
    repositories: state.argit.repositories,
    address: state.argit.address
  }),
  actions => {
    return {
      loadAddress: actions.argit.loadAddress,
      updateRepositories: actions.argit.updateRepositories
    }
  },
  lifecycle<ConnectedProps, {}>({
    async componentDidUpdate(prevProps, prevState) {
      // UI Boot
      await delay(150)
      const { isAuthenticated, repositories, ...actions } = this.props

      if (isAuthenticated !== prevProps.isAuthenticated) {
        if (isAuthenticated) {
          const arweave = Arweave.init({})
          const address = await arweave.wallets.jwkToAddress(
            JSON.parse(String(sessionStorage.getItem("keyfile")))
          )
          actions.loadAddress({ address })

          const txids = await arweave.arql({
            op: "and",
            expr1: {
              op: "equals",
              expr1: "from",
              expr2: address
            },
            expr2: {
              op: "equals",
              expr1: "App-Name",
              expr2: "argit"
            }
          })

          const repositories = await Promise.all(
            txids.map(async txid => {
              let repository = {} as Repository
              const data: any = await arweave.transactions.getData(txid, {
                decode: true,
                string: true
              })
              try {
                const decoded: any = JSON.parse(data)
                repository = {
                  name: decoded.reponame,
                  description: decoded.description
                }
              } catch (error) {
                repository = {
                  name: txid,
                  description: "Pending confirmation"
                }
              }

              if (!repository) {
                repository = {
                  name: txid,
                  description: "null"
                }
              }

              return repository
            })
          )
          actions.updateRepositories({ repositories })
        }
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
        
          {/* <LayoutManager /> */}
          <React.Fragment>
      <h1>
        Repositories{" "}
        <Link to="/new">
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
        </Link>
      </h1>
      <div className="card mt-4">
        <div className="card-body">
          <Link to="/jflsdfjsl43df/test_repo/tree/master">Test Repository</Link>
          <p>lorem ipsum lorem ipsum</p>
        </div>
      </div>
      {props.repositories &&
        props.repositories.map(
          (repository) =>
            repository.name && (
              <div key={repository.name} className="card mt-4">
                <div className="card-body">
                  <Link to={`/${props.address}/${repository.name}`}>
                    {repository.name}
                  </Link>
                  <p>{repository.description}</p>
                </div>
              </div>
            )
        )}
    </React.Fragment>
        
      </Grid>
    </Root>
  )
})

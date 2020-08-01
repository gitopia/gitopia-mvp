import * as React from "react"
import { Link } from "react-router-dom"
import { connector } from "../../actionCreators/index"
import { lifecycle } from "recompose"
import { arweave } from "../../../index"
import "./HomePage.css"

import {
  Repository,
  setIsAuthenticated,
  loadAddress,
  updateRepositories
} from "../../reducers/argit"
import { Button } from "@blueprintjs/core"
export const HomePage = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal
  })
)(function HomePageImpl(props) {
  return (
    <React.Fragment>
      <header className="jumbotron jumbotron-fluid">
        <div className="container-fluid text-center">
          <h1 className="display-3">ArgitHub</h1>
          <p className="lead pb-4">
            Permanent Private Versioning for your Code
          </p>
          <p>
            <Button
              className="bp3-outlined bp3-large bp3-minimal"
              icon="log-in"
              onClick={() => props.openLoginModal({})}
            >
              Login
            </Button>
          </p>
        </div>
      </header>
    </React.Fragment>
  )
})

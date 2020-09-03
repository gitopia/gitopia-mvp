import { Button } from "@blueprintjs/core"
import * as React from "react"
import { connector } from "../../actionCreators/index"
import "./HomePage.css"

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
          <h1 className="display-3">dgit</h1>
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

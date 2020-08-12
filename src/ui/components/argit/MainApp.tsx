import * as React from "react"

// import "./LandingNew.css"
import "./styles/theme.scss"

// import { Button, Navbar, Alignment } from "@blueprintjs/core"
import { connector } from "../../actionCreators/index"
import { Layout } from "./Layout/Layout"
import { HashRouter } from "react-router-dom"
import { Route, Switch, Redirect } from "react-router-dom"
import { lifecycle } from "recompose"
import LandingNew from "./LandingNew"
import TailwindLanding from "./TailwindLanding"

export const MainApp = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal
  }),
  lifecycle<{}, {}>({
    componentDidMount() {
      const script = document.createElement("script")
      script.src = "./script.js"
      script.async = true

      document.body.appendChild(script)
    }
  })
)(function MainAppImpl(props) {
  if (props.isAuthenticated) return <LandingNew />
  else return <TailwindLanding />
})

export default MainApp

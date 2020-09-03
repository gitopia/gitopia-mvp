import * as React from "react"
import { lifecycle } from "recompose"
import { connector } from "../../actionCreators/index"
import LandingNew from "./LandingNew"
import "./styles/theme.scss"
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

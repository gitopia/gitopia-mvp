import * as React from "react"
import { connector } from "../../actionCreators/index"

export const NavBar = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal
  })
)(function NavBarImpl(props) {
  return (
    <nav className="navbar navbar-light bg-light static-top">
      <div className="container">
        <a className="navbar-brand" href="#">
          ArgitHub
        </a>
        <a
          className="btn btn-primary"
          href="#"
          onClick={() => props.openLoginModal({})}
        >
          Login
        </a>
      </div>
    </nav>
  )
})

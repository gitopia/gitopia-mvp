import Hammer from "rc-hammerjs"
import * as React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { connector } from "../../../actionCreators/index"
import { StackRouter } from "../../utils/StackRouter"
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory"
import { Commits } from "../commits"
import { Dashboard } from "../Dashboard/Dashboard"
import Header from "../Header/Header"
import PullRequest from "../PullRequest"
import { Repositories } from "../Repositories"
import { Sidebar } from "../Sidebar/Sidebar"
import s from "./Layout.module.scss"
import dlogo from "../../argit/images/dlogo.svg"
import { Sponsor } from "../Sponsor"

export const Layout = connector(
  state => ({
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    sidebarPosition: state.navigation.sidebarPosition,
    sidebarVisibility: state.navigation.sidebarVisibility,
    notifications: state.argit.notifications
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal,
    openSidebar: actions.navigation.openSidebar,
    setIsAuthenticated: actions.argit.setIsAuthenticated,
    updateRepositories: actions.argit.updateRepositories,
    loadNotifications: actions.argit.loadNotifications
  })
)(function LayoutImpl(props) {
  return (
    <div className="app-body">
      <nav className="landing-nav">
        <div
          className="landing-logo"
          onClick={() =>
            props.isAuthenticated
              ? window.location.replace(`/#/${props.address}`)
              : window.location.replace(`/`)
          }
        >
          <img src={dlogo} height="48px" width="48px" />
        </div>
        {props.isAuthenticated && (
          <Header
            {...props}
            setIsAuthenticated={props.setIsAuthenticated}
            updateRepositories={props.updateRepositories}
            updateNotifications={props.loadNotifications}
            notifications={props.notifications}
            address={props.address}
          />
        )}
        {!props.isAuthenticated && (
          <ul className="landing-menu">
            {/* <li className="landing-menu__item">
  <a
    href="doc.html"
    className="landing-a landing-link landing-link--dark"
  >
    <i className="fa fa-book" /> Documentation
  </a>
</li> */}
            <li className="landing-menu__item landing-toggle">
              <a
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
            <li className="landing-menu__item">
              <a
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
          </ul>
        )}
      </nav>
      <Hammer>
        <main className={s.content}>
          {/* {props.isAuthenticated && (
                <BreadcrumbHistory url={props.location.pathname} />
              )} */}
          <TransitionGroup>
            <CSSTransition
              key={props.location.key}
              classNames="fade"
              timeout={200}
            >
              <Switch>
                <Route
                  path="/:wallet_address"
                  exact
                  render={props => <Repositories {...props} />}
                />
                <Route
                  path="/:wallet_address/:repo_name"
                  exact
                  component={StackRouter}
                />
                <Route
                  path="/:wallet_address/:repo_name/commits"
                  exact
                  component={Commits}
                />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </main>
      </Hammer>
      <footer className="landing-footer">
        Made with <span style={{ color: "#e25555" }}>&#9829;</span>
        &nbsp; by{" "}
        <span className="font-bold">
          <a
            href="https://thechtrap.com/"
            target="_blank"
            className="landing-a landing-link link--dark"
          >
            TheTechTrap
          </a>
        </span>
        .
      </footer>
    </div>
  )
})

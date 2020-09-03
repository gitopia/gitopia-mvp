import Hammer from "rc-hammerjs"
import * as React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { connector } from "../../../actionCreators/index"
import { StackRouter } from "../../utils/StackRouter"
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory"
import { Commits } from "../commits"
import { DashboardNew } from "../DashboardNew/DashboardNew"
import Header from "../Header/Header"
import PullRequest from "../PullRequest"
import { Repositories } from "../Repositories"
import { Sidebar } from "../Sidebar/Sidebar"
import s from "./Layout.module.scss"

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
    <div
      className={[
        s.root,
        "sidebar-" + props.sidebarPosition,
        "sidebar-" + props.sidebarVisibility
      ].join(" ")}
    >
      <div className={s.wrap}>
        <Header
          {...props}
          setIsAuthenticated={props.setIsAuthenticated}
          updateRepositories={props.updateRepositories}
          updateNotifications={props.loadNotifications}
          notifications={props.notifications}
          address={props.address}
        />

        <Sidebar />
        <Hammer>
          <main className={s.content}>
            <BreadcrumbHistory url={props.location.pathname} />
            <TransitionGroup>
              <CSSTransition
                key={props.location.key}
                classNames="fade"
                timeout={200}
              >
                <Switch>
                  <Route
                    path="/app/main/repository/:wallet_address/:repo_name"
                    exact
                    component={StackRouter}
                  />
                  <Route
                    path="/app/main/repository/:wallet_address/:repo_name/commits"
                    exact
                    component={Commits}
                  />
                  <Route
                    path="/app/main"
                    exact
                    render={() => <Redirect to="/app/main/dashboard" />}
                  />
                  <Route
                    path="/app/main/dashboard"
                    exact
                    component={DashboardNew}
                  />
                  <Route
                    path="/app/main/repositories"
                    exact
                    render={props => <Repositories {...props} />}
                  />
                  <Route
                    path="/app/main/pulls"
                    exact
                    render={props => <PullRequest />}
                  />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
            <footer className={s.contentFooter}>
              dgit - Open versioning Hub, made by <a href="#">Tech Trap LLP</a>
            </footer>
          </main>
        </Hammer>
      </div>
    </div>
  )
})

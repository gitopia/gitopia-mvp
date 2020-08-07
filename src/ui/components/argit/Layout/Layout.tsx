import * as React from "react"
import { connector } from "../../../actionCreators/index"
import { Switch, Route, withRouter, Redirect } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import Hammer from "rc-hammerjs"

// import UIIcons from "../../pages/components/icons";
// import UINotifications from "../../pages/notifications";
// import TablesStatic from "../../pages/tables/static";
// import MapsGoogle from "../../pages/components/maps/google";
// import CoreTypography from "../../pages/typography";
// import Charts from "../../pages/components/charts/Charts";

import Header from "../Header/Header"
import { Sidebar } from "../Sidebar/Sidebar"
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory"
import { openSidebar, closeSidebar } from "../../../reducers/navigation"
import s from "./Layout.module.scss"
import { DashboardNew } from "../DashboardNew/DashboardNew"
import { setIsAuthenticated } from "../../../reducers/argit"
import { Repositories } from "../Repositories"
import { StackRouter } from "../../utils/StackRouter"

export const Layout = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated,
    sidebarPosition: state.navigation.sidebarPosition,
    sidebarVisibility: state.navigation.sidebarVisibility
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal,
    openSidebar: actions.navigation.openSidebar,
    setIsAuthenticated: actions.argit.setIsAuthenticated,
    updateRepositories: actions.argit.updateRepositories
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
        />
        {/* <Chat chatOpen={this.state.chatOpen} /> */}
        {/* <Helper /> */}
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

                  {/* <Route path="/app/icons" exact component={UIIcons} />
                  <Route
                    path="/app/notifications"
                    exact
                    component={UINotifications}
                  />
                  <Route path="/app/charts" exact component={Charts} />
                  <Route path="/app/tables" exact component={TablesStatic} />
                  <Route path="/app/maps" exact component={MapsGoogle} />
                  <Route
                    path="/app/typography"
                    exact
                    component={CoreTypography}
                  /> */}
                </Switch>
              </CSSTransition>
            </TransitionGroup>
            <footer className={s.contentFooter}>
              ArgitHub - Open versioning Hub, made by{" "}
              <a href="#">Tech Trap LLP</a>
            </footer>
          </main>
        </Hammer>
      </div>
    </div>
  )
})

import * as React from "react"
import { Link } from "react-router-dom"
import { connector } from "../../actionCreators/index"
import { Switch, Route, withRouter, Redirect } from "react-router"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import Hammer from "rc-hammerjs"

// import UIIcons from "../../pages/components/icons";
// import UINotifications from "../../pages/notifications";
// import TablesStatic from "../../pages/tables/static";
// import MapsGoogle from "../../pages/components/maps/google";
// import CoreTypography from "../../pages/typography";
// import Charts from "../../pages/components/charts/Charts";
import { DashboardNew } from "./DashboardNew"

// import Header from "../Header";
// import Sidebar from "../Sidebar";
// import BreadcrumbHistory from "../BreadcrumbHistory";
import { openSidebar, closeSidebar } from "../../reducers/navigation"
import s from "./Layout.module.scss"

export const Layout = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated,
    sidebarPosition: state.navigation.sidebarPosition,
    sidebarVisibility: state.navigation.sidebarVisibility,
    location: { key: "s" }
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal,
    openSidebar: actions.navigation.openSidebar
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
        {/* <Header /> */}
        {/* <Chat chatOpen={this.state.chatOpen} /> */}
        {/* <Helper /> */}
        {/* <Sidebar /> */}
        <Hammer>
          <main className={s.content}>
            {/* <BreadcrumbHistory url={props.location.pathname} /> */}
            <TransitionGroup>
              <CSSTransition
                key={props.location.key}
                classNames="fade"
                timeout={200}
              >
                <DashboardNew />
                {/* <Switch>
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
                  <Route path="/app/icons" exact component={UIIcons} />
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
                  />
                </Switch> */}
              </CSSTransition>
            </TransitionGroup>
            <footer className={s.contentFooter}>
              Light Blue React Template - React admin template made by{" "}
              <a href="https://flatlogic.com">Flatlogic</a>
            </footer>
          </main>
        </Hammer>
      </div>
    </div>
  )
})

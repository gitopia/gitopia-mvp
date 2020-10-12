import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { LandingNew } from "./argit/LandingNew"
import { LoginModal } from "./argit/loginModal"
import { CreateRepoModal } from "./organisms/CreateRepoModal"
import { GlobalErrorBoundary } from "./utils/GlobalErrorBoundary"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import { StackRouter } from "./utils/StackRouter"
import { Layout } from "./argit/Layout/Layout"
import { Sponsor } from "./argit/Sponsor"
export class App extends React.Component<{}> {
  render() {
    const { store, persistor } = configureStore()
    return (
      <GlobalErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <GlobalKeyHandler>
              <HashRouter>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={(props: any) => <LandingNew {...props} />}
                  />

                  <Route
                    path="/:wallet_address/"
                    render={(props: any) => <Layout {...props} />}
                  />
                  <Route default component={LandingNew} />
                </Switch>
              </HashRouter>
              <LoginModal />
              <CreateRepoModal />
            </GlobalKeyHandler>
          </PersistGate>
        </Provider>
      </GlobalErrorBoundary>
    )
  }
}

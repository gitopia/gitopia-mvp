import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { LandingNew } from "./argit/LandingNew"
import { LoginModal } from "./argit/loginModal"
import { GlobalErrorBoundary } from "./utils/GlobalErrorBoundary"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import { Layout } from "./argit/Layout/Layout"
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
                    path="/:wallet_address/:repo_name?"
                    render={(props: any) => <Layout {...props} />}
                  />
                  <Route default component={LandingNew} />
                </Switch>
              </HashRouter>
              <LoginModal />
            </GlobalKeyHandler>
          </PersistGate>
        </Provider>
      </GlobalErrorBoundary>
    )
  }
}

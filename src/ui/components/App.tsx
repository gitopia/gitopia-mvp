import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { Landing } from "./argit/Landing"
import { LoginModal } from "./argit/loginModal"
import { CreateRepoModal } from "./organisms/CreateRepoModal"
import { GlobalErrorBoundary } from "./utils/GlobalErrorBoundary"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"
import { HashRouter, Switch, Route } from "react-router-dom"
import { StackRouter } from "./utils/StackRouter"

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
                    render={(props: any) => <Landing {...props} />}
                  />
                  <Route
                    path="/app/main/repository/:wallet_address/:repo_name"
                    component={StackRouter}
                  />
                  <Route default component={Landing} />
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

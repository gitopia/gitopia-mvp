import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { CloneRepoModal } from "./organisms/CloneRepoModal"
import { CreateRepoModal } from "./organisms/CreateRepoModal"
import { Playground } from "./pages/Playground"
import { GlobalErrorBoundary } from "./utils/GlobalErrorBoundary"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"
import { Initializer } from "./utils/Initializer"
import { MediaDetector } from "./utils/MediaDetector"
import { OnlineDetector } from "./utils/OnlineDetector"
import { StackRouter } from "./utils/StackRouter"
import { ThemeProvider } from "./utils/ThemeProvider"
import { LoginModal } from "./argit/loginModal"
import { Landing } from "./argit/Landing"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { NavBar } from "./argit/navBar"
import { LandingNew } from "./argit/LandingNew"

// debug area
const ENTER_PLAYGROUND = false
const LandingPage = true

export class App extends React.Component<{}> {
  render() {
    const { store, persistor } = configureStore()
    return (
      <BrowserRouter>
        <GlobalErrorBoundary>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <GlobalKeyHandler>
                {/* <ThemeProvider> */}
                {/* <Initializer> */}
                {/* <NavBar /> */}
                <Switch>
                  <Route
                    path="/:wallet_address/:repo_name"
                    component={StackRouter}
                  />
                  <Route exact path="/" component={LandingNew} />
                </Switch>
                {/* <OnlineDetector />
                <LoginModal />
                <CreateRepoModal />
                <CloneRepoModal /> */}
                {/* <MediaDetector /> */}
                {/* </Initializer>
                </ThemeProvider> */}
              </GlobalKeyHandler>
            </PersistGate>
          </Provider>
        </GlobalErrorBoundary>
      </BrowserRouter>
    )
  }
}

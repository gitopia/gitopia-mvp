import * as React from "react"
import { connector } from "../../actionCreators"
import { Root } from "../atoms/Root"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { Grid, GridArea } from "../utils/Grid"
import { DashboardNew } from "./DashboardNew"
import { HomePage } from "./HomePage"

export const Landing = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated,
    repositories: state.argit.repositories,
    address: state.argit.address
  }),
  actions => ({})
)(function LandingImpl(props) {
  return (
    <Root data-testid="main">
      {/* prettier-ignore */}
      <Grid
        columns={[]}
        rows={[

        ]}
        areas={[

        ]}
        width="100vw"
        height="100vh"
      >
        { props.isAuthenticated &&
        <GridArea
          name="header"
        >
         <GlobalHeader />
        </GridArea>
}
        { props.isAuthenticated &&  <DashboardNew />}

          {/* <LayoutManager /> */}
         {!props.isAuthenticated && <HomePage />}
        
      </Grid>
    </Root>
  )
})

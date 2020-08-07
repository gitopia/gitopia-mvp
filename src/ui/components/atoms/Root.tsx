import styled from "styled-components"
import darkTheme from "../../themes/dark"

export const Root = styled.div`
  width: 100vw;
  height: 100vw;
  background: ${p => darkTheme.main};
  color: ${p => darkTheme.textColor};
  padding: 0;
  margin: 0;
`
Root.displayName = "Root"

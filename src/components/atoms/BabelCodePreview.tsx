import React from "react"
import styled from "styled-components"
import { compileWithBabel } from "../../lib/babel"

type Props = { source: string }

export class BabelCodePreview extends React.Component<Props, {}> {
  render() {
    const { source } = this.props
    const ret = compileWithBabel(source)
    return (
      <Container>
        <pre>{ret}</pre>
      </Container>
    )
  }
}

const Container = styled.div`
  padding: 10px;
`

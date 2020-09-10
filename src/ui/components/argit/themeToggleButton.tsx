import * as React from "react"
import styled from "styled-components"
import { connector } from "../../actionCreators/index"

const Button = styled.i`
  cursor: pointer;
`

type ThemeToggleButtonProps = {
  theme: string
  setConfigValue: any
}

export const ThemeToggleButton = connector(
  state => ({
    theme: state.config.theme
  }),
  actions => ({
    setConfigValue: actions.config.setConfigValue
  })
)(function ThemeToggleButtonImpl(props: ThemeToggleButtonProps) {
  const toggle = () => {
    const theme = props.theme === "github" ? "monokai" : "github"
    props.setConfigValue({
      key: "theme",
      value: theme
    })
  }

  return (
    <div className="float-right">
      {"dark  "}
      <Button
        onClick={toggle}
        className={`fa fa-toggle-${props.theme === "monokai" ? "on" : "off"}`}
        aria-hidden="true"
      />
    </div>
  )
})

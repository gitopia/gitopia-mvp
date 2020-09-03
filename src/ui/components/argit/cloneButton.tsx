import * as React from "react"
import {
  Button,
  PopoverBody,
  PopoverHeader,
  UncontrolledPopover
} from "reactstrap"
import { connector } from "../../actionCreators/index"

type CloneButtonProps = {
  address: string
  projectRoot: string
}

export const CloneButton = connector(
  state => ({
    address: state.argit.address,
    projectRoot: state.project.projectRoot
  }),
  actions => ({})
)(function CloneButtonImpl(props: CloneButtonProps) {
  const url = `dgit://${props.address}${props.projectRoot}`

  return (
    <>
      <Button color="primary" id="Popover1" type="button">
        Clone
      </Button>
      <UncontrolledPopover
        placement="bottom"
        trigger="legacy"
        target="Popover1"
      >
        <PopoverHeader>Clone with argit</PopoverHeader>
        <PopoverBody>{url}</PopoverBody>
      </UncontrolledPopover>
    </>
  )
})

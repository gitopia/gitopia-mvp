import * as React from "react"
import { connector } from "../../actionCreators/index"
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap"

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
  const url = `argit://${props.address}${props.projectRoot}`

  return (
    <>
      <Button color="primary" id="Popover1" type="button">
        Clone
      </Button>
      <UncontrolledPopover placement="bottom" trigger="focus" target="Popover1">
        <PopoverHeader>Clone with argit</PopoverHeader>
        <PopoverBody>
          argit cloneFromArweave --url="
          {url}"
        </PopoverBody>
      </UncontrolledPopover>
    </>
  )
})

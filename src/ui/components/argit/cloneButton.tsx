import React, { useState } from "react"
import { connector } from "../../actionCreators/index"
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap"

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
  const [popoverOpen, setPopoverOpen] = useState(false)
  const toggle = () => setPopoverOpen(!popoverOpen)
  const url = `argit://${props.address}${props.projectRoot}`

  return (
    <div>
      <Button
        className="float-right"
        color="primary"
        id="Popover1"
        type="button"
      >
        Clone
      </Button>
      <Popover
        placement="bottom"
        isOpen={popoverOpen}
        target="Popover1"
        toggle={toggle}
      >
        <PopoverHeader>Clone with argit</PopoverHeader>
        <PopoverBody>
          argit cloneFromArweave --url=$
          {url}
        </PopoverBody>
      </Popover>
    </div>
  )
})

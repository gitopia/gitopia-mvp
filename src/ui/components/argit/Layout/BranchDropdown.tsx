import React, { useState } from "react"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"

function getBranchFromRef(ref) {
  return ref.split("refs/heads/")[1]
}
const BranchDropdown = props => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState)
  console.log(props.refs)
  return (
    <Dropdown
      direction="right"
      isOpen={dropdownOpen}
      toggle={toggle}
      className="dropdown-show-br"
    >
      <DropdownToggle caret={true} className="dropdown-br">
        {getBranchFromRef(props.currentRef)}
      </DropdownToggle>
      <DropdownMenu>
        {props.refs &&
          props.refs.map(ref => {
            return (
              <DropdownItem
                disabled={ref === props.currentRef}
                onClick={() => {
                  props.updateCurrentRef({ currentRef: ref })
                }}
              >
                {getBranchFromRef(ref)}
              </DropdownItem>
            )
          })}
      </DropdownMenu>
    </Dropdown>
  )
}

export default BranchDropdown

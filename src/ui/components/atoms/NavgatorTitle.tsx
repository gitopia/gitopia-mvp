import { Icon, Position, Tooltip } from "@blueprintjs/core"
import React from "react"
import { Link } from "react-router-dom"

export function NavigatorTitle(props: { networkOnline: boolean }) {
  return (
    <>
      <Link className="navbar-brand" to="/" style={{ color: "#FFF" }}>
        dgit &nbsp;
      </Link>
      <Tooltip
        content={props.networkOnline ? "online mode" : "offline mode"}
        lazy={false}
        position={Position.BOTTOM}
      >
        <Icon
          icon="offline"
          iconSize={16}
          style={{
            paddingTop: 3,
            color: props.networkOnline ? "#9f9" : "#f99"
          }}
        />
      </Tooltip>
    </>
  )
}

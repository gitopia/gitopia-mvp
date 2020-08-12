import { Card } from "@blueprintjs/core"
import React from "react"
import pkg from "../../../../package.json"
import { PluginEntryArea } from "./PluginEntryArea"

export class Entry extends React.Component<any> {
  render() {
    return (
      <Card style={{ height: "100%" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1>dgit v{pkg.version}</h1>
          <p>
            This is pre alpha version. There is a possibility you lose data by
            upgrade without notice
          </p>

          <PluginEntryArea />
        </div>
      </Card>
    )
  }
}

;(process as any).browser = true

import React from "react"
import ReactDOM from "react-dom"
import { App } from "./ui/components/App"

export async function run(opts = {}) {
  await Promise.all([loadBrowserFS()])
  ReactDOM.render(<App />, document.querySelector(".root"))
}

async function loadBrowserFS() {
  return new Promise(resolve => {
    const BrowserFS = require("browserfs")
    BrowserFS.install(window)
    BrowserFS.configure({ fs: "IndexedDB", options: {} }, (err: any) => {
      if (err) {
        throw err
      }

      resolve()
    })
  })
}

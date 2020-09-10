// This file will be override by SRC='src-modified' by webpack
import Arweave from "arweave/web"
import { run } from "./runApp"

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 300000
})

run()

// This file will be override by SRC='src-modified' by webpack
import { run } from "./runApp"
import Arweave from "arweave/web"

export const arweave = Arweave.init({})

run()

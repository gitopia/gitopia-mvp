import * as git from "isomorphic-git"
import fs from "fs"

export async function pushBranch(
  projectRoot: string,
  remote: string,
  ref: string,
  token: string,
  corsProxy: string
) {
  const ret = await (git.push as any)({
    fs,
    dir: projectRoot,
    remote,
    ref,
    corsProxy,
    token
  })

  if (ret.errors && ret.errors.length > 0) {
    console.log(ret.errors)
    throw new Error(ret.errors.join("|"))
  }
  return !!ret.ok
}

import * as git from "isomorphic-git"
import fs from "fs"

export function commitChanges(
  projectRoot: string,
  message: string = "Update",
  author: { name: string; email: string }
): Promise<string> {
  return git.commit({
    fs,
    author,
    dir: projectRoot,
    message
  })
}

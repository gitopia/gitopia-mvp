import fs from "fs"
import * as git from "isomorphic-git"

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

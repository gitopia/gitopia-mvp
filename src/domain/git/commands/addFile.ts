import * as git from "isomorphic-git"
import fs from "fs"

export function addFile(projectRoot: string, relpath: string): Promise<any> {
  return git.add({ fs, dir: projectRoot, filepath: relpath })
}

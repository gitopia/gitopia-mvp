import * as git from "isomorphic-git"
import fs from "fs"

export async function removeFromGit(
  projectRoot: string,
  filepath: string
): Promise<void> {
  await git.remove({ fs, dir: projectRoot, filepath })
}

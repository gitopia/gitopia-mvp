import * as git from "isomorphic-git"
import { GitStatusString } from "../../types"
import fs from "fs"

export async function getFileStatus(
  projectRoot: string,
  relpath: string,
  ref: string | null = null
): Promise<GitStatusString> {
  try {
    return await git.status({ fs, dir: projectRoot, filepath: relpath, ref })
  } catch (e) {
    return "__error__"
  }
}

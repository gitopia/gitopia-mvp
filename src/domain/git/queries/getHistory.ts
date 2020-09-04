import fs from "fs"
import * as git from "isomorphic-git"
import { ReadCommitResult } from "../../types"

export async function getHistory(
  projectRoot: string,
  { depth, ref = "master" }: { depth?: number; ref?: string }
): Promise<ReadCommitResult[]> {
  return git.log({ fs, dir: projectRoot, depth, ref })
}

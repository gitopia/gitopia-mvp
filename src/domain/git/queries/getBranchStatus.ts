import * as git from "isomorphic-git"
import flatten from "lodash/flatten"
import { CommitDescription } from "../../types"
import { getHistory } from "./getHistory"
import { getRemotes } from "./getRemotes"
import { listRemoteBranches } from "./listBranches"
import { browserFS as fs } from "../../../runApp"

export async function getBranchStatus(
  projectRoot: string
): Promise<{
  currentBranch: string
  branches: string[]
  history: CommitDescription[]
  remotes: string[]
  remoteBranches: string[]
}> {
  const currentBranch = await git.currentBranch({ fs, dir: projectRoot })
  const branches = await git.listBranches({ fs, dir: projectRoot })
  const remotes: string[] = (await git.listRemotes({
    fs,
    dir: projectRoot
  })).map((a: { remote: string; url: string }) => a.remote)

  const remoteBranches = flatten(
    await Promise.all(
      remotes.map(remote => listRemoteBranches(projectRoot, remote))
    )
  )

  const history = await getHistory(projectRoot, { ref: currentBranch })
  return {
    currentBranch,
    branches,
    remotes,
    remoteBranches,
    history
  }
}

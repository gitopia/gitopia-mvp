import fs from "fs"
import * as git from "isomorphic-git"
import * as Parser from "../queries/parseStatusMatrix"

export async function commitAll(
  root: string,
  message: string,
  author: { name: string; email: string }
): Promise<string> {
  const mat = await git.statusMatrix({ fs, dir: root })
  const modified = Parser.getModifiedFilenames(mat)
  const removable = Parser.getRemovableFilenames(mat)

  for (const filepath of modified) {
    if (removable.includes(filepath)) {
      await git.remove({ fs, dir: root, filepath })
    } else {
      // TODO: Why?????
      if (filepath) {
        await git.add({ fs, dir: root, filepath })
      }
    }
  }

  return git.commit({
    fs,
    dir: root,
    message,
    author
  })
}

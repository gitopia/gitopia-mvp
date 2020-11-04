import format from "date-fns/format"
import React, { useState, useEffect, useRef } from "react"
import { connector } from "../../actionCreators/index"
import { downloadGitObject } from "../utils/StackRouter"
import { readObject } from "isomorphic-git"
import fs from "fs"
import { arweave } from "../../../index"
import { getOidByRef } from "isomorphic-git/src/utils/arweave"
import { createNewProject } from "../../reducers/project"
import { updateCommits } from "../../reducers/git"
import NewContainer, { Icon, List } from "../argit/Repository/Container"
import {
  Owner,
  OwnerProfile,
  RepoInfo,
  Loading,
  PageNav
} from "../argit/Repository/RepositoryStyles"
import dlogo from "../argit/images/dlogo.svg"
import { Link } from "react-router-dom"
import * as git from "isomorphic-git"

function compareAge(a, b) {
  return a.committer.timestamp - b.committer.timestamp
}

async function* fetchCommits(arweave, url, ref, projectRoot) {
  await downloadGitObject(arweave, url, ref, projectRoot)
  const tips = [
    await readObject({ fs, dir: projectRoot, oid: ref, type: "parsed" })
  ]
  while (tips.length !== 0) {
    const commit = tips.pop()

    yield commit

    for (const oid of commit.object.parent) {
      await downloadGitObject(arweave, url, oid, projectRoot)
      const commit = await readObject({
        fs,
        dir: projectRoot,
        oid,
        type: "parsed"
      })
      if (!tips.map(commit => commit.oid).includes(commit.oid)) {
        tips.push(commit)
      }
    }
    tips.sort((a, b) => compareAge(a.object, b.object))
  }
}

type CommitsProps = {
  currentBranch: string
  commits: any[]
  match: any
  createNewProject: typeof createNewProject
  updateCommits: typeof updateCommits
  currentRef: string
}

let commitGen: AsyncGenerator<any, void, unknown> | null = null
const numCommitsPerPage = 15

export const Commits = connector(
  state => ({
    currentBranch: state.git.currentBranch,
    commits: state.git.commits,
    currentRef: state.argit.currentRef
  }),
  actions => ({
    createNewProject: actions.project.createNewProject,
    updateCommits: actions.git.updateCommits
  })
)(function CommitsImpl(props: CommitsProps) {
  const { match, currentRef, commits, createNewProject, updateCommits } = props
  const prevRef = usePrevious(currentRef)
  const [offset, setOffset] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)
  const commitsToDisplay = commits.slice(offset, offset + numCommitsPerPage)
  const lastCommitInPage = commitsToDisplay[commitsToDisplay.length - 1]

  const handlePage = (option: string) => {
    if (option === "back") {
      setOffset(offset - numCommitsPerPage)
      return
    }
    setOffset(offset + numCommitsPerPage)
  }

  useEffect(
    () => {
      const componentDidMount = async () => {
        setPageLoading(true)
        const url = `gitopia://${match.params.wallet_address}/${
          match.params.repo_name
        }`
        const newProjectRoot = `/${match.params.repo_name}`
        const { oid } = await getOidByRef(arweave, url, props.currentRef)
        const commits = []

        createNewProject({ newProjectRoot })
        await git.init({ fs, dir: newProjectRoot })

        commitGen = await fetchCommits(arweave, url, oid, newProjectRoot)

        for (let i = 0; i < numCommitsPerPage; i++) {
          const commit = await commitGen.next()
          if (!commit.value) break
          commits.push(commit.value)
        }

        updateCommits({ commits })
        setPageLoading(false)
      }

      const componentDidUpdate = async () => {
        setPageLoading(true)
        if (offset === commits.length) {
          const newCommits = []

          for (let i = 0; i < numCommitsPerPage; i++) {
            const commit = await commitGen.next()
            if (!commit.value) break
            newCommits.push(commit.value)
          }
          updateCommits({ commits: [...commits, ...newCommits] })
        }
        setPageLoading(false)
      }

      if (commits.length === 0 || currentRef !== prevRef) {
        setOffset(0)
        componentDidMount()
      } else {
        componentDidUpdate()
      }
    },
    [offset, currentRef]
  )

  return (
    <>
      {pageLoading ? (
        <Loading loading={pageLoading ? 1 : 0}>
          <i className="fa fa-spinner fa-spin" />
        </Loading>
      ) : (
        <>
          {commitsToDisplay &&
            commitsToDisplay.map(commit => (
              <li key={commit.oid}>
                <div>
                  <img
                    src={`https://avatars.dicebear.com/api/initials/${commit.object.committer.name.split(
                      " "
                    )[0] || ""}.svg`}
                    alt={commit.object.committer.name}
                  />
                  <span>
                    {format(
                      commit.object.committer.timestamp * 1000,
                      "MM/DD/YYYY HH:mm"
                    )}
                    {"  "}
                  </span>
                  <span>
                    {commit.object.committer.name}
                    {"  committed  "}
                  </span>
                  <span>{commit.object.message}</span>
                  <span>
                    {"  "}
                    {commit.oid}
                  </span>
                </div>
              </li>
            ))}
        </>
      )}
      <PageNav>
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={offset === 0}
        >
          Newer
        </button>
        <button
          type="button"
          onClick={() => handlePage("next")}
          disabled={
            lastCommitInPage && lastCommitInPage.object.parent.length === 0
          }
        >
          Older
        </button>
      </PageNav>
    </>
  )
})

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

import { format } from "date-fns"
import fs from "fs"
import * as git from "isomorphic-git"
import * as pkg from "isomorphic-git/src/utils/arweave"
const { getOidByRef } = pkg
import { fetchGitObject } from "isomorphic-git/src/utils/arweave"
import React, { lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { CardBody, Col, Row, Container } from "reactstrap"
import { lifecycle } from "recompose"
import { ReadCommitResult } from "../../../domain/types"
import { arweave } from "../../../index"
import dlogo from "../argit/images/dlogo.svg"

import { connector } from "../../actionCreators"
import {
  deleteProject,
  startProjectRootChanged
} from "../../actionCreators/editorActions"
import { Editor } from "../../components/argit/editor"
import {
  setPageLoading,
  setRepositoryURL,
  setRepositoryHead,
  updateRepository,
  updatePage
} from "../../reducers/argit"
import { createNewProject } from "../../reducers/project"
import { RepositoryBrowser } from "../organisms/RepositoryBrowser"
import { Sponsor } from "../argit/Sponsor"
import NewContainer, { Icon } from "../argit/Repository/Container"
import {
  Button,
  PopoverBody,
  PopoverHeader,
  UncontrolledPopover
} from "reactstrap"
import {
  Loading,
  Owner,
  IssueList,
  FilterList,
  PageNav,
  OwnerProfile,
  RepoInfo,
  IssueLabel
} from "../argit/Repository/RepositoryStyles"
import { mkdir } from "../../../domain/filesystem/commands/mkdir"
import pify from "pify"
import { existsPath } from "../../../domain/filesystem/queries/existsPath"
import { loadFile } from "../../actionCreators/editorActions"

const getGitObjectPath = (projectRoot, oid) => {
  const dirpath = `${projectRoot}/.git/objects/${oid.slice(0, 2)}`
  const filepath = `${dirpath}/${oid.slice(2)}`

  return { dirpath, filepath }
}

export const downloadGitObject = async (arweave, url, oid, projectRoot) => {
  const { filepath } = getGitObjectPath(projectRoot, oid)
  if (await existsPath(filepath)) {
    return
  }

  const object = await fetchGitObject(arweave, url, oid)
  await writeGitObject(projectRoot, oid, object)
}

const writeGitObject = async (projectRoot, oid, object) => {
  const { dirpath, filepath } = getGitObjectPath(projectRoot, oid)
  await mkdir(dirpath)
  const buf = Buffer.from(object, "base64")
  await pify(fs.writeFile)(filepath, buf)
}

export const loadDirectory = async (arweave, url, head, projectRoot, path) => {
  await downloadGitObject(arweave, url, head, projectRoot)
  const parsedCommitObject = await git.readObject({
    fs,
    dir: projectRoot,
    oid: head,
    format: "parsed"
  })
  let treeOid = parsedCommitObject.object.tree
  let fullPath = projectRoot

  const dirs = path.split("/")
  dirs.splice(0, 2)

  for (var subDir of dirs) {
    await downloadGitObject(arweave, url, treeOid, projectRoot)
    const parsedTreeObject = await git.readObject({
      fs,
      dir: projectRoot,
      oid: treeOid,
      format: "parsed"
    })

    let found = false
    for (var entry of parsedTreeObject.object) {
      found = false
      if (entry.path === subDir) {
        found = true
        treeOid = entry.oid
        fullPath += `/${entry.path}`
        break
      }
    }

    if (!found) {
      treeOid = null
      break
    }
  }

  if (!treeOid) {
    return
  }

  await downloadGitObject(arweave, url, treeOid, projectRoot)
  const parsedTreeObject = await git.readObject({
    fs,
    dir: projectRoot,
    oid: treeOid,
    format: "parsed"
  })

  await Promise.all(
    parsedTreeObject.object.map(async entry => {
      await downloadGitObject(arweave, url, entry.oid, projectRoot)

      const path = `${fullPath}/${entry.path}`

      if (entry.type === "blob") {
        const { blob } = await git.readBlob({
          fs,
          dir: projectRoot,
          oid: entry.oid,
          format: "parsed"
        })
        await pify(fs.writeFile)(path, Buffer.from(blob))
      } else if (entry.type === "tree") {
        await mkdir(path)
      }
    })
  )
}

type Project = {
  projectRoot: string
}

type StackRouterProps = {
  currentScene: string
  projectRoot: string
  address: string
  match: any
  startProjectRootChanged: typeof startProjectRootChanged
  createNewProject: typeof createNewProject
  deleteProject: typeof deleteProject
  projects: Project[]
  history: ReadCommitResult[]
  pageLoading: boolean
  setPageLoading: typeof setPageLoading
  updateRepository: typeof updateRepository
  setRepositoryURL: typeof setRepositoryURL
  setRepositoryHead: typeof setRepositoryHead
  repositoryHead: string | null
  updatePage: typeof updatePage
  currentRef: string
  loadFile: typeof loadFile
}

// const selector = (state: RootState): Props => {
//   return {
//     currentScene: state.app.sceneStack[state.app.sceneStack.length - 1],
//     activeRepository: state.argit.activeRepository
//   }
// }

export const StackRouter = connector(
  state => ({
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1],
    projectRoot: state.project.projectRoot,
    address: state.argit.address,
    history: state.git.history,
    pageLoading: state.argit.pageLoading,
    isAuthenticated: state.argit.isAuthenticated,
    repository: state.argit.repository,
    repositoryHead: state.argit.repositoryHead,
    currentRef: state.argit.currentRef
  }),
  actions => ({
    updateProjectList: actions.project.updateProjectList,
    startProjectRootChanged: actions.editor.startProjectRootChanged,
    createNewProject: actions.project.createNewProject,
    deleteProject: actions.editor.deleteProject,
    setPageLoading: actions.argit.setPageLoading,
    openSponsorModal: actions.argit.openSponsorModal,
    updateRepository: actions.argit.updateRepository,
    setRepositoryURL: actions.argit.setRepositoryURL,
    setRepositoryHead: actions.argit.setRepositoryHead,
    updatePage: actions.argit.updatePage,
    loadFile: actions.editor.loadFile
  }),
  lifecycle<StackRouterProps, {}>({
    async componentDidMount() {
      this.props.updatePage({ page: "repo" })
      const {
        match,
        startProjectRootChanged,
        setPageLoading,
        setRepositoryURL,
        setRepositoryHead,
        updateRepository,
        loadFile,
        currentRef
      } = this.props
      const newProjectRoot = `/${match.params.repo_name}`

      setPageLoading({ loading: true })
      updateRepository({
        repository: {
          name: match.params.repo_name,
          owner: { name: match.params.wallet_address },
          description: ""
        }
      })
      createNewProject({ newProjectRoot })

      const url = `gitopia://${match.params.wallet_address}${newProjectRoot}`

      setRepositoryURL({ repositoryURL: url })

      const { oid } = await getOidByRef(arweave, url, currentRef)

      if (oid) {
        setRepositoryHead({ repositoryHead: oid })

        await git.init({ fs, dir: newProjectRoot })
        await loadDirectory(arweave, url, oid, newProjectRoot, newProjectRoot)

        const readmePath = `${newProjectRoot}/README.md`
        if (existsPath(readmePath)) {
          loadFile({ filepath: readmePath })
        }
      } else {
        setRepositoryHead({ repositoryHead: null })
      }

      await startProjectRootChanged({
        projectRoot: newProjectRoot
      })

      setPageLoading({ loading: false })
    },
    async componentDidUpdate(prevProps, prevState) {
      if (
        prevProps.currentRef !== this.props.currentRef &&
        prevProps.match.params.repo_name === this.props.match.params.repo_name
      ) {
        const {
          match,
          startProjectRootChanged,
          address,
          setTxLoading,
          setRepositoryURL,
          setRepositoryHead,
          updateRepository,
          loadFile,
          currentRef
        } = this.props
        setPageLoading({ loading: true })
        this.props.updatePage({ page: "repo" })
        const newProjectRoot = `/${match.params.repo_name}`
        const path = match.params.path

        updateRepository({
          repository: {
            name: match.params.repo_name,
            owner: { name: match.params.wallet_address },
            description: ""
          }
        })
        createNewProject({ newProjectRoot })

        const url = `gitopia://${match.params.wallet_address}${newProjectRoot}`

        setRepositoryURL({ repositoryURL: url })

        const { oid } = await getOidByRef(arweave, url, currentRef)

        if (oid) {
          setRepositoryHead({ repositoryHead: oid })

          await git.init({ fs, dir: newProjectRoot })
          await loadDirectory(arweave, url, oid, newProjectRoot, newProjectRoot)

          const readmePath = `${newProjectRoot}/README.md`
          if (existsPath(readmePath)) {
            loadFile({ filepath: readmePath })
          }
        } else {
          setRepositoryHead({ repositoryHead: null })
        }

        await startProjectRootChanged({
          projectRoot: newProjectRoot
        })

        setPageLoading({ loading: false })
      }
      // this.props.deleteProject({ dirpath: this.props.projectRoot })
    }
  })
)(function StackRouterImpl(props) {
  const { match, repositoryHead } = props

  switch (props.currentScene) {
    case "main": {
      let header = ""
      if (props.history.length) {
        const lastCommit = props.history[props.history.length - 1]
        header = `Latest commit: ${lastCommit.commit.committer.name} ${
          lastCommit.commit.message
        } ${lastCommit.oid.slice(0, 7)} ${format(
          lastCommit.commit.author.timestamp * 1000,
          "MM/DD HH:mm"
        )}`
      }

      let repo = {
        html_url: `/#/${match.params.wallet_address}/${match.params.repo_name}`,
        name: "",
        stargazers_count: 0,
        license: { name: "" },
        forks_count: 0,
        description: "",
        forks: 0
      }

      if (props.pageLoading)
        return (
          <>
            <Loading loading={props.pageLoading ? 1 : 0}>
              <i className="fa fa-spinner fa-spin" />
            </Loading>
          </>
        )

      return (
        <div className="stack-top">
          {/* <h2 className="mb-3">
                {props.match.params.wallet_address}/
                {props.match.params.repo_name}
              </h2> */}
          {/* <DgitScore /> */}
          <Container>
            {repositoryHead && (
              <Row alignItems="center" flexCol>
                <Col xs="12">
                  <div className="card-dgit">
                    <CardBody>
                      <RepositoryBrowser />
                    </CardBody>
                  </div>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <div className="mt-4">
                  <Editor {...props} />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )
    }

    default: {
      return <span>Route Error: No {props.currentScene}</span>
    }
  }
})

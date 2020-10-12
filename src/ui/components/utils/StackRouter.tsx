import { format } from "date-fns"
import fs from "fs"
import * as git from "isomorphic-git"
import { getRef, fetchGitObject } from "isomorphic-git/src/utils/arweave"
import React from "react"
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
  setTxLoading,
  setRepositoryURL,
  setRepositoryHead,
  updateRepository
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
import { GoArrowLeft, GoArrowRight } from "react-icons/go"
import { FaHistory, FaRegFileAlt, FaAward, FaSpinner } from "react-icons/fa"
import { mkdir } from "../../../domain/filesystem/commands/mkdir"
import pify from "pify"
import { existsPath } from "../../../domain/filesystem/queries/existsPath"

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

  for (var entry of parsedTreeObject.object) {
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
  }
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
  txLoading: boolean
  setTxLoading: typeof setTxLoading
  updateRepository: typeof updateRepository
  setRepositoryURL: typeof setRepositoryURL
  setRepositoryHead: typeof setRepositoryHead
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
    txLoading: state.argit.txLoading,
    isAuthenticated: state.argit.isAuthenticated,
    repository: state.argit.repository
  }),
  actions => ({
    updateProjectList: actions.project.updateProjectList,
    startProjectRootChanged: actions.editor.startProjectRootChanged,
    createNewProject: actions.project.createNewProject,
    deleteProject: actions.editor.deleteProject,
    setTxLoading: actions.argit.setTxLoading,
    openSponsorModal: actions.argit.openSponsorModal,
    updateRepository: actions.argit.updateRepository,
    setRepositoryURL: actions.argit.setRepositoryURL,
    setRepositoryHead: actions.argit.setRepositoryHead
  }),
  lifecycle<StackRouterProps, {}>({
    async componentDidMount() {
      const {
        match,
        startProjectRootChanged,
        address,
        setTxLoading,
        setRepositoryURL,
        setRepositoryHead,
        updateRepository
      } = this.props
      const newProjectRoot = `/${match.params.repo_name}`
      const ref = match.params.ref || "master"
      const path = match.params.path

      setTxLoading({ loading: true })
      updateRepository({
        repository: {
          name: match.params.repo_name,
          owner: { name: match.params.wallet_address },
          description: ""
        }
      })
      createNewProject({ newProjectRoot })

      const url = `dgit://${match.params.wallet_address}${newProjectRoot}`

      setRepositoryURL({ repositoryURL: url })

      const oid = await getRef(arweave, url, `refs/heads/${ref}`)

      setRepositoryHead({ repositoryHead: oid })

      if (oid !== "0000000000000000000000000000000000000000" && oid !== "") {
        await mkdir(newProjectRoot)
        await git.init({ fs, dir: newProjectRoot })

        await loadDirectory(arweave, url, oid, newProjectRoot, newProjectRoot)
      }

      await startProjectRootChanged({
        projectRoot: newProjectRoot
      })

      setTxLoading({ loading: false })
    },
    componentWillUnmount() {
      // this.props.deleteProject({ dirpath: this.props.projectRoot })
    }
  })
)(function StackRouterImpl(props) {
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
        html_url: `/#/${props.match.params.wallet_address}/${
          props.match.params.repo_name
        }`,
        name: "",
        stargazers_count: 0,
        license: { name: "" },
        forks_count: 0,
        description: "",
        forks: 0
      }

      if (props.txLoading)
        return (
          <NewContainer>
            <Icon>
              <img src={dlogo} height="48px" width="48px" />
            </Icon>
            <div>
              <Link to={`/${props.repository.owner.name}`}>
                <GoArrowLeft /> Back to Repositories
              </Link>
            </div>
            <Loading loading={props.txLoading ? 1 : 0}>
              <FaSpinner />
            </Loading>
          </NewContainer>
        )

      return (
        <>
          {props.history.length === 1 ? (
            <></>
          ) : (
            <NewContainer>
              <Icon>
                <img src={dlogo} height="48px" width="48px" />
              </Icon>
              {/* <Repository /> */}
              <Owner>
                <div>
                  <Link to={`/${props.repository.owner.name}`}>
                    <GoArrowLeft /> Back to Repositories
                  </Link>
                </div>
                <OwnerProfile>
                  <a
                    href={props.repository.owner.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://api.adorable.io/avatars/100/${
                        props.repository.owner.name
                      }.png`}
                      alt={props.repository.owner.name}
                    />
                  </a>
                  <h2 className="d-md-none">
                    {props.repository.owner.name.replace(/(.{7})..+/, "$1...")}
                  </h2>
                  <h2 className="d-none d-md-block">
                    {props.repository.owner.name}
                  </h2>
                </OwnerProfile>
                <RepoInfo>
                  <h1>
                    <a
                      href={props.repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {props.repository.name}
                    </a>
                  </h1>
                  <div>
                    <span
                      className="rv-button"
                      onClick={() => {
                        props.openSponsorModal({})
                      }}
                    >
                      <FaAward />
                      Sponsor
                    </span>
                    {props.history.length !== 0 && (
                      <Link
                        to={`/${props.address}${props.projectRoot}/commits`}
                      >
                        <span>
                          <FaHistory />
                          {`${Number(props.history.length).toLocaleString()} ${
                            props.history.length === 1 ? "commit" : "commits"
                          }`}
                        </span>
                      </Link>
                    )}
                    <span id="clone_button" className="rv-button">
                      <FaRegFileAlt /> Clone
                      <UncontrolledPopover
                        placement="right"
                        trigger="legacy"
                        target="clone_button"
                      >
                        <PopoverHeader>Clone with dgit</PopoverHeader>
                        <PopoverBody>{`dgit://${props.repository.owner.name}/${
                          props.repository.name
                        }`}</PopoverBody>
                      </UncontrolledPopover>
                    </span>
                  </div>
                  <p>{header}</p>
                </RepoInfo>
              </Owner>
              <Sponsor
                address={props.match.params.wallet_address}
                repo={props.match.params.repo_name}
              />

              {/* <h2 className="mb-3">
                {props.match.params.wallet_address}/
                {props.match.params.repo_name}
              </h2> */}
              {/* <DgitScore /> */}
              <Container flex fullHeight flexCol justifyContent="center">
                <Row alignItems="center" flexCol>
                  <Col xs="12">
                    <div className="card-dgit">
                      <CardBody>
                        <RepositoryBrowser />
                      </CardBody>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="mt-4">
                      <Editor />
                    </div>
                  </Col>
                </Row>
              </Container>
            </NewContainer>
          )}
        </>
      )
    }

    default: {
      return <span>Route Error: No {props.currentScene}</span>
    }
  }
})

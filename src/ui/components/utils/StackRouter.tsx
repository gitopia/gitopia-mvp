import React from "react"
import { connector } from "../../actionCreators"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Edit } from "../pages/Edit"
import { setActiveRepository } from "../../reducers/argit"
import { lifecycle } from "recompose"
import {
  updateProjectList,
  createNewProject,
  loadProjectList
} from "../../reducers/project"
import { cloneRepository, createProject } from "../../../domain/git"
import {
  startProjectRootChanged,
  initializeGitStatus
} from "../../actionCreators/editorActions"
import * as EditorActions from "../../actionCreators/editorActions"
import _ from "lodash"
import { RepositoryBrowser } from "../organisms/RepositoryBrowser"
import { Editor } from "../../components/argit/editor"
import { Card, CardBody, Container, Row, Col } from "reactstrap"
import { arweave } from "../../../index"
import * as git from "isomorphic-git"
import fs from "fs"
import { CloneButton } from "../argit/cloneButton"
import { Link } from "react-router-dom"
import { ReadCommitResult } from "../../../domain/types"
import { format } from "date-fns"

type Project = {
  projectRoot: string
}

type StackRouterProps = {
  currentScene: string
  projectRoot: string
  address: string
  setActiveRepository: typeof setActiveRepository
  match: any
  updateProjectList: typeof updateProjectList
  startProjectRootChanged: typeof startProjectRootChanged
  createNewProject: typeof createNewProject
  loadProjectList: typeof loadProjectList
  projects: Project[]
  history: ReadCommitResult[]
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
    setActiveRepository: state.argit.activeRepository,
    projects: state.project.projects,
    address: state.argit.address,
    history: state.git.history
  }),
  actions => ({
    setActiveRepository: actions.argit.setActiveRepository,
    updateProjectList: actions.project.updateProjectList,
    startProjectRootChanged: actions.editor.startProjectRootChanged,
    createNewProject: actions.project.createNewProject,
    loadProjectList: actions.project.loadProjectList
  }),
  // lifecycle<CustomProps, {}>({
  //   componentDidUpdate(prevProps, prevState) {
  //     const { projectRoot, activeRepository, match, ...actions } = this.props
  //     console.log("here")
  //     if (activeRepository !== prevProps.activeRepository) {
  //       console.log(projectRoot)
  //       console.log(match)
  //       const activeRepository = match.params.repo_name
  //     }
  //   }
  // }),
  lifecycle<StackRouterProps, {}>({
    async componentDidMount() {
      const {
        match,
        setActiveRepository,
        updateProjectList,
        startProjectRootChanged,
        loadProjectList,
        projects,
        address
      } = this.props
      const projectRoot = `/${match.params.repo_name}`
      // createNewProject({ newProjectRoot })
      // // TODO: fix it

      // await new Promise(r => setTimeout(r, 500))
      // loadProjectList({ projects })

      // await startProjectRootChanged({
      //   projectRoot: newProjectRoot
      // })

      if (!_.some(projects, { projectRoot })) {
        const allProjects = [...projects, { projectRoot }]
        await createProject(projectRoot)
        updateProjectList({ projects: allProjects })
        await git.cloneFromArweave({
          fs,
          dir: projectRoot,
          url: `argit://${address}${projectRoot}`,
          ref: "master",
          arweave
        })
        console.info("clone: done")
        await startProjectRootChanged({ projectRoot })
      }
    }
  })
)(function StackRouterImpl(props) {
  switch (props.currentScene) {
    case "main": {
      let header = ""
      if (props.history) {
        const lastCommit = props.history[props.history.length - 1]
        header = ` Latest commit: ${lastCommit.commit.committer.name} ${
          lastCommit.commit.message
        } ${lastCommit.oid.slice(0, 7)} ${format(
          lastCommit.commit.author.timestamp * 1000,
          "MM/DD HH:mm"
        )}`
      }

      return (
        <Container>
          <Row>
            <Col>
              <div className="float-right">
                <CloneButton />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <div>
                  <div>
                    {header}
                    <div className="float-right">
                      <Link
                        to={`/app/main/repository/${props.address}${
                          props.projectRoot
                        }/commits`}
                      >
                        <i className="fa fa-history" aria-hidden="true" />
                        {`${props.history.length} commits `}
                      </Link>
                    </div>
                  </div>
                </div>
                <CardBody>
                  <RepositoryBrowser />
                </CardBody>
              </Card>
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
      )
    }
    case "edit": {
      return <Edit />
    }
    case "config": {
      return <Config />
    }
    default: {
      return <span>Route Error: No {props.currentScene}</span>
    }
  }
})

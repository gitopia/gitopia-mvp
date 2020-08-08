import React from "react"
import { connector } from "../../actionCreators"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Edit } from "../pages/Edit"
import { Main } from "../pages/Main"
import { setActiveRepository } from "../../reducers/argit"
import { DIALOG_FOOTER_ACTIONS } from "@blueprintjs/core/lib/esm/common/classes"
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
    address: state.argit.address
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
      return (
        <Container>
          <Card>
            <CardBody>
              <RepositoryBrowser />
            </CardBody>
          </Card>
          <div className="mt-4">
            <Editor />
          </div>
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

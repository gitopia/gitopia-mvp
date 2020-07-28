import React from "react"
import { connector } from "../../actionCreators"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Edit } from "../pages/Edit"
import { Main } from "../pages/Main"
import { setActiveRepository } from "../../reducers/argit"
import { DIALOG_FOOTER_ACTIONS } from "@blueprintjs/core/lib/esm/common/classes"
import { lifecycle } from "recompose"
import { updateProjectList } from "../../reducers/project"
import { cloneRepository, createProject } from "../../../domain/git"
import {
  startProjectRootChanged,
  initializeGitStatus
} from "../../actionCreators/editorActions"

type CustomProps = {
  currentScene: string
  projectRoot: string
  setActiveRepository: typeof setActiveRepository
  match: any
  activeRepository: string
  updateProjectList: typeof updateProjectList
  startProjectRootChanged: typeof startProjectRootChanged
  initializeGitStatus: typeof initializeGitStatus
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
    setActiveRepository: state.argit.activeRepository
  }),
  actions => ({
    setActiveRepository: actions.argit.setActiveRepository,
    updateProjectList: actions.project.updateProjectList,
    startProjectRootChanged: actions.editor.startProjectRootChanged,
    intitializeGitStatus: actions.editor.initializeGitStatus
  }),
  lifecycle<CustomProps, {}>({
    componentDidUpdate(prevProps, prevState) {
      const { projectRoot, activeRepository, match, ...actions } = this.props
      console.log("here")
      if (activeRepository !== prevProps.activeRepository) {
        console.log(projectRoot)
        console.log(match)
        const activeRepository = match.params.repo_name
      }
    }
  }),
  lifecycle<CustomProps, {}>({
    async componentDidMount() {
      const { match, ...actions } = this.props
      const projectRoot = `/${match.params.repo_name}`
      actions.setActiveRepository({ activeRepository: match.params.repo_name })
      const projects = [{ projectRoot: projectRoot }]
      await createProject(projectRoot)

      actions.updateProjectList({ projects })
      actions.startProjectRootChanged({ projectRoot })
      await actions.initializeGitStatus(projectRoot)
    }
  })
)(function StackRouterImpl(props) {
  switch (props.currentScene) {
    case "main": {
      return <Main />
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

import React from "react"
import { connector } from "../../actionCreators"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Edit } from "../pages/Edit"
import { Main } from "../pages/Main"
import { setActiveRepository } from "../../reducers/argit"
import { DIALOG_FOOTER_ACTIONS } from "@blueprintjs/core/lib/esm/common/classes"
import { lifecycle } from "recompose"

type CustomProps = {
  currentScene: string
  projectRoot: string
  setActiveRepository: typeof setActiveRepository
  match: any
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
    activeRepository: state.argit.activeRepository,
    projectRoot: state.project.projectRoot
  }),
  actions => ({ setActiveRepository: actions.argit.setActiveRepository }),
  lifecycle<CustomProps, {}>({
    componentDidUpdate(prevProps, prevState) {
      const { projectRoot, match, ...actions } = this.props

      if (projectRoot !== prevProps.projectRoot) {
        console.log(projectRoot)
        console.log(match)
        actions.setActiveRepository(match.params.repo_name)
      }
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

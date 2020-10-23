import { Button } from "@blueprintjs/core"
import React from "react"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { Repository } from "../../../ui/reducers/argit"
import { connector } from "../../actionCreators"
import { closeCreateRepoModal } from "../../reducers/app"
import NewRepoForm from "../argit/newRepoForm"
import NewContainer from "../argit/Repository/Container"

// This is example reference
export const CreateRepoModal = connector(
  state => {
    return {
      openedCreateRepoModal: state.app.openedCreateRepoModal,
      address: state.argit.address,
      repositories: state.argit.repositories,
      mainItems: state.argit.mainItems
    }
  },
  actions => {
    return {
      createNewProject: actions.project.createNewProject,
      closeModal: actions.app.closeCreateRepoModal,
      loadProjectList: actions.project.loadProjectList,
      startProjectRootChanged: actions.editor.startProjectRootChanged,
      updateRepositories: actions.argit.updateRepositories,
      updateMainItems: actions.argit.updateMainItems
    }
  }
)(function CreateRepoModalImpl(props) {
  const {
    openedCreateRepoModal,
    createNewProject,
    closeModal,
    startProjectRootChanged,
    address,
    repositories
  } = props
  return (
    <Modal
      autoFocus
      isOpen={openedCreateRepoModal}
      onClose={() => {
        closeModal({})
      }}
    >
      <ModalHeader toggle={closeModal} />

      <ModalBody>
        <NewRepoForm
          {...props}
          updateRepositories={props.updateRepositories}
          address={props.address}
          repositories={props.repositories}
          closeCreateRepoModal={props.closeModal}
          mainItems={props.mainItems}
          updateMainItems={props.updateMainItems}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={props.closeModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
})

class ModalContent extends React.Component<
  {
    onConfirm: (newProjectRoot: string) => void
    address: string
    repositories: Repository[]
    closeCreateRepoModal: typeof closeCreateRepoModal
  },
  {
    isValidProjectName: boolean
    newProjectRoot: string
  }
> {
  state = {
    isValidProjectName: true,
    newProjectRoot: ""
  }
  render() {
    return (
      <>
        <NewRepoForm
          address={this.props.address}
          repositories={this.props.repositories}
          closeCreateRepoModal={this.props.closeCreateRepoModal}
        />
      </>
    )
  }
}

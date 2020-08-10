import { Button, Classes, Dialog } from "@blueprintjs/core"
import path from "path"
import React from "react"
import { connector } from "../../actionCreators"
import { Repositories } from "../argit/Repositories"
import NewRepoForm from "../argit/newRepoForm"
import { Repository } from "../../../ui/reducers/argit"
import { closeCreateRepoModal } from "../../reducers/app"
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap"

// This is example reference
export const CreateRepoModal = connector(
  state => {
    return {
      openedCreateRepoModal: state.app.openedCreateRepoModal,
      address: state.argit.address,
      repositories: state.argit.repositories
    }
  },
  actions => {
    return {
      createNewProject: actions.project.createNewProject,
      closeModal: actions.app.closeCreateRepoModal,
      loadProjectList: actions.project.loadProjectList,
      startProjectRootChanged: actions.editor.startProjectRootChanged
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
      <ModalHeader toggle={closeModal}>Login</ModalHeader>

      <ModalBody>
        <NewRepoForm
          address={props.address}
          repositories={props.repositories}
          closeCreateRepoModal={props.closeModal}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={props.closeModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
    // <Dialog
    //   autoFocus
    //   canEscapeKeyClose
    //   isOpen={openedCreateRepoModal}
    //   onClose={() => {
    //     closeModal({})
    //   }}
    // >
    //   <div className={Classes.DIALOG_BODY}>
    //     <ModalContent
    //       address={address}
    //       repositories={repositories}
    //       closeCreateRepoModal={closeModal}
    //       onConfirm={async projectRoot => {
    //         const newProjectRoot = path.join("/", projectRoot)

    //         createNewProject({ newProjectRoot })
    //         // TODO: fix it

    //         await new Promise(r => setTimeout(r, 500))
    //         props.loadProjectList({})

    //         startProjectRootChanged({
    //           projectRoot: newProjectRoot
    //         })
    //       }}
    //     />
    //   </div>
    //   <div className={Classes.DIALOG_FOOTER}>
    //     <Button text="cancel" onClick={() => closeModal({})} />
    //   </div>
    // </Dialog>
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
        {/* <h2>Create Project</h2>
        <p>Create a new Repository to the local fs and arweave</p>
        <div>
          <input
            spellCheck={false}
            style={{ width: "100%" }}
            value={this.state.newProjectRoot}
            onChange={event => {
              const value = event.target.value
              this.setState({ newProjectRoot: value })
            }}
          />
        </div>
        <Button
          disabled={this.state.newProjectRoot.length === 0}
          icon="confirm"
          text="create"
          onClick={() => this.props.onConfirm(this.state.newProjectRoot)}
        /> */}
      </>
    )
  }
}

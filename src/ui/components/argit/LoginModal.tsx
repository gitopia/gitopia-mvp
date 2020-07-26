import { Button, Classes, Dialog } from "@blueprintjs/core"
import path from "path"
import React from "react"
import { connector } from "../../actionCreators"
import { updateRepositories } from "../../reducers/argit"
import Dropzone, { ImageFile } from "react-dropzone"

// This is example reference
export const LoginModal = connector(
  state => {
    return {
      openedLoginModal: state.argit.openedLoginModal,
      keyFileName: state.argit.keyFileName
    }
  },
  actions => {
    return {
      closeModal: actions.argit.closeLoginModal,
      updateRepositories: actions.argit.updateRepositories,
      loadKeyFile: actions.argit.loadKeyFile
    }
  }
)(function LoginModalImpl(props) {
  const { openedLoginModal, closeModal, updateRepositories } = props
  return (
    <Dialog
      autoFocus
      canEscapeKeyClose
      isOpen={openedLoginModal}
      onClose={() => {
        closeModal({})
      }}
    >
      <div className={Classes.DIALOG_BODY}>
        <ModalContent
          onUpload={async acceptedFiles => {
            // const newProjectRoot = path.join("/", projectRoot)
            if (
              acceptedFiles[0].name
                .split(".")
                .pop()
                .toLowerCase() === "json"
            ) {
              const upload = acceptedFiles[0] // Get uploaded file
              let keyFileName =
                upload.name.length > 15
                  ? upload.name.substring(0, 10) + "....json"
                  : upload.name // Concatenate filename for dropzone

              props.loadKeyFile({ keyFileName })

              //   this.setState({
              //     keyFileName: fileName,
              //     isLoading: true // Set loading to true
              //   })

              const reader = new FileReader() // Initiate FileReader
              reader.readAsText(upload) // Read content as text

              reader.onload = () => {
                const keyfile = JSON.parse(String(reader.result)) // Parse text to JSON object

                if (keyfile.kty === "RSA") {
                  // Confirm that uploaded file is indeed keyfile
                  sessionStorage.setItem("keyfile", String(reader.result)) // Set keyfile to sessionStorage
                  //   this.toggleModal() // Close login modal
                  props.closeModal({})
                  window.location.reload() // Reload page to get authenticated status
                } else {
                  // If uploaded JSON is not keyfile
                  //   this.setState({
                  //     // Throw error
                  //     keyFileName: "Error: Not a keyfile",
                  //     isLoading: false
                  //   })
                  props.loadKeyFile({ keyFileName: "Error: Not a keyfile" })
                }
              }
            } else {
              // If filename does not end in '.json'
              //   this.setState({
              //     // Throw error
              //     keyFileName: "Error: Not a keyfile"
              //   })
              props.loadKeyFile({ keyFileName: "Error: Not a keyfile" })
            }

            props.closeModal({})

            // createNewProject({ newProjectRoot })
            // TODO: fix it

            // await new Promise(r =>setTimeout (r, 500))
            // props.loadProjectList({})

            // startProjectRootChanged({
            //   projectRoot: newProjectRoot
            // })
          }}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button text="cancel" onClick={() => closeModal({})} />
      </div>
    </Dialog>
  )
})

class ModalContent extends React.Component<
  {
    onUpload: (acceptedFiles: ImageFile[]) => void
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
        <h2>Login</h2>
        {/* <p>Create directory to local file system.</p> */}
        {/* <div>
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
        <Dropzone onDrop={acceptedFiles => this.props.onUpload(acceptedFiles)}>
          Drop your KeyFile
        </Dropzone>
      </>
    )
  }
}

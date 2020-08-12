import * as React from "react"
import { connector } from "../../actionCreators/index"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import Dropzone, { ImageFile } from "react-dropzone"
// import "./styles/theme.scss"

export const LoginModal = connector(
  state => ({
    keyFileName: state.argit.keyFileName,
    openedLoginModal: state.argit.openedLoginModal
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal,
    closeLoginModal: actions.argit.closeLoginModal,
    loadKeyFile: actions.argit.loadKeyFile,
    setIsAuthenticated: actions.argit.setIsAuthenticated
  })
)(function LoginModalImpl(props) {
  return (
    <Modal isOpen={props.openedLoginModal} toggle={props.closeLoginModal}>
      <ModalHeader toggle={props.closeLoginModal}>Login</ModalHeader>
      <ModalBody>
        <Dropzone
          onDrop={async acceptedFiles => {
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
                  props.closeLoginModal({})
                  props.setIsAuthenticated({ isAuthenticated: true })
                  // window.location.reload() // Reload page to get authenticated status
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

            props.closeLoginModal({})

            // createNewProject({ newProjectRoot })
            // TODO: fix it

            // await new Promise(r =>setTimeout (r, 500))
            // props.loadProjectList({})

            // startProjectRootChanged({
            //   projectRoot: newProjectRoot
            // })
          }}
        >
          Drop your Arweave wallet keyfile here or Click here
        </Dropzone>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={props.closeLoginModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
})

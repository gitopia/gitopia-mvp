import path from "path"
import * as React from "react"
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-jsx"
import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/theme-monokai"
import { CardBody } from "reactstrap"
import { lifecycle } from "recompose"
import { ReadCommitResult } from "../../../domain/types"
import { connector } from "../../actionCreators/index"
import { ThemeToggleButton } from "./themeToggleButton"
const languages = [
  "javascript",
  "java",
  "python",
  "xml",
  "ruby",
  "markdown",
  "json",
  "html",
  "golang",
  "csharp",
  "typescript",
  "css"
]

languages.forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`)
})

const EXT_TO_ACE_MODE_MAP: any = {
  ".js": "javascript",
  ".java": "java",
  ".py": "python",
  ".xml": "xml",
  ".rb": "ruby",
  ".md": "markdown",
  ".json": "json",
  ".html": "html",
  ".go": "golang",
  ".cs": "csharp",
  ".ts": "typescript",
  ".css": "css",
  ".txt": "text"
}

export function extToAceMode(filepath: string): string {
  const ext = path.extname(filepath)
  return EXT_TO_ACE_MODE_MAP[ext] || "text"
}

type EditorProps = {
  value: string
  filepath: string
  address: string
  projectRoot: string
  unloadFile: any
  theme: string
  history: ReadCommitResult[]
}

export const Editor = connector(
  state => ({
    value: state.buffer.value,
    filepath: state.buffer.filepath,
    address: state.argit.address,
    projectRoot: state.project.projectRoot,
    theme: state.config.theme,
    history: state.git.history
  }),
  actions => ({
    unloadFile: actions.buffer.unloadFile
  }),
  lifecycle<EditorProps, {}>({
    componentWillUnmount() {
      this.props.unloadFile({})
    }
  })
)(function EditorImpl(props) {
  if (props.history.length) {
    if (props.value) {
      const mode = extToAceMode(props.filepath)

      return (
        <div>
          {props.filepath}
          <ThemeToggleButton />
          <AceEditor
            mode={mode}
            theme={props.theme}
            name="ace"
            value={props.value}
            readOnly={true}
            fontSize={14}
            highlightActiveLine={false}
            width="100%"
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      )
    }
    return null
  }

  const url = `dgit://${props.address}${props.projectRoot}`

  return (
    <div className="card-dgit">
      <CardBody>
        <h1>Repository is empty!</h1>
        <p>
          Run the following commands in your existing git repository to push
        </p>
        <code>
          export ARWEAVE_WALLET_PATH="PATH_OF_YOUR_ARWEAVE_KEYFILE" <br />
          <br />
          dgit remote add origin "{url}" <br />
          <br />
          dgit push origin master
        </code>
      </CardBody>
    </div>
  )
})

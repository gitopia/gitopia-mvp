import * as React from "react"
import { connector } from "../../actionCreators/index"
import { lifecycle } from "recompose"
import path from "path"
import AceEditor from "react-ace"
import { Table, Card, CardBody } from "reactstrap"
import { ThemeToggleButton } from './themeToggleButton';


import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/mode-jsx"

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
}

export const Editor = connector(
  state => ({
    value: state.buffer.value,
    filepath: state.buffer.filepath,
    address: state.argit.address,
    projectRoot: state.project.projectRoot,
    theme: state.config.theme
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
  if (props.value) {
    const mode = extToAceMode(props.filepath)

    return (
      <Table>
        <thead>{props.filepath}<ThemeToggleButton/></thead>
        <tbody>
          <tr>
            {props.value && (
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
            )}
          </tr>
        </tbody>
      </Table>
    )
  }

  const url = `argit://${props.address}${props.projectRoot}`

  return (
    <Card>
      <CardBody>
        <h1>Repository is empty!</h1>
        <p>
          Run the following commands in your existing git repository to push
        </p>
        <code>
          // For initializing new git repo<br/> // argit init export
          ARWEAVE_WALLET_PATH="PATH_OF_YOUR_ARWEAVE_KEYFILE" <br />
          argit addRemote --remote=origin --url=${url} <br />
          argit pushToArweave --remote=origin --ref=master
        </code>
      </CardBody>
    </Card>
  )
})

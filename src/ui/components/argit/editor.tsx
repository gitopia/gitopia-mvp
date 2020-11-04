import path from "path"
import * as React from "react"
import { CardBody } from "reactstrap"
import { lifecycle } from "recompose"
import { ReadCommitResult } from "../../../domain/types"
import { connector } from "../../actionCreators/index"
import { ThemeToggleButton } from "./themeToggleButton"
import remark from "remark"
import remarkReact from "remark-react"
import { Suspense } from "react"
import { Loading } from "../argit/Repository/RepositoryStyles"
const AceEditor = React.lazy(() => import("react-ace"))

const processor = remark().use(remarkReact)
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
  ".txt": "text",
  ".yml": "yaml"
}

export function extToAceMode(filepath: string): string {
  const ext = path.extname(filepath)
  return EXT_TO_ACE_MODE_MAP[ext] || "text"
}

type EditorProps = {
  value: string
  filepath: string
  filetype: string
  address: string
  projectRoot: string
  unloadFile: any
  theme: string
  history: ReadCommitResult[]
  head: string
  pageLoading: bool
}

export const Editor = connector(
  state => ({
    value: state.buffer.value,
    filepath: state.buffer.filepath,
    filetype: state.buffer.filetype,
    address: state.argit.address,
    projectRoot: state.project.projectRoot,
    theme: state.config.theme,
    history: state.git.history,
    head: state.argit.repositoryHead,
    pageLoading: state.argit.pageLoading
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
  if (props.head) {
    if (props.value) {
      if (props.filetype === "markdown") {
        const contents = processor.processSync(props.value).contents

        return <div>{contents}</div>
      }

      const mode = extToAceMode(props.filepath)

      return (
        <div>
          {props.filepath}
          <Suspense
            fallback={
              <>
                <Loading loading={props.pageLoading ? 1 : 0}>
                  <i className="fa fa-spinner fa-spin" />
                </Loading>
              </>
            }
          >
            <>
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
            </>
          </Suspense>
        </div>
      )
    }

    return <></>
  }

  const url = `gitopia://${props.match.params.wallet_address}/${
    props.match.params.repo_name
  }`

  return (
    <div className="card-dgit">
      <CardBody>
        <h1>Repository is empty!</h1>
        <p>
          Run the following commands in your existing git repository to push
        </p>
        <code className="app-code">
          export GITOPIA_WALLET_PATH="PATH_OF_YOUR_ARWEAVE_KEYFILE" <br />
          <br />
          git remote add origin {`${url}`} <br />
          <br />
          git push origin master
        </code>
      </CardBody>
    </div>
  )
})

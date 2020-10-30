import { Icon, Tooltip } from "@blueprintjs/core"
import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import { DragDropContext } from "react-dnd"
import ReactDnDHTML5Backend from "react-dnd-html5-backend"
import lifecycle from "recompose/lifecycle"
import { compose } from "redux"
import styled from "styled-components"
import { readFileStats } from "../../../../domain/filesystem/queries/readFileStats"
import { FileInfo } from "../../../../domain/types"
import { connector } from "../../../actionCreators"
import * as EditorActions from "../../../actionCreators/editorActions"
import { RootState } from "../../../reducers"
import * as RepositoryActions from "../../../reducers/repository"
import { Pathname } from "../../atoms/Pathname"
import { AddDir } from "./AddDir"
import { AddFile } from "./AddFile"
import { FileLine } from "./FileLine"
import { arweave } from "../../../../index"
import { loadDirectory } from "../../utils/StackRouter"

type OwnProps = {
  root: string
  dirpath: string
  depth: number
  open?: boolean
  ignoreGit?: boolean
}

type Props = OwnProps & {
  editingFilepath: string | null
  repositoryURL: string | null
  repositoryHead: string | null
  touchCounter: number
  isFileCreating: boolean
  isDirCreating: boolean
  startFileCreating: typeof RepositoryActions.startFileCreating
  startDirCreating: typeof RepositoryActions.startDirCreating
  deleteDirectory: typeof EditorActions.deleteDirectory
  fileMoved: typeof EditorActions.fileMoved
}

type DirectroyState = {
  opened: boolean
  loaded: boolean
  loading: boolean
  error: null
  hovered: boolean
}

export const DirectoryLine: React.ComponentType<OwnProps> = connector(
  (state: RootState, ownProps: OwnProps) => {
    return {
      ...ownProps,
      editingFilepath: state.buffer.filepath,
      touchCounter: state.repository.touchCounter,
      isFileCreating: ownProps.dirpath === state.repository.fileCreatingDir,
      isDirCreating: ownProps.dirpath === state.repository.dirCreatingDir,
      repositoryURL: state.argit.repositoryURL,
      repositoryHead: state.argit.repositoryHead
    }
  },
  actions => {
    return {
      fileMoved: actions.editor.fileMoved,
      startFileCreating: actions.repository.startFileCreating,
      cancelFileCreating: actions.repository.cancelFileCreating,

      startDirCreating: actions.repository.startDirCreating,
      cancelDirCreating: actions.repository.cancelDirCreating,

      deleteDirectory: actions.editor.deleteDirectory
    }
  }
)(function DirectoryLineImpl(props) {
  return <DirectoryLineContent {...props} />
})

const DirectoryLineContent: React.ComponentClass<
  Props
> = class extends React.Component<Props, DirectroyState> {
  _unmounted: boolean = false

  constructor(props: Props) {
    super(props)
    this.state = {
      opened: this.props.open || false,
      loaded: false,
      loading: true,
      error: null,
      hovered: false
    }
  }

  async componentDidMount() {
    this._updateChildren()
  }

  async componentDidUpdate(prevProps: Props) {
    if (
      this.state.opened &&
      prevProps.touchCounter !== this.props.touchCounter
    ) {
      this._updateChildren()
    }
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  async _updateChildren() {
    if (this._unmounted) {
      return
    }
    try {
      this.setState({ loaded: true, loading: false })
    } catch (error) {
      this.setState({ loaded: true, loading: false, error })
    }
  }

  render() {
    const { dirpath, depth, root, repositoryURL, repositoryHead } = this.props
    const { opened } = this.state

    const relpath = path.relative(root, dirpath)
    const basename = path.basename(relpath)

    const ignoreGit = relpath === ".git" || this.props.ignoreGit || false

    // Just casting
    const MyContextMenuProvider: any = ContextMenuProvider
    return (
      <>
        <MyContextMenuProvider
          id="directory"
          data={{ dirpath }}
          component="span"
        >
          <Container
            onMouseOver={() => {
              if (!this.state.hovered) {
                this.setState({ hovered: true })
              }
            }}
            onMouseLeave={() => {
              this.setState({ hovered: false })
            }}
            onClick={() => {
              if (!this.state.loading) {
                this.setState({ opened: !this.state.opened })
              }
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "inline-flex" }}>
                <Prefix depth={depth} />
                {opened ? (
                  <Icon icon="folder-open" />
                ) : (
                  <Icon icon="folder-close" />
                )}
                &nbsp;
                <Pathname ignoreGit={ignoreGit}>
                  {basename || `${dirpath}`}
                </Pathname>
              </div>
            </div>
            {opened && (
              <>
                {this.props.isFileCreating && (
                  <div>
                    <Prefix depth={depth + 1} />
                    <AddFile parentDir={dirpath} />
                  </div>
                )}
                {this.props.isDirCreating && (
                  <div>
                    <Prefix depth={depth + 1} />
                    <AddDir parentDir={dirpath} />
                  </div>
                )}
              </>
            )}
          </Container>
        </MyContextMenuProvider>
        {opened && (
          <LinkedLines
            root={root}
            dirpath={dirpath}
            depth={depth + 1}
            editingFilepath={this.props.editingFilepath}
            repositoryURL={repositoryURL}
            repositoryHead={repositoryHead}
          />
        )}
      </>
    )
  }
}

interface LinkedLinesProps {
  dirpath: string
  root: string
  depth: number
  editingFilepath: string | null
  repositoryURL: string | null
  repositoryHead: string | null
}

interface LinkedLinesState {
  fileList: FileInfo[]
}

class LinkedLines extends React.Component<LinkedLinesProps, LinkedLinesState> {
  state = { fileList: [] }

  async componentDidMount() {
    const {repositoryURL, repositoryHead, root, dirpath} = this.props
    if (repositoryHead) {
      await loadDirectory(
        arweave,
        repositoryURL,
        repositoryHead,
        root,
        dirpath
      )
      const fileList = await readFileStats(root, dirpath)
      this.setState({ fileList })
    }
  }

  render() {
    const { dirpath, depth, root, editingFilepath } = this.props

    return (
      <>
        {this.state.fileList.map((f: FileInfo) => {
          const filepath = path.join(dirpath, f.name)
          if (f.type === "file") {
            return (
              <FileLine
                key={f.name}
                depth={depth}
                filepath={filepath}
                ignoreGit={f.ignored}
              />
            )
          } else if (f.type === "dir") {
            return (
              <DirectoryLine
                key={f.name}
                root={root}
                dirpath={filepath}
                depth={depth}
                open={
                  // open if dir includes editing filepath
                  editingFilepath != null &&
                  !path.relative(filepath, editingFilepath).startsWith("..")
                }
                ignoreGit={f.ignored} // TODO: See .gitignore
              />
            )
          }
        })}
      </>
    )
  }
}

export const RootDirectory: React.ComponentType<OwnProps> = compose(
  lifecycle({
    async componentDidMount() {
      //
    }
  }),
  DragDropContext(ReactDnDHTML5Backend)
)(DirectoryLine) as any

// Styled

const Container = styled.div`
  cursor: pointer;
  user-select: none;
  padding-left: 2px;
  &:hover {
    background: black;
    color: white;
  }
`

const HoveredMenu = (props: {
  basename: string
  dirpath: string
  root: string
  onClickFile: (event: Event) => any
  onClickDir: (event: Event) => any
  onClickRemove: (event: Event) => any
}) => (
  <div style={{ minWidth: "30px" }}>
    <Tooltip content="Create new file" position="top">
      <Icon
        icon="document"
        onClick={event => props.onClickFile(event as any)}
      />
    </Tooltip>

    <Tooltip content="Creat new dir" position="top">
      <Icon
        icon="folder-new"
        data-tip
        data-for="new-dir"
        onClick={event => props.onClickDir(event as any)}
      />
    </Tooltip>

    {props.basename !== ".git" &&
      props.dirpath !== props.root && (
        <Tooltip content="Delete" position="top">
          <Icon
            icon="trash"
            data-tip
            data-for="delete"
            onClick={ev => props.onClickRemove(ev as any)}
          />
        </Tooltip>
      )}
  </div>
)

const Prefix = ({ depth }: { depth: number }) => (
  <>
    {range(depth).map((_, k) => (
      <span key={k}>&nbsp;&nbsp;</span>
    ))}
  </>
)

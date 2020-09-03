import format from "date-fns/format"
import React, { useState } from "react"
import { Button, Table } from "reactstrap"
import { ReadCommitResult } from "../../../domain/types"
import { connector } from "../../actionCreators/index"
import Widget from "./Widget/Widget"

type CommitsProps = {
  currentBranch: string
  history: ReadCommitResult[]
}

export const Commits = connector(
  state => ({
    currentBranch: state.git.currentBranch,
    history: state.git.history
  }),
  actions => ({})
)(function CommitsImpl(props: CommitsProps) {
  const [offset, setOffset] = useState(0)
  const numCommits = 15
  const commits = props.history.slice(offset, offset + numCommits)

  return (
    <Widget
      title={
        <h5>
          <span className="fw-semi-bold">Commit history</span>
        </h5>
      }
    >
      <div className="table-responsive">
        <Table>
          <tbody>
            {commits.map(description => (
              <tr key={description.oid}>
                <td>{description.oid}</td>
                <td>
                  {format(
                    description.commit.author.timestamp * 1000,
                    "MM/DD HH:mm"
                  )}
                </td>
                <td>{description.commit.committer.name}</td>
                <td>{description.commit.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {offset - numCommits >= 0 && (
        <Button color="primary" onClick={() => setOffset(offset - numCommits)}>
          Newer
        </Button>
      )}
      {offset + numCommits < props.history.length && (
        <Button
          className="float-right"
          color="primary"
          onClick={() => setOffset(offset + numCommits)}
        >
          Older
        </Button>
      )}
    </Widget>
  )
})

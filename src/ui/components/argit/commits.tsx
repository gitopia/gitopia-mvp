import * as React from "react"
import { connector } from "../../actionCreators/index"
import { ReadCommitResult } from "../../../domain/types"
import Widget from "./Widget/Widget"
import { Table } from "reactstrap"
import format from "date-fns/format"

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
  console.log(props.history)
  return (
    <Widget
      title={
        <h5>
          <span className="fw-semi-bold">Commit history</span>
        </h5>
      }
    >
      <div className="table-responsive">
        <Table className="table-hover">
          <tbody>
            {props.history.map(description => (
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
    </Widget>
  )
})

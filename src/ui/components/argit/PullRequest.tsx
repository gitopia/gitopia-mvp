import * as React from "react"
import pr from "../argit/images/pr.svg"

export interface PullRequestProps {}

const PullRequest: React.SFC<PullRequestProps> = () => {
  return (
    <>
      <img style={{ width: "35%" }} src={pr} />
      <h3>Coming Soon...</h3>
    </>
  )
}

export default PullRequest

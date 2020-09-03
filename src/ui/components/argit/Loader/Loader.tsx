import cx from "classnames"
import * as React from "react"
import s from "./Loader.module.scss"

export interface LoaderProps {
  size: number
  className: string
}

class Loader extends React.Component<LoaderProps, {}> {
  render() {
    return (
      <div className={cx(s.root, this.props.className)}>
        <i
          className="la la-spinner la-spin"
          style={{ fontSize: this.props.size | 21 }}
        />
      </div>
    )
  }
}

export default Loader

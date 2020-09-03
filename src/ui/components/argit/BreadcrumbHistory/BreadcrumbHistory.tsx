import * as React from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { v4 as uuid } from "uuid"

export interface BreadcrumbHistoryProps {
  url: string
}

export interface BreadcrumbHistoryState {}

class BreadcrumbHistory extends React.Component<
  BreadcrumbHistoryProps,
  BreadcrumbHistoryState
> {
  renderBreadCrumbs = () => {
    let route = this.props.url
      .split("/")
      .slice(1)
      .map(route =>
        route
          .split("-")
          .map(word => word[0].toUpperCase() + word.slice(1))
          .join(" ")
      )
    const length = route.length
    return route.map(
      (item, index) =>
        length === index + 1 ? (
          <BreadcrumbItem key={uuid()} className="active">
            <strong>{item}</strong>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={uuid()}>{item}</BreadcrumbItem>
        )
    )
  }

  render() {
    return (
      <>
        {this.props.url !== "/app/chat" ? (
          <div>
            <Breadcrumb tag="nav" listTag="div">
              <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
              {this.renderBreadCrumbs()}
            </Breadcrumb>
          </div>
        ) : null}
      </>
    )
  }
}

export default BreadcrumbHistory

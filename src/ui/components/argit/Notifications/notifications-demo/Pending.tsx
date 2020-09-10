import React from "react"
import { ListGroup, ListGroupItem } from "reactstrap"
import { Notification } from "../../../../reducers/argit"
import s from "./ListGroup.module.scss" // eslint-disable-line

export interface PendingProps {
  notifications: Notification[]
}

export interface PendingState {}

class Pending extends React.Component<PendingProps, PendingState> {
  render() {
    return (
      <ListGroup className={[s.listGroup, "thin-scroll"].join(" ")}>
        {this.props.notifications.map(notif => {
          if (notif.type === "pending") {
            return (
              <ListGroupItem className={s.listGroupItem} key={notif.txid}>
                <span className="text-muted float-right">0/1</span>
                <h6 className="m-0 mb-1">
                  <strong>{notif.action}</strong>
                  <br />
                  &nbsp; txid: {notif.txid}
                </h6>
                <span className="help-block">
                  last update: April 22, 2014 2:36 pm
                </span>
              </ListGroupItem>
            )
          }
        })}
      </ListGroup>
    )
  }
}

export default Pending

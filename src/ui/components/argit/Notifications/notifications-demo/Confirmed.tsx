import React from "react"
import { ListGroup, ListGroupItem } from "reactstrap"
import { Notification } from "../../../../reducers/argit"
import s from "./ListGroup.module.scss"

export interface ConfirmedProps {
  notifications: Notification[]
}

export interface ConfirmedState {}

class Confirmed extends React.Component<ConfirmedProps, ConfirmedState> {
  render() {
    return (
      <ListGroup className={[s.listGroup, "thin-scroll"].join(" ")}>
        {this.props.notifications.map(notif => {
          if (notif.type === "confirmed") {
            return (
              <ListGroupItem key={notif.txid} className={s.listGroupItem}>
                <span className={[s.notificationIcon, "thumb-sm"].join(" ")}>
                  <i className="glyphicon glyphicon-upload fa-lg" />
                </span>
                <p className="text-ellipsis m-0">
                  {notif.action}
                  <time className="help-block m-0">{notif.txid}</time>
                </p>
              </ListGroupItem>
            )
          }
        })}
      </ListGroup>
    )
  }
}

export default Confirmed

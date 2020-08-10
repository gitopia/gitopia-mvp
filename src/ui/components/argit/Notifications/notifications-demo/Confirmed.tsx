import React from "react"
import { ListGroup, ListGroupItem, Button } from "reactstrap"

import s from "./ListGroup.module.scss"

import a3 from "../../images/people/a3.jpg"
import a5 from "../../images/people/a5.jpg"
import { Notification } from "../../../../reducers/argit"

export interface ConfirmedProps {
  notifications: Notification[]
}

export interface ConfirmedState {}

class Confirmed extends React.Component<ConfirmedProps, ConfirmedState> {
  render() {
    return (
      <ListGroup className={[s.listGroup, "thin-scroll"].join(" ")}>
        <ListGroupItem className={s.listGroupItem}>
          <span className={[s.notificationIcon, "thumb-sm"].join(" ")}>
            <i className="glyphicon glyphicon-upload fa-lg" />
          </span>
          <p className="text-ellipsis m-0">
            Repo Name Created
            <time className="help-block m-0">5h ago</time>
          </p>
        </ListGroupItem>
      </ListGroup>
    )
  }
}

export default Confirmed

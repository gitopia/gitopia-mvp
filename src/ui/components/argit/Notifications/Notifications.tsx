import classnames from "classnames"
import * as React from "react"
import { Button, ButtonGroup } from "reactstrap"
import {
  loadNotifications,
  Notification,
  setLastSynced
} from "../../../reducers/argit"
import Confirmed from "./notifications-demo/Confirmed"
import MessagesDemo from "./notifications-demo/Messages"
import NewNotificationsDemo from "./notifications-demo/NewNotifications"
import Pending from "./notifications-demo/Pending"
import s from "./Notifications.module.scss"
import { getAllRepositores } from "../../../../utils"
import { arweave } from "../../../../index"

export interface NotificationsProps {
  loadNotifications: typeof loadNotifications
  notifications: Notification[]
  address: string
  lastSynced: number
  setLastSynced: typeof setLastSynced
}

export interface NotificationsState {
  notificationsTabSelected: number
  newNotifications: any
  isLoad: boolean
}

class Notifications extends React.Component<
  NotificationsProps,
  NotificationsState
> {
  constructor(props: NotificationsProps) {
    super(props)

    this.state = {
      notificationsTabSelected: 1,
      newNotifications: null,
      isLoad: false
    }
  }
  changeNotificationsTab(tab: number) {
    this.setState({
      notificationsTabSelected: tab,
      newNotifications: null
    })
  }
  async loadNotifications() {
    this.setState({
      isLoad: true
    })
    const repos = await getAllRepositores(arweave, this.props.address)

    const newNotifications = this.props.notifications.map(notif => {
      if (notif.type === "pending" && repos.find(o => o.txid === notif.txid)) {
        return {
          type: "confirmed",
          action: notif.action,
          txid: notif.txid
        }
      } else {
        return notif
      }
    })

    let finalNotifications = [...newNotifications]
    setTimeout(() => {
      this.props.loadNotifications({ notifications: finalNotifications })
      this.props.setLastSynced({})
      this.setState({ isLoad: false })
    }, 1500)
  }
  render() {
    var date = new Date(this.props.lastSynced)
    // Hours part from the timestamp
    var hours = date.getHours()
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes()
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds()

    // Will display time in 10:30:23 format
    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2)
    console.log(this.props.lastSynced)
    let notificationsTab

    switch (this.state.notificationsTabSelected) {
      case 1:
        notificationsTab = (
          <Confirmed notifications={this.props.notifications} />
        )
        break
      case 2:
        notificationsTab = <MessagesDemo />
        break
      case 3:
        notificationsTab = <Pending notifications={this.props.notifications} />
        break
      default:
        notificationsTab = (
          <Confirmed notifications={this.props.notifications} />
        )
        break
    }
    return (
      <section className={`${s.notifications} navbar-notifications`}>
        <header className={[s.cardHeader, "card-header"].join(" ")}>
          <div className="text-center mb-sm">
            <strong>
              You have {this.props.notifications.length} notifications
            </strong>
          </div>
          <ButtonGroup className={s.notificationButtons}>
            <Button
              outline
              color="default"
              size="md"
              className={s.notificationButton}
              onClick={() => this.changeNotificationsTab(1)}
              active={this.state.notificationsTabSelected === 1}
            >
              Confirmed
            </Button>

            <Button
              outline
              color="default"
              size="sm"
              className={s.notificationButton}
              onClick={() => this.changeNotificationsTab(3)}
              active={this.state.notificationsTabSelected === 3}
            >
              Pending
            </Button>
          </ButtonGroup>
        </header>
        {this.state.newNotifications || notificationsTab}
        <footer className={[s.cardFooter, "text-sm", "card-footer"].join(" ")}>
          <Button
            color="link"
            className={classnames(
              { disabled: this.state.isLoad },
              s.btnNotificationsReload,
              "btn-xs",
              "float-right",
              "py-0"
            )}
            onClick={() => this.loadNotifications()}
            id="load-notifications-btn"
          >
            {this.state.isLoad ? (
              <span>
                <i className="fa fa-spinner fa-spin" />
              </span>
            ) : (
              <i className="fa fa-refresh" />
            )}
          </Button>
          <span className="fs-mini">Last Synced: {formattedTime}</span>
        </footer>
      </section>
    )
  }
}

export default Notifications

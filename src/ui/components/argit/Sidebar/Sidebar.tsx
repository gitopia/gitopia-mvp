import React from "react"
import cx from "classnames"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Progress, Alert } from "reactstrap"
import { withRouter } from "react-router-dom"
import s from "./Sidebar.module.scss"
import LinksGroup from "./LinksGroup/LinksGroup"

import { changeActiveSidebarItem } from "../../../reducers/navigation"
import { connector } from "../../../actionCreators/index"
import { lifecycle } from "recompose"

export interface SidebarProps {
  sidebarOpened: boolean
  activeItem: string
  location: { pathname: string }
  changeActiveSidebarItem: typeof changeActiveSidebarItem
}

export const Sidebar = connector(
  state => ({
    sidebarOpened: state.navigation.sidebarOpened,
    activeItem: state.navigation.activeItem
  }),
  actions => ({
    changeActiveSidebarItem: actions.navigation.changeActiveSidebarItem
  }),
  lifecycle<SidebarProps, {}>({
    componentDidMount(props) {
      // this.element.addEventListener(
      //   "transitionend",
      //   () => {
      //     if (props.sidebarOpened) {
      //       this.element.classList.add(s.sidebarOpen)
      //     }
      //   },
      //   false
      // )
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
        if (nextProps.sidebarOpened) {
          // this.element.style.height = `${this.element.scrollHeight}px`
        } else {
          // this.element.classList.remove(s.sidebarOpen)
          setTimeout(() => {
            // this.element.style.height = ""
          }, 0)
        }
      }
    }
  })
)(function SidebarImpl(props) {
  return (
    <nav
      className={cx(s.root)}
      ref={nav => {
        // this.element = nav
      }}
    >
      <header className={s.logo}>
        <a href="https://demo.flatlogic.com/light-blue-react/">
          Light <span className="fw-bold">Blue</span>
        </a>
      </header>
      <ul className={s.nav}>
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Dashboard"
          isHeader
          iconName="flaticon-home"
          link="/app/main"
          index="main"
        />
        <h5 className={[s.navTitle, s.groupTitle].join(" ")}>TEMPLATE</h5>
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Typography"
          isHeader
          iconName="flaticon-network"
          link="/app/typography"
          index="core"
        />
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Tables Basic"
          isHeader
          iconName="flaticon-map-location"
          link="/app/tables"
          index="tables"
        />
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Notifications"
          isHeader
          iconName="flaticon-layers"
          link="/app/notifications"
          index="ui"
        />
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Components"
          isHeader
          iconName="flaticon-list"
          link="/app/forms"
          index="forms"
          childrenLinks={[
            {
              header: "Charts",
              link: "/app/charts"
            },
            {
              header: "Icons",
              link: "/app/icons"
            },
            {
              header: "Maps",
              link: "/app/maps"
            }
          ]}
        />
      </ul>
      <h5 className={s.navTitle}>
        LABELS
        {/* eslint-disable-next-line */}
        <a className={s.actionLink}>
          <i
            className={`${s.glyphiconSm} glyphicon glyphicon-plus float-right`}
          />
        </a>
      </h5>
      {/* eslint-disable */}
      <ul className={s.sidebarLabels}>
        <li>
          <a href="#">
            <i className="fa fa-circle text-success mr-2" />
            <span className={s.labelName}>My Recent</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa fa-circle text-primary mr-2" />
            <span className={s.labelName}>Starred</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa fa-circle text-danger mr-2" />
            <span className={s.labelName}>Background</span>
          </a>
        </li>
      </ul>
      {/* eslint-enable */}
      <h5 className={s.navTitle}>PROJECTS</h5>
      {/* <div className={s.sidebarAlerts}>
        {this.props.alertsList.map((
          alert // eslint-disable-line
        ) => (
          <Alert
            key={alert.id}
            className={s.sidebarAlert}
            color="transparent"
            isOpen={true} // eslint-disable-line
            toggle={() => {
              this.dismissAlert(alert.id)
            }}
          >
            <span>{alert.title}</span>
            <br />
            <Progress
              className={`bg-custom-dark progress-xs mt-1`}
              color={alert.color}
              value={alert.value}
            />
            <small>{alert.footer}</small>
          </Alert>
        ))}
      </div> */}
    </nav>
  )
})

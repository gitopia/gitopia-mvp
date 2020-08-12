import * as React from "react"
import { Component } from "react"
import { withRouter } from "react-router"
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Input,
  UncontrolledAlert,
  Dropdown,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  ButtonGroup,
  Button,
  Form,
  FormGroup
} from "reactstrap"
import {
  openSidebar,
  closeSidebar,
  changeSidebarPosition,
  changeSidebarVisibility
} from "../../../reducers/navigation"
import s from "./Header.module.scss"
import "animate.css"
import sender1 from "../images/1.png"
import sender2 from "../images/2.png"
import sender3 from "../images/3.png"

import Notifications from "../Notifications/Notifications"

import {
  setIsAuthenticated,
  updateRepositories,
  loadNotifications,
  Notification
} from "../../../reducers/argit"
type HeaderProps = {
  dispatch: any
  sidebarPosition: string
  sidebarVisibility: string
  setIsAuthenticated: typeof setIsAuthenticated
  updateRepositories: typeof updateRepositories
  loadNotifications: typeof loadNotifications
  notifications: typeof Notification[]
  address: string
}

type HeaderState = {
  visible: boolean
  messagesOpen: boolean
  supportOpen: boolean
  settingsOpen: boolean
  searchFocused: boolean
  searchOpen: boolean
  notificationsOpen: boolean
  // accountOpen: boolean
}

class Header extends React.Component<HeaderProps, HeaderState> {
  state = {
    visible: true,
    messagesOpen: false,
    supportOpen: false,
    settingsOpen: false,
    searchFocused: false,
    searchOpen: false,
    notificationsOpen: false
    // accountOpen: false
  }

  // import { logoutUser } from '../../actions/user';

  constructor(props: HeaderProps) {
    super(props)

    // this.doLogout = this.doLogout.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this)
    this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this)
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this)
    // this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this)
    // this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleSearchOpen = this.toggleSearchOpen.bind(this)
  }

  toggleNotifications = () => {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen
    })
  }

  onDismiss() {
    this.setState({ visible: false })
  }

  // doLogout() {
  //   this.props.dispatch(logoutUser())
  // }

  toggleMessagesDropdown() {
    this.setState({
      messagesOpen: !this.state.messagesOpen
    })
  }

  toggleSupportDropdown() {
    this.setState({
      supportOpen: !this.state.supportOpen
    })
  }

  toggleSettingsDropdown() {
    this.setState({
      settingsOpen: !this.state.settingsOpen
    })
  }

  // toggleAccountDropdown() {
  //   this.setState({
  //     accountOpen: !this.state.accountOpen
  //   })
  // }

  toggleSearchOpen() {
    this.setState({
      searchOpen: !this.state.searchOpen
    })
  }

  // toggleSidebar() {
  //   props.isSidebarOpened
  //     ? this.props.dispatch(closeSidebar())
  //     : this.props.dispatch(openSidebar())
  // }

  moveSidebar(position) {
    this.props.dispatch(changeSidebarPosition(position))
  }

  toggleVisibilitySidebar(visibility) {
    this.props.dispatch(changeSidebarVisibility(visibility))
  }

  render() {
    return (
      <Navbar className={`d-print-none ${s.root}`}>
        {/* <UncontrolledAlert
          className={`${
            s.alert
          } mr-3 d-lg-down-none animate__animated animate__bounceIn animate__delay-1s`}
        >
          <i className="fa fa-info-circle mr-1" /> Check out dgit{" "}
          <button
            className="btn-link"
            onClick={() => this.setState({ settingsOpen: true })}
          >
            settings
          </button>{" "}
          on the right!
        </UncontrolledAlert> */}

        <Nav className="ml-md-0 d-flex nav-responsive">
          <Dropdown
            nav
            isOpen={this.state.notificationsOpen}
            toggle={this.toggleNotifications}
            id="basic-nav-dropdown"
            className={`${s.notificationsMenu}`}
            style={{ marginRight: "auto" }}
          >
            <DropdownToggle nav caret style={{ color: "#f4f4f5", padding: 0 }}>
              <span
                className={`${
                  s.avatar
                } rounded-circle thumb-sm float-left mr-2`}
              >
                <img
                  src={`https://api.adorable.io/avatars/100/${
                    this.props.address
                  }.png`}
                  alt="..."
                />
              </span>
              <span className={`small ${s.accountCheck}`}>
                {this.props.address}
              </span>
              <Badge className={s.badge} color="primary">
                {this.props.notifications.length}
              </Badge>
            </DropdownToggle>
            <DropdownMenu
              right
              className={`${
                s.notificationsWrapper
              } py-0 animate__animated animate__faster animate__fadeInUp`}
            >
              <Notifications
                notifications={this.props.notifications}
                loadNotifications={this.props.loadNotifications}
                address={this.props.address}
              />
            </DropdownMenu>
          </Dropdown>

          <NavItem className={`${s.divider} text-white`} />

          <NavItem>
            <NavLink
              onClick={() => {
                sessionStorage.removeItem("keyfile") // Remove keyfile from sessionStorage
                this.props.setIsAuthenticated({ isAuthenticated: false })
                this.props.updateRepositories({ repositories: [] })
                // window.location.reload()
                this.props.history.replace("/")
              }}
              className={`${s.navItem} text-white`}
              href="#"
            >
              <i className="glyphicon glyphicon-off" />
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default Header

import "animate.css"
import * as React from "react"
import {
  Badge,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavItem,
  NavLink
} from "reactstrap"
import {
  loadNotifications,
  setIsAuthenticated,
  updateRepositories,
  setWallet,
  userLogout,
  setLastSynced
} from "../../../reducers/argit"
import {
  changeSidebarPosition,
  changeSidebarVisibility
} from "../../../reducers/navigation"
import Notifications from "../Notifications/Notifications"
import s from "./Header.module.scss"

type HeaderProps = {
  dispatch: any
  sidebarPosition: string
  sidebarVisibility: string
  setIsAuthenticated: typeof setIsAuthenticated
  updateRepositories: typeof updateRepositories
  loadNotifications: typeof loadNotifications
  notifications: typeof Notification[]
  address: string
  setWallet: typeof setWallet
  userLogout: typeof userLogout
  lastSynced: number
  setLastSynced: typeof setLastSynced
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
  }

  constructor(props: HeaderProps) {
    super(props)

    this.onDismiss = this.onDismiss.bind(this)
    this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this)
    this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this)
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this)

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

  moveSidebar(position) {
    this.props.dispatch(changeSidebarPosition(position))
  }

  toggleVisibilitySidebar(visibility) {
    this.props.dispatch(changeSidebarVisibility(visibility))
  }

  render() {
    return (
      <Navbar className={`d-print-none ${s.root}`}>
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
                  src={`https://avatars.dicebear.com/api/bottts/${
                    this.props.address
                  }.svg?h=30&r=5&m=2`}
                  alt="..."
                />
              </span>
              <span className={`small ${s.accountCheck}`}>
                <span className="d-md-none">
                  {`${this.props.address}`.replace(/(.{10})..+/, "$1...")}{" "}
                </span>
                <span className="d-none d-md-block">{this.props.address} </span>
              </span>
              <Badge className={s.badge}>
                <i className="fa fa-bell" />
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
                lastSynced={this.props.lastSynced}
                setLastSynced={this.props.setLastSynced}
              />
            </DropdownMenu>
          </Dropdown>

          <NavItem className={`${s.divider} text-black`} />

          <NavItem>
            <NavLink
              onClick={() => {
                this.props.setWallet({ wallet: "" })
                this.props.setIsAuthenticated({ isAuthenticated: false })
                this.props.updateRepositories({ repositories: [] })
                this.props.userLogout({})
                // window.location.reload()
                this.props.history.replace("/")
              }}
              className={`${s.navItem} text-black`}
              href="#"
            >
              <i className="fa fa-sign-out" aria-hidden="true" />
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default Header

import cx from "classnames"
import React from "react"
import { Link } from "react-router-dom"
import { lifecycle } from "recompose"
import { connector } from "../../../actionCreators/index"
import { changeActiveSidebarItem } from "../../../reducers/navigation"
import LinksGroup from "./LinksGroup/LinksGroup"
import s from "./Sidebar.module.scss"

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
        <Link to="/">
          d<span className="fw-bold">git</span>
        </Link>
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
        {/* <h5 className={[s.navTitle, s.groupTitle].join(" ")}>TEMPLATE</h5> */}
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Repositories"
          isHeader
          iconName="flaticon-archive"
          link="/app/main/repositories"
          index="repositories"
        />
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Pull Requests"
          isHeader
          iconName="flaticon-map-location"
          link="/app/main/pulls"
          index="pulls"
        />
        <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Issues"
          isHeader
          iconName="flaticon-layers"
          link="/app/main/issues"
          index="issues"
        />
        {/* <LinksGroup
          onActiveSidebarItemChange={props.changeActiveSidebarItem}
          activeItem={props.activeItem}
          header="Repositories"
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
        /> */}
      </ul>
    </nav>
  )
})

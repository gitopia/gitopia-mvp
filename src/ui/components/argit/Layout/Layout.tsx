import Hammer from "rc-hammerjs"
import * as React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { connector } from "../../../actionCreators/index"
import { StackRouter } from "../../utils/StackRouter"
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory"
import { Commits } from "../commits"
import { Dashboard } from "../Dashboard/Dashboard"
import Header from "../Header/Header"
import PullRequest from "../PullRequest"
import { Sidebar } from "../Sidebar/Sidebar"
import s from "./Layout.module.scss"
import dlogo from "../../argit/images/dlogo.svg"
import { Sponsor } from "../Sponsor"
import { Link } from "react-router-dom"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"
import { FaCheckCircle, FaSpinner, FaPlus } from "react-icons/fa"
import { format } from "date-fns"
import { filter } from "fuzzaldrin"
import { CreateRepoModal } from "../../organisms/CreateRepoModal"
import { Pagination } from "../../argit/Pagination"
import {
  PopoverBody,
  PopoverHeader,
  UncontrolledPopover,
  Container,
  Row,
  Col
} from "reactstrap"
import { lifecycle } from "recompose"
import { openCreateRepoModal } from "../../../reducers/app"
import { arweave } from "../../../../index"

import {
  getAllActivities,
  txQuery,
  getNextActivities,
  getAllRepositores
} from "../../../../utils"

import NewContainer, {
  Icon,
  List,
  SubmitButton,
  Form
} from "../../argit/Repository/Container"
import {
  Owner,
  OwnerProfile,
  RepoInfo,
  FilterList,
  Loading,
  PageNav,
  IssueList
} from "../../argit/Repository/RepositoryStyles"
import {
  loadAddress,
  loadNotifications,
  Notification,
  Repository,
  setIsAuthenticated,
  updateRepositories,
  openSponsorModal,
  loadActivities,
  setTxLoading,
  updateMainItems,
  updatePage,
  updateFilterIndex,
  Activity,
  setWallet
} from "../../../reducers/argit"
import { FaAward, FaRegFileAlt } from "react-icons/fa"
import { CreateRepoModal } from "../../organisms/CreateRepoModal"

type ConnectedProps = {
  isAuthenticated: boolean
  repositories: Repository[]
  setIsAuthenticated: typeof setIsAuthenticated
  loadAddress: typeof loadAddress
  updateRepositories: typeof updateRepositories
  openCreateRepoModal: typeof openCreateRepoModal
  loadNotifications: typeof loadNotifications
  notifications: typeof Notification[]
  setTxLoading: typeof setTxLoading
  txLoading: boolean
  mainItems: { repos: {}; activities: {} }
  updateMainItems: typeof updateMainItems
  filterIndex: Number
  updateFilterIndex: typeof updateFilterIndex
  loadActivities: typeof loadActivities
  activities: Activity[]
  updatePage: typeof updatePage
  page: string
  openSponsorModal: typeof openSponsorModal
  wallet: string
  setWallet: typeof setWallet
}

export const Layout = connector(
  state => ({
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    sidebarPosition: state.navigation.sidebarPosition,
    sidebarVisibility: state.navigation.sidebarVisibility,
    notifications: state.argit.notifications,
    repositories: state.argit.repositories,
    activities: state.argit.activities,
    filterIndex: state.argit.filterIndex,
    repository: state.argit.repository,
    page: state.argit.page,
    txLoading: state.argit.txLoading,
    mainItems: state.argit.mainItems,
    wallet: state.argit.wallet
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal,
    openSidebar: actions.navigation.openSidebar,
    setIsAuthenticated: actions.argit.setIsAuthenticated,
    updateRepositories: actions.argit.updateRepositories,
    loadNotifications: actions.argit.loadNotifications,
    updateFilterIndex: actions.argit.updateFilterIndex,
    updateMainItems: actions.argit.updateMainItems,
    updatePage: actions.argit.updatePage,
    setTxLoading: actions.argit.setTxLoading,
    loadAddress: actions.argit.loadAddress,
    loadActivities: actions.argit.loadActivities,
    openSponsorModal: actions.argit.openSponsorModal,
    openCreateRepoModal: actions.app.openCreateRepoModal,
    setWallet: actions.argit.setWallet
  }),
  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      if (this.props.match.params.repo_name) {
        this.props.updatePage({ page: "repo" })
      } else {
        this.props.updatePage({ page: "main" })
      }

      this.props
        // UI Boot
        // await delay(150)
        .setTxLoading({ loading: true })
      this.props.updateFilterIndex({ filterIndex: 0 })
      const { isAuthenticated, repositories, ...actions } = this.props
      let address = this.props.match.params.wallet_address

      if (isAuthenticated) {
        address = await arweave.wallets.jwkToAddress(
          JSON.parse(this.props.wallet)
        )
      }
      let user_address = this.props.match.params.wallet_address

      actions.loadAddress({ address })
      const activities = await getAllActivities(arweave, user_address)
      console.log(activities)

      actions.loadActivities({ activities: activities })
      let notifications: Notification[] = []
      let completed_txids: String[] = []
      const repos = await getAllRepositores(arweave, user_address)
      console.log(repos)

      const newNotifications = this.props.notifications
        .filter(
          notif =>
            notif.type == "pending" && completed_txids.includes(notif.txid)
        )
        .map(notif => ({
          type: "confirmed",
          action: "Create Repo",
          txid: notif.txid
        }))
      let finalNotifications = [...notifications, ...newNotifications]
      actions.loadNotifications({ notifications: finalNotifications })
      actions.updateRepositories({ repositories: repos })
      let names: [] = []
      let objects: {} = {}
      this.props.repositories.forEach(item => {
        let itemname = item.name
        names.push(item.name)
        objects[itemname] = item
      })

      console.log(objects)
      actions.updateMainItems({
        mainItems: {
          repos: objects,
          activities: this.props.mainItems.activities
        }
      })
      this.props.setTxLoading({ loading: false })
    }
  })
)(function LayoutImpl(props) {
  function handlePage(e: string) {
    let objects = {}
    getNextActivities(arweave, props.address, props.activities[9].cursor, e)
      .then(activities => {
        console.log(activities)
        props.loadActivities({ activities: activities })
        console.log(props.activities)
      })
      .then(() => {
        props.activities.forEach(item => {
          let itemname = item.txid
          // names.push(item.txid)
          objects[itemname] = item
        })
        props.updateMainItems({
          mainItems: { repos: {}, activities: objects }
        })
        console.log(activities)
        props.setTxLoading({ loading: false })
      })
  }
  function handleChange(e) {
    let names: [] = []
    let objects: {} = {}
    let filteredObjects: {} = {}
    props.repositories.forEach(item => {
      let itemname = item.name
      names.push(itemname)
      objects[itemname] = item
    })
    const results = filter(names, e.target.value)

    console.log(results, names)
    results.forEach(result => {
      filteredObjects[result] = objects[result]
    })
    props.updateMainItems({
      repos: filteredObjects,
      activities: props.mainItems.activities
    })
  }
  let mainFilters = [
    { state: "repos", label: "Repositories", active: true },
    { state: "activity", label: "Activity", active: false }
  ]
  let repoFilters = [
    { state: "code", label: "Code", active: true },
    { state: "commits", label: "Commits", active: false }
  ]
  function handleFilter(index: number, page: string) {
    props.updateFilterIndex({ filterIndex: index })
    let names: [] = []
    let objects: {} = {}
    props.updateFilterIndex({ filterIndex: index })
    if (page === "main") {
      if (index == 0) {
        props.repositories.forEach(item => {
          let itemname = item.name
          // names.push(item.name)
          objects[itemname] = item
        })
        props.updateMainItems({
          mainItems: { repos: objects, activities: {} }
        })
      } else if (index === 1) {
        console.log(props.activities)

        props.activities.forEach(item => {
          let itemname = item.txid
          // names.push(item.txid)
          objects[itemname] = item
        })
        props.updateMainItems({
          mainItems: { repos: {}, activities: objects }
        })
      } else if (index === 2) {
        // props.updateMainItems({
        //   mainItems: {
        //     repos: props.mainItems.repos,
        //     activities: props.mainItems.activities
        //   }
        // })
      }
    } else if (page === "repo") {
      if (index == 1) {
      }
    }
  }
  const { activities, repos } = props.mainItems

  return (
    <div className="app-body">
      <nav className="landing-nav">
        <div
          className="landing-logo"
          onClick={() =>
            props.isAuthenticated
              ? window.location.replace(`/#/${props.address}`)
              : window.location.replace(`/`)
          }
        >
          <img src={dlogo} height="48px" width="48px" />
        </div>
        {props.isAuthenticated && (
          <Header
            {...props}
            setIsAuthenticated={props.setIsAuthenticated}
            updateRepositories={props.updateRepositories}
            updateNotifications={props.loadNotifications}
            notifications={props.notifications}
            address={props.address}
            setWallet={props.setWallet}
          />
        )}
        {!props.isAuthenticated && (
          <ul className="landing-menu">
            {/* <li className="landing-menu__item">
  <a
    href="doc.html"
    className="landing-a landing-link landing-link--dark"
  >
    <i className="fa fa-book" /> Documentation
  </a>
</li> */}
            <li className="landing-menu__item landing-toggle">
              <a
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
            <li className="landing-menu__item">
              <a
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
          </ul>
        )}
      </nav>
      <Hammer>
        <main className={s.content}>
          {/* <Repositories {...props} /> */}
          {/* {props.isAuthenticated && (
            <BreadcrumbHistory url={props.location.pathname} />
          )} */}

          <TransitionGroup>
            <CSSTransition
              key={props.location.key}
              classNames="fade"
              timeout={200}
            >
              <NewContainer>
                <Icon>
                  <img src={dlogo} height="48px" width="48px" />
                </Icon>
                <Owner>
                  <div>
                    {props.page === "repo" && (
                      <Link
                        to={`/${props.repository.owner.name}`}
                        onClick={() => {
                          props.updatePage({ page: "main" })
                          props.updateFilterIndex({ filterIndex: 0 })
                        }}
                      >
                        <GoArrowLeft /> Back to Repositories
                      </Link>
                    )}
                  </div>
                  <OwnerProfile>
                    <a
                      href={`/${props.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`https://api.adorable.io/avatars/100/${
                          props.address
                        }.png`}
                        alt={`${props.address}`}
                      />
                    </a>
                    {props.page === "repo" && (
                      <>
                        <h2 className="d-md-none">
                          {props.repository.owner.name.replace(
                            /(.{7})..+/,
                            "$1..."
                          )}
                        </h2>
                        <h2 className="d-none d-md-block">
                          {props.repository.owner.name}
                        </h2>
                      </>
                    )}
                  </OwnerProfile>
                  <RepoInfo>
                    {props.page === "repo" && (
                      <h1>
                        <a
                          href={props.repository.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {props.repository.name}
                        </a>
                      </h1>
                    )}
                    {props.page === "main" && (
                      <h1>
                        <a
                          href={`/${props.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {props.match.params.wallet_address}
                        </a>
                      </h1>
                    )}

                    <div>
                      <span
                        className="rv-button"
                        onClick={() => {
                          props.openSponsorModal({})
                        }}
                      >
                        <FaAward />
                        Sponsor
                      </span>
                      {props.page === "repo" && (
                        <span id="clone_button" className="rv-button">
                          <FaRegFileAlt /> Clone
                          <UncontrolledPopover
                            className="rv-pop"
                            placement="top-end"
                            trigger="legacy"
                            target="clone_button"
                          >
                            <PopoverHeader>Clone with dgit</PopoverHeader>
                            <PopoverBody>{`dgit://${
                              props.repository.owner.name
                            }/${props.repository.name}`}</PopoverBody>
                          </UncontrolledPopover>
                        </span>
                      )}
                    </div>
                  </RepoInfo>
                </Owner>
                <IssueList>
                  <FilterList active={Number(props.filterIndex)}>
                    {props.page === "main" &&
                      mainFilters.map((filter, index) => (
                        <button
                          type="button"
                          key={filter.state}
                          onClick={() => handleFilter(index, props.page)}
                        >
                          {filter.label}
                        </button>
                      ))}
                    {props.page === "repo" &&
                      repoFilters.map((filter, index) => (
                        <button
                          type="button"
                          key={filter.state}
                          onClick={() => handleFilter(index, props.page)}
                        >
                          {filter.label}
                        </button>
                      ))}
                  </FilterList>
                  {props.filterIndex === 0 &&
                    props.page === "main" && (
                      <Form>
                        <input
                          type="text"
                          placeholder="Search Repository"
                          onChange={handleChange}
                        />
                        {props.isAuthenticated &&
                          props.match.params.wallet_address ===
                            props.address && (
                            <SubmitButton
                              onClick={() => {
                                props.openCreateRepoModal({})
                              }}
                            >
                              <FaPlus color="#fff" size={14} />
                            </SubmitButton>
                          )}
                      </Form>
                    )}
                  {props.txLoading ? (
                    <>
                      <Loading loading={props.txLoading ? 1 : 0}>
                        <FaSpinner />
                      </Loading>
                    </>
                  ) : (
                    <List>
                      {props.page === "main" &&
                        props.filterIndex == 0 &&
                        props.repositories && <Pagination {...props} />}

                      {props.page === "main" &&
                        props.filterIndex == 1 &&
                        props.activities &&
                        Object.keys(activities).map(txid => (
                          <li key={txid}>
                            <div>
                              <Link
                                to={`/${props.address}/${activities[txid]
                                  .repoName || activities[txid].key}`}
                              >
                                <Container className="activity">
                                  <Row>
                                    <Col>
                                      <span>
                                        {`${txid}`.replace(
                                          /(.{15})..+/,
                                          "$1..."
                                        )}
                                      </span>
                                    </Col>
                                    <Col>
                                      <span>
                                        {activities[txid].repoName ||
                                          activities[txid].type}
                                      </span>
                                    </Col>
                                    <Col>
                                      <span>
                                        {format(
                                          parseInt(activities[txid].unixTime) *
                                            1000,
                                          "MM/DD HH:mm"
                                        )}
                                      </span>
                                    </Col>
                                    <Col>
                                      <span>
                                        {activities[txid].type === "create-repo"
                                          ? "Create New Repo"
                                          : `Updated ref ${
                                              activities[txid].key
                                            }`}
                                      </span>
                                    </Col>
                                  </Row>
                                </Container>
                              </Link>
                            </div>
                          </li>
                        ))}
                    </List>
                  )}
                  {props.page === "repo" &&
                    props.filterIndex === 0 && <StackRouter {...props} />}
                  {props.page === "repo" &&
                    props.filterIndex === 1 && <Commits {...props} />}
                  {props.page === "main" &&
                    props.filterIndex === 1 && (
                      <PageNav>
                        <button
                          type="button"
                          onClick={() => {
                            props.setTxLoading({ loading: true })
                            handlePage("back")
                          }}
                        >
                          Newer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            props.setTxLoading({ loading: true })
                            handlePage("next")
                          }}
                        >
                          Older
                        </button>
                      </PageNav>
                    )}
                </IssueList>
              </NewContainer>
            </CSSTransition>
          </TransitionGroup>
          <Sponsor match={props.match} wallet={props.wallet} />
          <CreateRepoModal {...props} wallet={props.wallet} />
        </main>
      </Hammer>
      <footer className="landing-footer">
        Made with <span style={{ color: "#e25555" }}>&#9829;</span>
        &nbsp; by{" "}
        <span className="font-bold">
          <a
            href="https://thechtrap.com/"
            target="_blank"
            className="landing-a landing-link link--dark"
          >
            TheTechTrap
          </a>
        </span>
        .
      </footer>
    </div>
  )
})

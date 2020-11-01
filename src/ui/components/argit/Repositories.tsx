import * as React from "react"
import { Link } from "react-router-dom"
import { Table } from "reactstrap"
import { lifecycle } from "recompose"
import styled, { consolidateStreamedStyles } from "styled-components"
import { arweave } from "../../../index"
import { connector } from "../../actionCreators/index"
import { openCreateRepoModal } from "../../reducers/app"
import { filter } from "fuzzaldrin"
import { format } from "date-fns"
import { Container, Row, Col } from "reactstrap"

import {
  loadAddress,
  loadNotifications,
  Notification,
  Repository,
  setIsAuthenticated,
  updateRepositories,
  openSponsorModal,
  loadActivities
} from "../../reducers/argit"
import { getAllActivities, txQuery } from "./../../../utils"

import {
  Loading,
  Owner,
  IssueList,
  FilterList,
  PageNav,
  OwnerProfile,
  RepoInfo,
  IssueLabel
} from "../argit/Repository/RepositoryStyles"
import NewContainer, {
  Icon,
  List,
  SubmitButton,
  Form
} from "../argit/Repository/Container"
import dlogo from "../argit/images/dlogo.svg"

import {
  setTxLoading,
  updateMainItems,
  Activity,
  updateFilterIndex
} from "../../reducers/argit"
import { Sponsor } from "./Sponsor"

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
  openSponsorModal: typeof openSponsorModal
  filterIndex: Number
  updateFilterIndex: typeof updateFilterIndex
  loadActivities: typeof loadActivities
  activities: Activity[]
}

export const Repositories = connector(
  state => ({
    repositories: state.argit.repositories,
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    notifications: state.argit.notifications,
    txLoading: state.argit.txLoading,
    mainItems: state.argit.mainItems,
    filterIndex: state.argit.filterIndex,
    activities: state.argit.activities
  }),
  actions => ({
    loadAddress: actions.argit.loadAddress,
    updateRepositories: actions.argit.updateRepositories,
    openCreateRepoModal: actions.app.openCreateRepoModal,
    loadNotifications: actions.argit.loadNotifications,
    updateMainItems: actions.argit.updateMainItems,
    openSponsorModal: actions.argit.openSponsorModal,
    updateFilterIndex: actions.argit.updateFilterIndex,
    loadActivities: actions.argit.loadActivities,
    setTxLoading: actions.argit.setTxLoading
  }),

  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      this.props
        // UI Boot
        // await delay(150)
        .setTxLoading({ loading: true })

      const { isAuthenticated, repositories, ...actions } = this.props
      let address = this.props.match.params.wallet_address

      if (isAuthenticated) {
        address = await arweave.wallets.jwkToAddress(
          JSON.parse(String(sessionStorage.getItem("keyfile")))
        )
      }

      actions.loadAddress({ address })
      const activities = await getAllActivities(arweave, address)
      console.log(activities)

      actions.loadActivities({ activities: activities })
      const txids = await arweave.arql(txQuery(address, "create-repo"))
      let notifications: Notification[] = []
      let completed_txids: String[] = []
      const repos = await Promise.all(
        txids.map(async txid => {
          let repository = {} as Repository
          try {
            const data: any = await arweave.transactions.getData(txid, {
              decode: true,
              string: true
            })
            // if (typeof data === "object") {
            //   console.log(new TextDecoder("utf-8").decode(data))
            // }
            if (typeof data === "string" && data !== "") {
              const decoded: any = JSON.parse(data)
              repository = {
                name: decoded.name,
                description: decoded.description,
                txid: txid,
                status: "confirmed"
              }
              completed_txids.push(txid)
            } else if (data === "") {
              repository = {
                name: "Arweave server error",
                description: "Arweave server error",
                txid: txid,
                status: "confirmed"
              }
              completed_txids.push(txid)
            } else {
              throw new Error("Pendng Transaction")
            }
          } catch (error) {
            repository = {
              name: "Pending",
              txid: txid,
              status: "pending",
              description: "Pending"
            }
            notifications.push({
              type: "pending",
              action: "Create Repo",
              txid: txid
            })
          }

          if (!repository) {
            repository = {
              txid: txid,
              description: "Pending",
              status: "pending",
              name: "Pending"
            }
          }

          return repository
        })
      )
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
      let names: string[] = []
      let objects: {} = {}
      this.props.repositories.forEach(item => {
        let itemname = item.name
        names.push(item.name)
        objects[itemname] = item
      })
      console.log(objects)
      actions.updateMainItems({
        mainItem: {
          repos: objects,
          activities: this.props.mainItems.activities
        }
      })
      this.props.setTxLoading({ loading: false })
    }
  })
)(function RepositoriesImpl(props) {
  function handleChange(e: string) {
    let names: string[] = []
    let objects: {} = {}
    props.repositories.forEach(item => {
      let itemname = item.name
      names.push(item.name)
      objects[itemname] = item
    })
    const results = filter(names, e.target.value)
    props.updateMainItems({
      mainItems: { repos: objects, activities: {} }
    })
  }
  let filters = [
    { state: "repos", label: "Repositories", active: true },
    { state: "activity", label: "Activity", active: false },
    { state: "overview", label: "Overview", active: false }
  ]

  function handleFilter(index: number) {
    console.log(index)
    props.updateFilterIndex({ filterIndex: index })
    let names: [] = []
    let objects: {} = {}

    if (index == 0) {
      props.repositories.forEach(item => {
        let itemname = item.name
        // names.push(item.name)
        objects[itemname] = item
      })
      console.log(names)
      props.updateMainItems({
        mainItems: { repos: objects, activities: {} }
      })
    } else if (index == 1) {
      props.activities.forEach(item => {
        let itemname = item.txid
        // names.push(item.txid)
        objects[itemname] = item
      })
      props.updateMainItems({
        mainItems: { repos: {}, activities: objects }
      })
    } else if (index == 2) {
      // props.updateMainItems({
      //   mainItems: {
      //     repos: props.mainItems.repos,
      //     activities: props.mainItems.activities
      //   }
      // })
    }
    props.updateFilterIndex({ filterIndex: index })
  }

  const Button = styled.i`
    cursor: pointer;
  `
  const { activities, repos } = props.mainItems
  if (props.txLoading)
    return (
      <>
        <Icon>
          <img src={dlogo} height="48px" width="48px" />
        </Icon>
        <Loading loading={props.txLoading ? 1 : 0}>
          <FaSpinner />
        </Loading>
      </>
    )

  return (
    <>
      <IssueList>
        <FilterList active={Number(props.filterIndex)}>
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter.state}
              onClick={() => handleFilter(index)}
            >
              {filter.label}
            </button>
          ))}
        </FilterList>
        {props.filterIndex === 0 && (
          <Form>
            <input
              type="text"
              placeholder="Search Repository"
              onChange={handleChange}
            />
            {props.isAuthenticated && (
              <SubmitButton
                onClick={() => {
                  props.openCreateRepoModal({})
                }}
                loading={props.txLoading ? 1 : 0}
              >
                <FaPlus color="#fff" size={14} />
              </SubmitButton>
            )}
          </Form>
        )}

        <List>
          {props.filterIndex == 0 &&
            props.repositories &&
            Object.keys(repos).map(name => (
              <li key={name}>
                <div>
                  {repos[name] &&
                    !repos[name].type && (
                      <Link to={`/${props.address}/${name}`}>
                        <img
                          src={`https://api.adorable.io/avatars/100/${name}.png`}
                          alt={name}
                        />
                        <span>{name}</span>
                      </Link>
                    )}
                </div>
                {repos[name] &&
                  repos[name].status === "confirmed" && (
                    <button>
                      <FaCheckCircle />
                    </button>
                  )}
                {repos[name] &&
                  repos[name].status === "pending" && (
                    <button>
                      <FaSpinner />
                    </button>
                  )}
              </li>
            ))}
          {props.filterIndex == 1 &&
            props.activities &&
            Object.keys(activities).map(txid => (
              <li key={txid}>
                <div>
                  <Link
                    to={`/${props.address}/${activities[txid].repoName ||
                      activities[txid].key}`}
                  >
                    <Container className="activity">
                      <Row>
                        <Col>
                          <span>
                            {`${txid}`.replace(/(.{15})..+/, "$1...")}
                          </span>
                        </Col>
                        <Col>
                          {activities[txid].repoName || activities[txid].key}
                        </Col>
                        <Col>
                          <span className="float-right">
                            {format(
                              parseInt(activities[txid].unixTime) * 1000,
                              "MM/DD HH:mm"
                            )}
                          </span>
                        </Col>
                        <Col>
                          <span>
                            {activities[txid].type === "create-repo"
                              ? activities[txid].value
                              : `Updated ref ${activities[txid].key}`}
                          </span>
                        </Col>
                      </Row>
                    </Container>
                  </Link>
                </div>
              </li>
            ))}
        </List>

        <PageNav>
          <button type="button" onClick={() => this.handlePage("back")}>
            Prev. Page
          </button>
          <button type="button" onClick={() => this.handlePage("next")}>
            Next Page
          </button>
        </PageNav>
      </IssueList>
      <Sponsor match={props.match} />
    </>
  )
})

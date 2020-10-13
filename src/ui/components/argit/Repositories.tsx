import * as React from "react"
import { Link } from "react-router-dom"
import { Table } from "reactstrap"
import { lifecycle } from "recompose"
import styled, { consolidateStreamedStyles } from "styled-components"
import { arweave } from "../../../index"
import { txQuery } from "../../../utils"
import { connector } from "../../actionCreators/index"
import { openCreateRepoModal } from "../../reducers/app"
import { filter } from "fuzzaldrin"
import {
  loadAddress,
  loadNotifications,
  Notification,
  Repository,
  setIsAuthenticated,
  updateRepositories,
  openSponsorModal
} from "../../reducers/argit"
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
  FaCheckCircle,
  FaSpinner,
  FaPlus,
  FaAward,
  FaHistory,
  FaRegFileAlt
} from "react-icons/fa"

import { setTxLoading, updateItems } from "../../reducers/argit"
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
  items: [{ items: string[]; objects: {} }]
  updateItems: typeof updateItems
  openSponsorModal: typeof openSponsorModal
}

export const Repositories = connector(
  state => ({
    repositories: state.argit.repositories,
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    notifications: state.argit.notifications,
    txLoading: state.argit.txLoading,
    items: state.argit.items
  }),
  actions => ({
    loadAddress: actions.argit.loadAddress,
    updateRepositories: actions.argit.updateRepositories,
    openCreateRepoModal: actions.app.openCreateRepoModal,
    loadNotifications: actions.argit.loadNotifications,
    updateItems: actions.argit.updateItems,
    openSponsorModal: actions.argit.openSponsorModal
  }),

  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      // UI Boot
      // await delay(150)
      setTxLoading({ loading: true })

      const { isAuthenticated, repositories, ...actions } = this.props
      let address = this.props.match.params.wallet_address

      if (isAuthenticated) {
        address = await arweave.wallets.jwkToAddress(
          JSON.parse(String(sessionStorage.getItem("keyfile")))
        )
      }

      actions.loadAddress({ address })

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
      actions.updateItems({ items: { items: names, objects: objects } })
      setTxLoading({ loading: false })
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
    props.updateItems({ items: { items: results, objects: objects } })
  }

  const Button = styled.i`
    cursor: pointer;
  `
  let filters = [
    { state: "repos", label: "Repositories", active: true },
    { state: "activity", label: "Activity", active: false },
    { state: "overview", label: "Overview", active: false }
  ]
  let filterIndex = 0
  if (props.txLoading)
    return (
      <NewContainer>
        <Icon>
          <img src={dlogo} height="48px" width="48px" />
        </Icon>
        <Loading loading={props.txLoading ? 1 : 0}>
          <FaSpinner />
        </Loading>
      </NewContainer>
    )

  return (
    <NewContainer>
      <Icon>
        <img src={dlogo} height="48px" width="48px" />
      </Icon>
      <Owner>
        <div />
        <OwnerProfile>
          <a
            href={`/${props.address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`https://api.adorable.io/avatars/100/${props.address}.png`}
              alt={`${props.address}`}
            />
          </a>
        </OwnerProfile>
        <RepoInfo>
          <h1 className="d-md-none">
            {`${props.address}`.replace(/(.{7})..+/, "$1...")}
          </h1>
          <h1 className="d-none d-md-block">{props.address}</h1>
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
          </div>
        </RepoInfo>
      </Owner>

      <IssueList>
        <FilterList active={Number(filterIndex)}>
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter.state}
              onClick={() => props.handleFilter(index)}
            >
              {filter.label}
            </button>
          ))}
        </FilterList>
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

        <List>
          {props.items.items &&
            props.items.objects &&
            props.items.items.map(name => (
              <li key={name}>
                <div>
                  <Link to={`/${props.address}/${name}`}>
                    <img
                      src={`https://api.adorable.io/avatars/100/${name}.png`}
                      alt={name}
                    />
                    <span>{name}</span>
                  </Link>
                </div>
                {props.items.objects[name] &&
                  props.items.objects[name].status === "confirmed" && (
                    <button>
                      <FaCheckCircle />
                    </button>
                  )}
                {props.items.objects[name] &&
                  props.items.objects[name].status === "pending" && (
                    <button>
                      <FaSpinner />
                    </button>
                  )}
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
    </NewContainer>
  )
})

import * as React from "react"
import { Link } from "react-router-dom"
import { Table } from "reactstrap"
import { lifecycle } from "recompose"
import styled from "styled-components"
import { arweave } from "../../../index"
import { txQuery } from "../../../utils"
import { connector } from "../../actionCreators/index"
import { openCreateRepoModal } from "../../reducers/app"
import {
  loadAddress,
  loadNotifications,
  Notification,
  Repository,
  setIsAuthenticated,
  updateRepositories
} from "../../reducers/argit"
import NewContainer, {
  Icon,
  List,
  SubmitButton,
  Form
} from "../argit/Repository/Container"
import dlogo from "../argit/images/dlogo.svg"
import { FaCheckCircle, FaSpinner, FaPlus } from "react-icons/fa"
type ConnectedProps = {
  isAuthenticated: boolean
  repositories: Repository[]
  setIsAuthenticated: typeof setIsAuthenticated
  loadAddress: typeof loadAddress
  updateRepositories: typeof updateRepositories
  openCreateRepoModal: typeof openCreateRepoModal
  loadNotifications: typeof loadNotifications
  notifications: typeof Notification[]
}

export const Repositories = connector(
  state => ({
    repositories: state.argit.repositories,
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    notifications: state.argit.notifications
  }),
  actions => ({
    loadAddress: actions.argit.loadAddress,
    updateRepositories: actions.argit.updateRepositories,
    openCreateRepoModal: actions.app.openCreateRepoModal,
    loadNotifications: actions.argit.loadNotifications
  }),
  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      // UI Boot
      // await delay(150)

      const { isAuthenticated, repositories, ...actions } = this.props

      if (isAuthenticated) {
        const address = await arweave.wallets.jwkToAddress(
          JSON.parse(String(sessionStorage.getItem("keyfile")))
        )
        actions.loadAddress({ address })

        const txids = await arweave.arql(txQuery(address, "create-repo"))
        let notifications: Notification[] = []
        let completed_txids: String[] = []
        const repositories = await Promise.all(
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
        actions.updateRepositories({ repositories })
      }
    }
  })
)(function RepositoriesImpl(props) {
  const Button = styled.i`
    cursor: pointer;
  `

  return (
    <React.Fragment>
      <NewContainer>
        <Icon>
          <img src={dlogo} height="48px" width="48px" />
        </Icon>
        <h1>
          Repositories {"  "}
          <SubmitButton onClick={() => props.openCreateRepoModal({})}>
            <FaPlus color="#fff" size={26} />
          </SubmitButton>
          {/* <button
            onClick={() => props.openCreateRepoModal({})}
            className="fa fa-plus-square-o"
            aria-hidden="true"
          /> */}
        </h1>
        <List>
          {props.repositories.map(repo => (
            <li key={repo.name}>
              <div>
                <Link to={`/${props.address}/${repo.name}`}>
                  <img
                    src={`https://api.adorable.io/avatars/100/${repo.name}.png`}
                    alt={repo.name}
                  />
                  <span>{repo.name}</span>
                </Link>
              </div>
              {repo.status === "confirmed" && (
                <button>
                  <FaCheckCircle />
                </button>
              )}
              {repo.status === "pending" && (
                <button>
                  <FaSpinner />
                </button>
              )}
            </li>
          ))}
        </List>
      </NewContainer>
    </React.Fragment>
  )
})

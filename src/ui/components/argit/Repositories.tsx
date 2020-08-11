import * as React from "react"
import { Link } from "react-router-dom"
import { connector } from "../../actionCreators/index"
import { lifecycle } from "recompose"
import { arweave } from "../../../index"
import styled from "styled-components"

import {
  Repository,
  setIsAuthenticated,
  loadAddress,
  updateRepositories,
  loadNotifications,
  Notification
} from "../../reducers/argit"
import { txQuery } from "../../../utils"
import { openCreateRepoModal } from "../../reducers/app"
import { object } from "prop-types"
import { Table, Button } from "reactstrap"
import { decode } from "punycode"

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
              const decoded: any = JSON.parse(data)
              repository = {
                name: decoded.name,
                description: decoded.description,
                txid: txid,
                status: "confirmed"
              }
              completed_txids.push(txid)
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
      <h1>
        Repositories{" "}
        <Button
          onClick={() => props.openCreateRepoModal({})}
          className="fa fa-plus-square-o"
          aria-hidden="true"
        />
        <br />
      </h1>
      <Table bordered>
        <thead>
          <tr className="fs-sm">
            <th>Name</th>
            <th className="hidden-sm-down">tx-id</th>
            <th className="hidden-sm-down">Tx Status</th>
          </tr>
        </thead>
        <tbody>
          {props.repositories &&
            props.repositories.map(
              repository =>
                repository.status === "confirmed" && (
                  <tr key={repository.txid}>
                    <td>
                      <Link
                        to={`/app/main/repository/${props.address}/${
                          repository.name
                        }`}
                      >
                        {repository.name}
                      </Link>
                    </td>
                    <td>{repository.txid}</td>
                    {repository.status && (
                      <td>
                        <i className="fa fa-check-circle" aria-hidden="true" />
                      </td>
                    )}
                  </tr>
                )
            )}
        </tbody>
      </Table>
    </React.Fragment>
  )
})

// <div key={repository.name} className="card mt-4">
//   <div className="card-body">
//     <Link
//       to={`/app/main/repository/${props.address}/${
//         repository.name
//       }`}
//     >
//       {repository.name}
//     </Link>
//     <p>{repository.description}</p>
//   </div>
// </div>

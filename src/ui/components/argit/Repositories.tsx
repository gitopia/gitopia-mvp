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
              console.log(typeof data, typeof Uint8Array)
              if (typeof data === "object") {
                console.log(new TextDecoder("utf-8").decode(data))
              }

              const decoded: any = JSON.parse(data)
              repository = {
                name: decoded.name,
                description: decoded.description
              }
              completed_txids.push(txid)
            } catch (error) {
              console.log("error", error)
              repository = {
                name: txid,
                description: "Pending confirmation"
              }
              notifications.push({
                type: "pending",
                action: "Create Repo",
                txid: txid
              })
            }

            if (!repository) {
              repository = {
                name: txid,
                description: "null"
              }
            }

            return repository
          })
        )
        const newNotifications = this.props.notifications.map(notif => {
          console.log(
            notif.txid,
            completed_txids,
            completed_txids.includes(notif.txid)
          )
          if (notif.type == "pending" && completed_txids.includes(notif.txid)) {
            return {
              type: "confirmed",
              action: "Create Repo",
              txid: notif.txid
            }
          } else {
            return {
              type: "pending",
              action: "Create Repo",
              txid: notif.txid
            }
          }
        })
        console.log("not", notifications, newNotifications)
        actions.loadNotifications({ notifications: newNotifications })
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
          className="fa fa-plus-circle"
          aria-hidden="true"
        />
      </h1>

      {props.repositories &&
        props.repositories.map(
          repository =>
            repository.name && (
              <div key={repository.name} className="card mt-4">
                <div className="card-body">
                  <Link
                    to={`/app/main/repository/${props.address}/${
                      repository.name
                    }`}
                  >
                    {repository.name}
                  </Link>
                  <p>{repository.description}</p>
                </div>
              </div>
            )
        )}
    </React.Fragment>
  )
})

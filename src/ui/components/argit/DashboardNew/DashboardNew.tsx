import { format } from "date-fns"
import * as React from "react"
import { Link } from "react-router-dom"
import { CardBody, CardTitle, Col, Row } from "reactstrap"
import { lifecycle } from "recompose"
import { arweave } from "../../../../index"
import { getAllActivities, txQuery } from "../../../../utils"
import { connector } from "../../../actionCreators/index"
import { openCreateRepoModal } from "../../../reducers/app"
import {
  Activity,
  loadActivities,
  loadAddress,
  loadNotifications,
  Notification,
  Repository,
  setIsAuthenticated,
  updateRepositories
} from "../../../reducers/argit"
import Widget from "../Widget/Widget"
import s from "./DashboardNew.module.scss"

type ConnectedProps = {
  isAuthenticated: boolean
  repositories: Repository[]
  setIsAuthenticated: typeof setIsAuthenticated
  loadAddress: typeof loadAddress
  updateRepositories: typeof updateRepositories
  openCreateRepoModal: typeof openCreateRepoModal
  loadNotifications: typeof loadNotifications
  notifications: Notification[]
  loadActivities: typeof loadActivities
  activities: Activity[]
}

export const DashboardNew = connector(
  state => ({
    repositories: state.argit.repositories,
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    notifications: state.argit.notifications,
    activities: state.argit.activities
  }),
  actions => ({
    loadAddress: actions.argit.loadAddress,
    updateRepositories: actions.argit.updateRepositories,
    openCreateRepoModal: actions.app.openCreateRepoModal,
    loadNotifications: actions.argit.loadNotifications,
    loadActivities: actions.argit.loadActivities
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

        const activities = await getAllActivities(arweave, address)
        actions.loadActivities({ activities })
        console.log(activities)
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

              const decoded: any = JSON.parse(data)
              repository = {
                name: decoded.name,
                description: decoded.description
              }
              completed_txids.push(txid)
            } catch (error) {
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
        const newNotifications = notifications.map(notif => {
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
        actions.loadNotifications({ notifications: newNotifications })
        actions.updateRepositories({ repositories })
      }
    }
  })
)(function DashboardNew(props) {
  return (
    <div className={s.root}>
      <h1 className="page-title">
        <small>Activity Feed</small>
      </h1>

      <Row>
        <Col lg={7}>
          {props.activities.map(activity => (
            <div key={activity.txid}>
              <div className="card-dgit mt-3 mb-4">
                <CardBody>
                  <CardTitle>
                    {/* <span
                      className={`${
                        s.avatar
                      } rounded-circle thumb-sm float-left mr-2`}
                    >
                      <img
                        src={`https://api.adorable.io/avatars/100/${
                          props.address
                        }.png`}
                        alt="..."
                      />
                    </span> */}
                    <img
                      className="inline-block h-10 w-10 rounded-full text-white shadow-solid"
                      src={`https://api.adorable.io/avatars/100/${
                        props.address
                      }.png`}
                      alt=""
                    />
                    <span className="ml-2">
                      {activity.type === "create-repo"
                        ? " New Repo Created"
                        : "Repo Updated"}
                    </span>
                  </CardTitle>
                  <div>
                    <Link
                      to={`/app/main/repository/${
                        props.address
                      }/${activity.repoName || activity.key}`}
                    >
                      {activity.repoName || activity.key}
                    </Link>
                    <div className="float-right">
                      {format(
                        parseInt(activity.unixTime) * 1000,
                        "MM/DD HH:mm"
                      )}
                    </div>
                    <div>
                      {activity.type === "create-repo"
                        ? activity.value
                        : `Updated ref ${activity.key} => ${activity.value}`}
                    </div>
                  </div>
                </CardBody>
              </div>
            </div>
          ))}
        </Col>
        <Col lg={1} />

        <Col lg={4}>
          <Widget
            title={
              <h5>
                {" "}
                Active
                <span className="fw-semi-bold">&nbsp;Repositories</span>
              </h5>
            }
          >
            <div className="widget-body">
              {props.repositories.map(repository => (
                <div key={repository.name} className="list-group list-group-lg">
                  <span>
                    <i className="fa fa-code-fork" />
                    &nbsp;&nbsp;&nbsp;
                    <Link
                      to={`/app/main/repository/${props.address}/${
                        repository.name
                      }`}
                    >
                      {repository.name}
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  )
})

import React, { Component } from "react"
import { arweave } from "../../../index"
import Input from "../../../ui/components/utils/input"
import { Repository as Repo } from "../../../ui/reducers/argit"
import { closeCreateRepoModal } from "../../reducers/app"
import { updateRepositories, updateMainItems } from "../../reducers/argit"
import { Redirect, withRouter } from "react-router-dom"
import { loadNotifications, Notification } from "../../reducers/argit"

type NewRepoFormProps = {
  address: string
  mainItems: {}
  repositories: []
  closeCreateRepoModal: typeof closeCreateRepoModal
  updateRepositories: typeof updateRepositories
  updateMainItems: typeof updateMainItems
  history: any
  wallet: string
  loadNotifications: typeof loadNotifications
  notifications: typeof Notification[]
}

type NewRepoFormState = {
  repo: Repo
  errors: { name: string | null }
  transactionLoading: boolean
  numTokens: string
  disabled: boolean
}

class NewRepoForm extends Component<NewRepoFormProps, NewRepoFormState> {
  state = {
    repo: {
      name: "",
      description: ""
    },
    errors: { name: "" },
    transactionLoading: false,
    numTokens: "0",
    disabled: false
  }
  constructor(props: NewRepoFormProps) {
    super(props)
    this.handleSubmit.bind(this)
  }
  checkIfExists = (name: string) => {
    const { repositories } = this.props
    const found = repositories.some(repo => repo.name === name)
    return found ? true : false
  }

  validate = () => {
    const errors = { name: "" }
    const { repo } = this.state
    if (repo.name.trim() === "") {
      errors.name = "Repository Name is required"
    }
    if (!/^[A-Za-z0-9_.-]*$/.test(repo.name)) {
      errors.name =
        "Repository name should only include alphanumeric characters, _, . or -"
    }
    if (this.checkIfExists(repo.name)) {
      errors.name = "Repository Name already exists"
    }
    if (errors.name == "") {
      return null
    }
    return errors
  }

  arCreate = async () => {
    this.setState({ transactionLoading: true })

    const { name, description } = this.state.repo
    let wallet = JSON.parse(this.props.wallet)
    const data = JSON.stringify({
      name: name,
      description: description
    })
    console.log(data)
    let tx = await arweave.createTransaction({ data }, wallet)

    tx.addTag("Repo", name)
    tx.addTag("Version", "0.0.2")
    tx.addTag("Type", "create-repo")
    tx.addTag("App-Name", "Gitopia")
    tx.addTag("Unix-Time", String(Math.round(new Date().getTime() / 1000))) // Add Unix timestamp
    tx.addTag("Content-Type", "application/json")

    await arweave.transactions.sign(tx, wallet) // Sign transaction
    let tx_id = tx.id // Get transaction id from signed transaction
    console.log(tx_id)

    // Check if sending wallet has enough AR to cover transaction fees
    let jwk_wallet = await arweave.wallets.jwkToAddress(wallet)
    let wallet_balance = await arweave.wallets.getBalance(jwk_wallet) // Collect balance
    let balance_in_ar = await arweave.ar.winstonToAr(wallet_balance) // Convert winston to AR

    if (
      parseFloat(balance_in_ar) <
      0.00000001 + parseFloat(this.state.numTokens)
    ) {
      // Throw a toast notification error
      // Stop loading status
      this.setState({ transactionLoading: false })
      // Stop further execution
      return
    }

    await arweave.transactions.post(tx) // Post transaction
    console.log(tx)
    try {
      const data: any = await arweave.transactions.getData(tx.id, {
        decode: true,
        string: true
      })
      console.error(data)
    } catch (error) {
      console.log(error)
    }
    try {
      const decoded: any = JSON.parse(data)
      this.setState({ transactionLoading: false }) // Set loading status to false
      this.props.closeCreateRepoModal({})

      console.log(tx)
      const repository = {
        name: decoded.name,
        type: "create-repo",
        txid: tx.id
      }
      const notification = {
        txid: tx.id,
        type: "pending",
        action: `Create ${decoded.name} Repo`
      }
      this.props.loadNotifications({
        notifications: [...this.props.notifications, notification]
      })
      let newRepos = { ...this.props.mainItems.repos }
      newRepos[name] = repository
      console.log(newRepos)
      this.props.updateMainItems({
        mainItems: {
          repos: newRepos,
          activities: this.props.mainItems.activities
        }
      })
      return decoded.name
    } catch (error) {
      return Error(error)
    }
  }

  handleSubmit = e => {
    this.setState({ disabled: true })
    e.preventDefault()
    const errors = this.validate()
    if (errors) {
      this.setState({ errors: errors })
      return
    }
    this.arCreate().then(name => {
      console.log(name)

      this.props.history.push(`/${this.props.address}/${name}`)
      this.props.updatePage({ page: "repo" })
      this.props.updateFilterIndex({ filterIndex: 0 })
    })
  }

  handleChange = ({ currentTarget: input }) => {
    const repo = { ...this.state.repo }
    repo[input.name] = input.value
    this.setState({ repo })
  }

  render() {
    const { repo, errors } = this.state
    return (
      <div>
        <h2>Create Repository</h2>
        <br />

        <form onSubmit={this.handleSubmit}>
          <Input
            name="name"
            value={repo.name}
            label="Repository Name"
            onChange={this.handleChange}
            error={errors.name}
          />

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              onChange={this.handleChange}
              value={repo.description}
              id="description"
              type="text"
              className="form-control"
              rows={3}
              name="description"
            />
          </div>
          <button className="btn btn-primary" disabled={this.state.disabled}>
            Create Repository{" "}
            {this.state.disabled && <i className="fa fa-spinner fa-spin" />}
          </button>
        </form>
      </div>
    )
  }
}

export default withRouter(NewRepoForm)

import React, { Component } from "react"
import { arweave } from "../../../index"
import Input from "../../../ui/components/utils/input"
import { closeSponsorModal } from "../../../ui/reducers/argit"
import { parse } from "querystring"

type SponsorFormProps = {
  address: string
  repo: string | null
  closeSponsorModal: typeof closeSponsorModal
  wallet: string
}

type SponsorFormState = {
  amount: string
  errors: { amount: string | null; balance: string | null }
  transactionLoading: boolean
  numTokens: string
}

class SponsorForm extends Component<SponsorFormProps, SponsorFormState> {
  state = {
    amount: "0.01",
    errors: { amount: "", balance: "" },
    transactionLoading: false,
    numTokens: "0"
  }
  constructor(props: SponsorFormProps) {
    super(props)
    this.handleSubmit.bind(this)
  }

  validate = () => {
    const errors = { amount: "", balance: "" }
    const { amount } = this.state
    if (parseFloat(amount) < 0) {
      errors.amount = "Amount cannot be less than 0"
    }

    return errors
  }

  arCreate = async () => {
    this.setState({ transactionLoading: true })
    console.log(this.props.wallet)
    let wallet = JSON.parse(this.props.wallet)

    // First we create the transaction
    const transaction = await arweave.createTransaction(
      {
        target: this.props.address, // wallet address
        quantity: arweave.ar.arToWinston(this.state.amount) // amount of AR to send, converted to Winston
      },
      wallet
    )

    transaction.addTag("Repo", this.props.repo)
    transaction.addTag("Version", "0.0.2")
    transaction.addTag("Type", "sponsor")
    transaction.addTag("App-Name", "Gitopia")
    transaction.addTag("Content-Type", "application/json")
    transaction.addTag(
      "Unix-Time",
      String(Math.round(new Date().getTime() / 1000))
    ) // Add Unix timestamp
    // Now we sign the transaction
    await arweave.transactions.sign(transaction, wallet)
    // After is signed, we send the transaction

    // Check if sending wallet has enough AR to cover transaction fees
    let jwk_wallet = await arweave.wallets.jwkToAddress(wallet)
    let wallet_balance = await arweave.wallets.getBalance(jwk_wallet) // Collect balance
    let balance_in_ar = await arweave.ar.winstonToAr(wallet_balance) // Convert winston to AR

    if (
      parseFloat(balance_in_ar) <
        0.00000001 + parseFloat(this.state.numTokens) ||
      parseFloat(balance_in_ar) < parseFloat(this.state.amount)
    ) {
      // Throw a toast notification error
      // Stop loading status
      this.setState({ transactionLoading: false })
      // Stop further execution
      return
    }

    await arweave.transactions.post(transaction)
    console.log(transaction)

    this.setState({ transactionLoading: false }) // Set loading status to false
    this.props.closeSponsorModal({})
  }

  handleSubmit = e => {
    e.preventDefault()
    const errors = this.validate()
    if (errors.amount || errors.balance) {
      this.setState({ errors: errors })
      return
    }
    console.log("here")
    this.arCreate()
  }

  handleChange = ({ currentTarget: input }) => {
    const amount = input.value
    this.setState({ amount })
  }

  render() {
    const { errors, amount } = this.state
    const { address, repo } = this.props
    return (
      <div>
        {repo && (
          <h2 className="sponsor-h2">
            Sponsor {address} for their work on {repo}
          </h2>
        )}
        {!repo && (
          <h2 className="sponsor-h2">Sponsor {address} for their work</h2>
        )}
        <br />
        <form onSubmit={this.handleSubmit}>
          <Input
            name="amount"
            value={amount}
            label="Sponsor Amount"
            onChange={this.handleChange}
            error={errors.amount}
          />

          <div className="form-group" />
          <button className="btn btn-primary">Sponsor</button>
        </form>
      </div>
    )
  }
}

export default SponsorForm

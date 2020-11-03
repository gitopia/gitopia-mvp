import {
  Pagination as RPagination,
  PaginationItem,
  PaginationLink
} from "reactstrap"
import * as React from "react"
import { Link } from "react-router-dom"
import { setTxLoading } from "../../reducers/argit"

export class Pagination extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      objPerPage: 15,
      currentObjs: [],
      pageNumbers: []
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event, number) {
    this.setState({
      currentPage: number
    })
  }
  componentDidMount() {
    const { currentPage, objPerPage } = this.state

    // Logic for displaying current Objs
    const indexOfLastObj = currentPage * objPerPage
    const indexOfFirstObj = indexOfLastObj - objPerPage
    const currentObjs = Object.keys(this.props.mainItems.repos).slice(
      indexOfFirstObj,
      indexOfLastObj
    )
    this.setState({ currentObjs })
    const pageNumbers = []
    for (
      let i = 1;
      i <=
      Math.ceil(
        Object.keys(this.props.mainItems.repos).length / this.state.objPerPage
      );
      i++
    ) {
      pageNumbers.push(i)
    }
    console.log(pageNumbers)
    this.setState({ pageNumbers })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mainItems.repos !== this.props.mainItems.repos) {
      const { currentPage, objPerPage } = this.state

      // Logic for displaying current Objs
      const indexOfLastObj = currentPage * objPerPage
      const indexOfFirstObj = indexOfLastObj - objPerPage
      const currentObjs = Object.keys(nextProps.mainItems.repos).slice(
        indexOfFirstObj,
        indexOfLastObj
      )

      this.setState({ currentObjs })
      console.log("updated")

      const pageNumbers = []
      for (
        let i = 1;
        i <=
        Math.ceil(
          Object.keys(nextProps.mainItems.repos).length / this.state.objPerPage
        );
        i++
      ) {
        pageNumbers.push(i)
      }
      console.log(pageNumbers)

      this.setState({ pageNumbers })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      const { currentPage, objPerPage } = this.state

      // Logic for displaying current Objs
      const indexOfLastObj = currentPage * objPerPage
      const indexOfFirstObj = indexOfLastObj - objPerPage
      const currentObjs = Object.keys(this.props.mainItems.repos).slice(
        indexOfFirstObj,
        indexOfLastObj
      )

      this.setState({ currentObjs })
    }
  }

  render() {
    // Logic for displaying page numbers

    const renderPageNumbers = this.state.pageNumbers.map(number => {
      return (
        <PaginationItem
          active={number === this.state.currentPage}
          key={number}
          onClick={e => this.handleClick(e, number)}
        >
          <PaginationLink>{number}</PaginationLink>
        </PaginationItem>
      )
    })

    return (
      <>
        {!this.state.currentObjs &&
          !this.props.txLoading &&
          (this.props.isAuthenticated ? (
            <p>
              You have no repositories. Create one by clicking{" "}
              <i className="fa fa-plus" />
            </p>
          ) : (
            <p>The user has no repositories.</p>
          ))}
        {!this.props.txLoading &&
          this.state.currentObjs.map(obj => {
            return (
              <>
                <ul>
                  <li key={this.props.mainItems.repos[obj].txid}>
                    {" "}
                    <div>
                      {this.props.mainItems.repos[obj].name && (
                        <Link
                          to={`/${this.props.match.params.wallet_address}/${
                            this.props.mainItems.repos[obj].name
                          }`}
                          onClick={() => {
                            this.props.setTxLoading({ loading: true })
                            this.props.updatePage({ page: "repo" })
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="27"
                            height="27"
                            className="repo-list"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                            />
                          </svg>
                          <span>{this.props.mainItems.repos[obj].name}</span>
                        </Link>
                      )}
                    </div>
                    {this.props.mainItems.repos[obj].name && (
                      <button>
                        <i className="fa fa-check-circle" />
                      </button>
                    )}
                  </li>
                </ul>
              </>
            )
          })}
        {!this.props.txLoading &&
          this.state.currentObjs && (
            <div className="pagination">
              <RPagination>
                <PaginationItem>
                  <PaginationLink
                    first
                    onClick={event => {
                      this.setState({ currentPage: 1 })
                    }}
                  />
                </PaginationItem>
                <PaginationItem disabled={this.state.currentPage <= 1}>
                  <PaginationLink
                    previous
                    onClick={event => {
                      this.setState({
                        currentPage: this.state.currentPage - 1
                      })
                    }}
                  />
                </PaginationItem>
                {renderPageNumbers}

                <PaginationItem
                  disabled={
                    this.state.currentPage >= this.state.pageNumbers.length
                  }
                >
                  <PaginationLink
                    next
                    onClick={event => {
                      this.setState({
                        currentPage: this.state.currentPage + 1
                      })
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    last
                    onClick={event => {
                      this.setState({
                        currentPage: this.state.pageNumbers[
                          this.state.pageNumbers.length - 1
                        ]
                      })
                    }}
                  />
                </PaginationItem>
              </RPagination>
            </div>
          )}
      </>
    )
  }
}

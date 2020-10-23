import {
  Pagination as RPagination,
  PaginationItem,
  PaginationLink
} from "reactstrap"
import * as React from "react"
import { Link } from "react-router-dom"
import { FaCheckCircle, FaSpinner, FaPlus } from "react-icons/fa"

export class Pagination extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      objPerPage: 15,
      currentObjs: []
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event, number) {
    console.log(event, number)
    this.setState({
      currentPage: number
    })
  }
  componentDidMount() {
    const { currentPage, objPerPage } = this.state

    // Logic for displaying current Objs
    const indexOfLastObj = currentPage * objPerPage
    const indexOfFirstObj = indexOfLastObj - objPerPage
    const currentObjs = this.props.repositories.slice(
      indexOfFirstObj,
      indexOfLastObj
    )

    this.setState({ currentObjs })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      const { currentPage, objPerPage } = this.state

      // Logic for displaying current Objs
      const indexOfLastObj = currentPage * objPerPage
      const indexOfFirstObj = indexOfLastObj - objPerPage
      const currentObjs = this.props.repositories.slice(
        indexOfFirstObj,
        indexOfLastObj
      )

      this.setState({ currentObjs })
    }
  }

  render() {
    // Logic for displaying page numbers
    const pageNumbers = []
    for (
      let i = 1;
      i <= Math.ceil(this.props.repositories.length / this.state.objPerPage);
      i++
    ) {
      pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map(number => {
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
        <ul>
          {this.state.currentObjs.map(obj => {
            return (
              <li key={obj.txid}>
                {" "}
                <div>
                  {obj.name && (
                    <Link
                      to={`/${this.props.address}/${obj.name}`}
                      onClick={() => {
                        this.props.updatePage({ page: "repo" })
                      }}
                    >
                      <img
                        src={`https://api.adorable.io/avatars/100/${
                          obj.name
                        }.png`}
                        alt={obj.name}
                      />
                      <span>{obj.name}</span>
                    </Link>
                  )}
                </div>
                {obj.name && (
                  <button>
                    <FaCheckCircle />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
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
                  this.setState({ currentPage: this.state.currentPage - 1 })
                }}
              />
            </PaginationItem>
            {renderPageNumbers}

            <PaginationItem
              disabled={this.state.currentPage >= pageNumbers.length}
            >
              <PaginationLink
                next
                onClick={event => {
                  this.setState({ currentPage: this.state.currentPage + 1 })
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                last
                onClick={event => {
                  this.setState({
                    currentPage: pageNumbers[pageNumbers.length - 1]
                  })
                }}
              />
            </PaginationItem>
          </RPagination>
        </div>
      </>
    )
  }
}

import styled, { keyframes, css } from "styled-components"
import colorContrast from "./colorContrast"

const rotate = keyframes`
from {
  transform: rotate(0deg)
}

to {
  transform: rotate(360deg)
}
`

export const Loading = styled.div`
  background: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 731px;

  ${props =>
    props.loading &&
    css`
      svg {
        font-size: 40px;
        animation: ${rotate} 2s linear infinite;
        color: #3f51b5 !important;
      }
    `};
`

export const Owner = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  div:first-child {
    align-self: flex-start;
    flex: 1 1 100%;
    margin-bottom: 40px;

    & > a {
      color: #3f51b5;
      font-size: 16px;
      text-decoration: none;

      &:hover {
        color: #907dcf;
      }

      & svg {
        vertical-align: top;
        margin-right: 4px;
      }
    }
  }
`

export const OwnerProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
  align-self: flex-start;

  @media (max-width: 600px) {
    margin: 0 0 5px 0;
  }

  h2 {
    font-size: 20px;
    white-space: nowrap;
    width: 100%; /* IE6 needs any width */
    overflow: hidden; /* "overflow" value must be different from  visible"*/
    -o-text-overflow: ellipsis; /* Opera < 11*/
    text-overflow: ellipsis;
  }

  img {
    width: 88px;
    border-radius: 50%;
    border: 4px solid #e6e6e6;
    margin-bottom: 5px;
  }
`

export const RepoInfo = styled.div`
  align-self: flex-start;
  align-items: center;

  @media (max-width: 820px) {
    text-align: center;
  }

  h1 {
    font-size: 24px;

    & > a {
      color: inherit;
      text-decoration: none;

      &:hover {
        color: #3f51b5;
      }
    }
  }

  & div {
    margin: 8px 0 16px;

    & span {
      font-size: 14px;
      background: #3f51b5;
      color: #fff;
      padding: 4px 8px;
      border-radius: 3px;
      margin-right: 8px;

      & svg {
        vertical-align: text-top;
        margin-right: 4px;
      }
    }
  }

  p {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    max-width: 400px;
  }
`

export const FilterList = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;

  button {
    border: 0;
    padding: 16px 20px;
    margin: 0 0.5rem;
    background: none;
    color: #666;
    border-bottom: 2px solid transparent;
    text-transform: uppercase;

    &:nth-child(${props => props.active + 1}) {
      font-weight: bold;
      color: #3f51b5;
      border-bottom: 2px solid #3f51b5;
    }

    &:hover {
      color: #3f51b5;
    }
  }
`

export const IssueList = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  border-top: 1px solid #eee;
  list-style: none;
  min-height: 524px;

  li {
    & + li {
    }

    a {
      padding: 15px 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      text-decoration: none;
      color: #333;
      line-height: 21px;
      display: flex;
      transition: all 180ms ease-in-out;

      &:hover {
        color: #3f51b5;
        border-color: #ddd;
        transform: scale(1.005);
        box-shadow: 0 12px 10px -10px hsla(254, 26%, 25%, 0.27);
      }
    }

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #eee;
    }

    div {
      flex: 1;

      strong {
        font-size: 16px;
      }

      p {
        margin-top: 5px;
        font-size: 12px;
        color: #999;
      }
    }
  }
`

export const IssueLabel = styled.span`
  background: ${({ color }) => `#${color}`};
  color: ${({ color }) => colorContrast(color)};
  display: inline-block;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  height: 20px;
  padding: 3px 8px;
  margin-right: 10px;
  line-height: 12px;
`

export const PageNav = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0 0;
  margin-top: auto;

  button {
    border-radius: 3px;
    border: 0;
    padding: 12px 20px;
    margin: 0;

    &:hover {
      background: #3f51b5;
      color: #fff;
    }

    &[disabled] {
      background: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.3);
      cursor: auto;
    }

    svg {
      vertical-align: middle;
      font-size: 20px;
    }

    &:nth-child(1) svg {
      margin-right: 4px;
    }

    &:nth-child(2) svg {
      margin-left: 4px;
    }
  }
`

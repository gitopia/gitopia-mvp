import styled from "styled-components"

const NewContainer = styled.div`
  max-width: 900px;
  background: #f8f8f9;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;
  position: relative;

  & > h1 {
    font-size: 24px;
    text-align: center;
    color: #534974;
  }

  @media (max-width: 600px) {
    margin-top: 0;
    border-radius: 0;
  }
`

export const Icon = styled.h2`
  position: absolute;
  left: 50%;
  bottom: -40px;
  transform: translateX(-50%);
  background: white;
  color: #3f51b5;
  width: 80px;
  height: 80px;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 12px 10px -4px rgba(25, 10, 74, 0.23);
`

export default NewContainer

export const List = styled.ul`
  margin-top: 30px;
  list-style-type: none;
  font-size: 16px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & + li {
      border-top: 1px solid #eee;
    }

    img {
      width: 32px;
      margin-right: 12px;
      border-radius: 50%;
      border: 2px solid #dbdbdb;
    }

    a {
      display: flex;
      align-items: center;
      color: inherit;
      text-decoration: none;

      &:hover {
        color: #3f51b5;
      }
    }

    button {
      color: #999;
      background: none;
      border: 0;
      padding: 6px 0 6px 16px;

      &:hover {
        color: #3f51b5;
      }
    }
  }
`

export const SubmitButton = styled.button`
  background: #3f51b5;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;
`

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: solid 2px #4051b5;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
  }
`

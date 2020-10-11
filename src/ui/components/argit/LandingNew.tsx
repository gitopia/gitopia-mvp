import * as React from "react"
import { HashRouter, Redirect, Route, Switch } from "react-router-dom"
import { connector } from "../../actionCreators/index"
import { Layout } from "./Layout/Layout"
import { lifecycle } from "recompose"
import logo from "../argit/images/logosv.svg"
import dlogo from "../argit/images/dlogo.svg"
import serverImage from "./images/undraw_server_q2pb.svg"
import availabilityImage from "./images/undraw_Memory_storage_reh0.svg"
import securityImage from "./images/undraw_security_o890.svg"
import votingImage from "./images/undraw_voting_nvu7.svg"
import osImage from "./images/undraw_open_source_1qxw.svg"
import pushImage from "./images/undraw_pull_request_gld8.svg"

import "./LandingNewGlobal.css"
import "./LandingNewBase.css"
import "./styles/theme.scss"

export const LandingNew = connector(
  state => ({
    isAuthenticated: state.argit.isAuthenticated
  }),
  actions => ({
    openLoginModal: actions.argit.openLoginModal
  }),
  lifecycle<{}, {}>({
    async componentDidMount() {
      var script = document.createElement("script")
      var hscript = document.createElement("script")
      hscript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"
      document.getElementsByTagName("head")[0].appendChild(hscript)
      script.src =
        "https://raw.githack.com/TheTechTrap/codrops-scribbler/93e605a748752a2ee8da008c35f85f05b07c4c44/scribbler.js"
      document.getElementsByTagName("head")[0].appendChild(script)
      hscript.onload = () => {
        hljs.initHighlighting()
      }
        var typer = document.getElementById("typewriter")

        var typewriter = setupTypewriter(typer)

        typewriter.type()
    }
  })
)(function LandingNewImpl(props: any) {
  if (props.isAuthenticated)
    return (
      <HashRouter>
        <Switch>
          <Route path="/app" exact render={() => <Redirect to="/app/main" />} />
          <Route path="/app" render={(props: any) => <Layout {...props} />} />
          <Redirect from="*" to="/app/main/dashboard" />
        </Switch>
      </HashRouter>
    )

  return (
    <React.Fragment>
      <div className="landing-body">
        <nav className="landing-nav">
          <div className="landing-logo">
            <img src={dlogo} height="32px" width="32px" />
          </div>
          <ul className="landing-menu">

            {/* <li className="landing-menu__item">
              <a
                href="doc.html"
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-book" /> Documentation
              </a>
            </li> */}
            <li className="landing-menu__item landing-toggle">
              <a
                href="#"
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
            <li className="landing-menu__item">
              <a
                href="#"
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
          </ul>
        </nav>
        <div className="landing-hero">
          <h1 className="landing-hero__title">
            <img width="150px" height="150px" src={logo} />
          </h1>
          <p className="landing-hero__description">
            Permanent versioning for your Code
          </p>
        </div>
        <div className="landing-hero__terminal">
          <pre className="landing-pre" id="typewriter">
            <span className="dgit-highlight">dgit ~ $</span> <span className="dgit-code" >git remote add
          origin dgit://VC4NJ3nlVJJPgyJ4DScpeXx3-UnXmiasfrxiIFpJwb0/repo-name{"\n"}</span>


            <span className="dgit-highlight">dgit ~ $</span><span className="dgit-code" >git push origin
            master</span>
          </pre>
          {/* <pre className="landing-pre">
            <code className="landing-shell-session">
              dgit ~ $ git remote add origin
              dgit://VC4NJ3nlVJJPgyJ4DScpeXx3-UnXmiasfrxiIFpJwb0/repo-name
            </code>
            <code className="landing-shell-session">
              dgit ~ $ git push origin master
            </code>
          </pre> */}
        </div>
        <div className="landing-wrapper">
          <div className="landing-installation">
            <h3 className="landing-section__title">Installation</h3>
            <div className="landing-tab__container">
              {/* <ul className="landing-tab__menu">
                <li className="landing-tab active" data-tab="mac">
                  mac
                </li>
                <li className="landing-tab" data-tab="linux">
                  linux
                </li>
                <li className="landing-tab" data-tab="win">
                  win
                </li>
              </ul> */}
              <pre className="landing-nohighlight landing-code">
                <code className="landing-tab__pane active mac">
                  $ npm install -g git-remote-dgit
                </code>
                {/* <code className="landing-tab__pane linux">
                </code>
                <code className="landing-tab__pane win">
                </code> */}
              </pre>
            </div>
          </div>
          <div className="landing-feature">
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={serverImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Permanent
              </h3>
              <p className="landing-p justify-content-center">
                All your code is stored on the blockchain forever so anything
                stored with dgit will never be lost, even when you accidently
                force push
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={availabilityImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Available
              </h3>
              <p className="landing-p justify-content-center">
                All your code is mirrored across the distributed network of
                blockchain nodes, so you don't need to rely on a centralized
                server.
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={securityImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Secure
              </h3>
              <p className="landing-p justify-content-center">
                The code can be updated only by the user holding the private
                keys
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={votingImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Governance
              </h3>
              <p className="landing-p justify-content-center">
                Dgit being a Profit Sharing Community, all governance/product
                decisions need a voting on community.xyz
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={osImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Open Source
              </h3>
              <p className="landing-p justify-content-center">
                All of dgit code is open source on dgit and can be audited by
                anyone.
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={pushImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                git CLI
              </h3>
              <p className="landing-p justify-content-center">
                dgit makes use of git-remote-dgit helper which enables
                developers to work with the default git cli they are comfortable
                with.
              </p>
            </div>
          </div>
          <div className="landing-keybinding">
            {/* <ul className="landing-keybinding__detail">
              <h3 className="landing-keybinding__title">Default Keybindings</h3>
              <li>
                Quit without saving{" "}
                <span className="landing-keybinding__label">Ctrl+C</span>
              </li>
              <li>
                Save <span className="landing-keybinding__label">Cmd+S</span>
              </li>
              <li>
                Save and Quit{" "}
                <span className="landing-keybinding__label">Ctrl+D</span>
              </li>
              <li>
                Undo <span className="landing-keybinding__label">Cmd+Z</span>
              </li>
            </ul>
            <ul className="landing-keybinding__detail">
              <h3 className="landing-keybinding__title">
                Markdown Keybindings
              </h3>
              <li>
                <span className="landing-keybinding__label">Ctrl+A</span> Insert
                Link Markdown
              </li>
              <li>
                <span className="landing-keybinding__label">Ctrl+I</span> Insert
                Image Markdown
              </li>
              <li>
                <span className="landing-keybinding__label">Ctrl+V</span> Insert
                YouTube Video
              </li>
              <li>
                <span className="landing-keybinding__label">Ctrl+T</span> Insert
                Table
              </li>
            </ul>*/}
          </div>
          {/* <div className="landing-callout">
            <p className="landing-p justify-content-center">Read our documentation for info</p>
            <a href="doc.html" className="landing-a landing-button--primary">
              Documentation
            </a>
          </div> */}
        </div>
        <div className="landing-changelog">
          <div className="landing-wrapper">
            <h3 className="landing-section__title">Changelog</h3>
            <div className="landing-changelog__item">
              <div className="landing-changelog__meta">
                <h4 className="landing-changelog__title">v0.0.3</h4>
                <small className="landing-changelog__date">8/21/2020</small>
              </div>
              <div className="landing-changelog__detail">
                <ul>
                  <li>
                    Improving the writing workflow with better key bindings
                  </li>
                  <li>Design updates</li>
                  <li>SSL Verification for web hooks</li>
                  <li>Render Emoji</li>
                </ul>
              </div>
            </div>
            <div className="landing-changelog__item">
              <div className="landing-changelog__meta">
                <h4 className="landing-changelog__title">v0.0.2</h4>
                <small className="landing-changelog__date">8/14/2020</small>
              </div>
              <div className="landing-changelog__detail">
                <ul>
                  <li>Adding Unicode support</li>
                  <li>Basic text highlighting</li>
                  <li>Fresh Design</li>
                </ul>
              </div>
            </div>
            <div className="landing-changelog__item">
              <div className="landing-changelog__meta">
                <h4 className="landing-changelog__title">v0.0.1</h4>
                <small className="landing-changelog__date">5/10/2017</small>
              </div>
              <div className="landing-changelog__detail">
                <ul>
                  <li>Save default md file in new folders</li>
                  <li>Ability to quick search on existing notes</li>
                </ul>
              </div>
            </div>
            {/* <div className="landing-changelog__callout">
              <a href="#" className="landing-a landing-button--secondary">
                Checkout Full Log
              </a>
            </div> */}
          </div>
        </div>
        <footer className="landing-footer">
          Made with <span style={{ color: "#e25555" }}>&#9829;</span>
          &nbsp; by{" "}
          <span className="font-bold">
            <a
              href="https://thechtrap.com/"
              target="_blank"
              className="landing-a landing-link link--dark"
            >
              TheTechTrap
            </a>
          </span>
          .
        </footer>
      </div>
    </React.Fragment>
  )
})

export default LandingNew

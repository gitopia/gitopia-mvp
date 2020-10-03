import * as React from "react"
import { HashRouter, Redirect, Route, Switch } from "react-router-dom"
import { connector } from "../../actionCreators/index"
import { Layout } from "./Layout/Layout"
import { lifecycle } from "recompose"
import logo from "../argit/images/logosv.svg"
import dlogo from "../argit/images/dlogo.svg"

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
        "https://raw.githack.com/TheTechTrap/codrops-scribbler/39e6c7b02f711abd82a762ec608bf09c3225a64a/scribbler.js"
      document.getElementsByTagName("head")[0].appendChild(script)
      hscript.onload = () => {
        hljs.initHighlighting()
      }
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
            <div className="landing-menu__item toggle">
              <span />
            </div>
            {/* <li className="landing-menu__item">
              <a
                href="doc.html"
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-book" /> Documentation
              </a>
            </li> */}
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
          <pre className="landing-pre">
            <code className="landing-shell-session demo">dgit ~ $</code>
          </pre>
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
                  $ apt-get install scribbler
                </code>
                <code className="landing-tab__pane win">
                  $ gem install scribbler
                </code> */}
              </pre>
            </div>
          </div>
          <div className="landing-feature">
            <div className="landing-feature__item">
              <h3 className="landing-section__title">
                Permanent home for your code
              </h3>
              <p className="landing-p">
                All your code is stored on the blockchain forever so anything
                stored with dgit will never be lost, even when you accidently
                force push :D
              </p>
            </div>
            <div className="landing-feature__item">
              <h3 className="landing-section__title">
                Always available for you
              </h3>
              <p className="landing-p">
                All your code is mirrored across the distributed network of
                blockchain nodes, so you don't need to rely on a centralized
                server.
              </p>
            </div>
            <div className="landing-feature__item">
              <h3 className="landing-section__title">Secure</h3>
              <p className="landing-p">
                Encrypt your notes optionally. No one can get to your secrets!{" "}
              </p>
            </div>
            <div className="landing-feature__item">
              <h3 className="landing-section__title">Configuration</h3>
              <p className="landing-p">
                Maintain all your settings in a single{" "}
                <span className="landing-code landing-code--inline">
                  config.json
                </span>{" "}
                file. Never need to redo the setting every single time jotting
                down a note.
              </p>
            </div>
            <div className="landing-feature__item">
              <h3 className="landing-section__title">Highlightings</h3>
              <p className="landing-p">
                For better readability, scribbler has a clean, beautiful color
                scheme allow you to scan files fast.
              </p>
            </div>
            <div className="landing-feature__item">
              <h3 className="landing-section__title">Keybindings</h3>
              <p className="landing-p">
                You can expect common keybindings for scribbler. Customize{" "}
                <span className="landing-code code--inline">bindings.json</span>{" "}
                for your own liking!{" "}
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
            <p className="landing-p">Read our documentation for info</p>
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

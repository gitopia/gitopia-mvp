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
    isAuthenticated: state.argit.isAuthenticated,
    address: state.argit.address
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
          <Route path="/:wallet_address" render={(props: any) => <Layout {...props} />} />
          <Redirect from="*" to={`/${props.address}`}/>
        </Switch>
      </HashRouter>
    )


  return (
    <React.Fragment>
      <div className="landing-body">
        <nav className="landing-nav">
        <div
            className="landing-logo"
            onClick={() =>
              props.isAuthenticated
                ? window.location.replace(`/#/${props.address}`)
                : window.location.replace(`/`)
            }
          >
            <img src={dlogo} height="48px" width="48px" />
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


            <li className="landing-menu__item">
              <a href="https://thetechtrap.com/tags/gitopia" className="landing-link landing-link--dark">
              <i className="fa fa-book" /> Blog
              </a>
            </li>
            <li className="landing-menu__item">
              <a href="https://gitopia.org/#/z_TqsbmVJOKzpuQH4YrYXv_Q0DrkwDwc0UqapRrE0Do/Gitopia" className="landing-link landing-link--dark">
              <img src={dlogo} height="30px" width="30px" /> Gitopia
              </a>
            </li>
            <li className="landing-menu__item">
              <a href="https://github.com/Gitopia" className="landing-link landing-link--dark">
                <i className="fa fa-github" /> GitHub
              </a>
            </li>
            <li className="landing-menu__item landing-toggle ">
              <a
                href="#"
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
            <li className="landing-menu__item ">
              <a
                href="#"
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li>
            {/* <li className="landing-menu__item">
              <a
                href="#"
                onClick={() => props.openLoginModal({})}
                className="landing-a landing-link landing-link--dark"
              >
                <i className="fa fa-sign-in" /> Login
              </a>
            </li> */}
          </ul>
        </nav>
        <div className="landing-hero">
          <h1 className="landing-hero__title">
            <img width="200px" height="200px" src={logo} />
          </h1>
          <p className="landing-hero__description">Decentralized 
            <div className="slidingVertical">
              <span>&nbsp;Collaboration</span>
              <span>&nbsp;Communities</span>
              <span>&nbsp;Source Code</span>
            </div>
          </p>
          {/* <p className="landing-hero__description">
            Permanent versioning for your Code
          </p> */}
        </div>
        <div className="landing-hero__terminal">
          <pre className="landing-pre" id="typewriter">
            <span className="dgit-highlight">Gitopia ~ $</span> <span className="dgit-code" >git remote add
          origin gitopia://wallet_address/repo-name{"\n"}</span>


            <span className="dgit-highlight">Gitopia ~ $</span><span className="dgit-code" >git push origin
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
                  $ npm install -g @gitopia/git-remote-gitopia
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
                Persistent
              </h3>
              <p className="landing-p justify-content-center">
                We let your code revisions stay on the blockweave permanently, while you keep on building.
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={availabilityImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Accessible
              </h3>
              <p className="landing-p justify-content-center">
                Never lose access to your code with Gitopia. All your code is mirrored across distributed network of Arweave nodes.
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
                The code can only be updated by the user holding the private
                keys
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={votingImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Community-centric
              </h3>
              <p className="landing-p justify-content-center">
                Gitopia is a Profit Sharing Community. In this model, governance is given to the community and everyone can vote on product decisions.
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
                All of the Gitopia source code is open source and can be audited by
                anyone.
              </p>
            </div>
            <div className="landing-feature__item">
              <div className="landing-feature__images justify-content-center">
                <img src={pushImage} height="100px" width="100px" />
              </div>
              <h3 className="landing-section__title justify-content-center">
                Get, Set, Push
              </h3>
              <p className="landing-p justify-content-center">
                All you need is an Arweave wallet and our git remote helper to start pushing your code to Gitopia. You could also use our GitHub action to mirror your existing repos.
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
          <hr/>
          <div className="landing-callout">
            <h4>Join us on Discord</h4>
            <a href="https://discord.gg/mVpQVW3vKE"  className="landing-a">
            <img src="https://img.shields.io/discord/746365205277179907?color=%235190FF&label=Gitopia&logo=discord&logoColor=white" />
            </a>
       
          </div>
        </div>

        <div className="landing-keybinding">
          <ul className="landing-keybinding__detail">
            <h3 className="landing-keybinding__title">About Us</h3>
            <p>What began as a decentralized solution essential for collaboration and data integrity, is now  becoming increasingly centralized and walled off. Centralized Source Code Management Applications hold the keys to our repositories and in turn have the ability, whether maliciously or inadvertently, to corrupt our code.
            <br/><br/>With Gitopia, we have solved this problem by creating a decentralized Source Code Colloboration Platform. You now have the ability to store your code permanently on the blockchain in a decentralized and transparent manner. 
            </p>
          </ul>
        </div>

        <div className="landing-changelog">
          <div className="landing-wrapper">
            <h3 className="landing-section__title">Changelog</h3>
            <div className="landing-changelog__item">
              <div className="landing-changelog__meta">
                <h4 className="landing-changelog__title">v0.1.0</h4>
                <small className="landing-changelog__date">11/04/2020</small>
              </div>
              <div className="landing-changelog__detail">
                <ul>
                  <li>
                    All new landing page and branding
                  </li>
                  <li>Improved UI/UX of the frontend app</li>
                  <li>Git remote helper</li>
                  <li>Frontend optimizations, lazy loading of git objects</li>
                  <li>Sponsor project owners</li>
                  <li>Unauth views for repositories and public urls</li>
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
              href="https://thetechtrap.com/"
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

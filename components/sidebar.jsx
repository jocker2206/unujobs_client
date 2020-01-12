import React, { Component, Fragment } from "react";
import Navigation from "./navigation";
import { Bearer } from "../services/auth";
import axios from "axios";
import { unujobs } from '../services/urls';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
  }

  async componentDidMount() {
    this.getProfile();
  }

  getProfile =  async () => {
    axios.get(`${unujobs}/profile`, { headers: { Authorization: await Bearer() } })
    .then(res => {
        this.setState({ options: res.data });
    }).catch(err => {
        console.log(err);
    })
}

  render() {
    return (
          <aside className="app-aside app-aside-expand-md app-aside-light">
          <div className="aside-content">
            <header className="aside-header d-block d-md-none">
              <button
                className="btn-account"
                type="button"
                data-toggle="collapse"
                data-target="#dropdown-aside"
              >
                <span className="user-avatar user-avatar-lg">
                  <img src="/static/img/avatars/profile.jpg" alt="" />
                </span>{" "}
                <span className="account-icon">
                  <span className="fa fa-caret-down fa-lg"></span>
                </span>{" "}
                <span className="account-summary">
                  <span className="account-name">Beni Arisandi</span>{" "}
                  <span className="account-description">Marketing Manager</span>
                </span>
              </button>
              <div id="dropdown-aside" className="dropdown-aside collapse">
                <div className="pb-3">
                  <a className="dropdown-item" href="user-profile.html">
                    <span className="dropdown-icon oi oi-person"></span> Profile
                  </a>{" "}
                  <a className="dropdown-item" href="auth-signin-v1.html">
                    <span className="dropdown-icon oi oi-account-logout"></span>{" "}
                    Logout
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Help Center
                  </a>{" "}
                  <a className="dropdown-item" href="#">
                    Ask Forum
                  </a>{" "}
                  <a className="dropdown-item" href="#">
                    Keyboard Shortcuts
                  </a>
                </div>
              </div>
            </header>
            <div className="aside-menu overflow-hidden">
              <nav id="stacked-menu" className="stacked-menu">
                <ul className="menu">
                  <li className="menu-item has-active">
                    <a href="/" className="menu-link">
                      <span className="menu-icon fas fa-user text-success"></span>{" "}
                      <span className="menu-text text-success">Perfil</span>
                    </a>
                  </li>
                  <Navigation options={this.state.options}/>
                </ul>
              </nav>
            </div>
            <footer className="aside-footer border-top p-3">
                
            </footer>
          </div>
        </aside>
    );
  }
}

export default Sidebar;
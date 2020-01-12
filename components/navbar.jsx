import React, { Component, Fragment } from "react";
import SkullAuth from "../components/loaders/skullAuth";
import Logo from "../components/logo";
import axios from 'axios';
import { unujobs } from '../services/urls';
import { Bearer } from '../services/auth';


class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      config: false,
      loading: false,
      auth: { }
    };

    this.responsive = this.responsive.bind(this);
    this.handleConfig = this.handleConfig.bind(this);
  }

  componentDidMount = () => {
    this.getAuth();
  }

  async responsive(e) {
    let body = document.getElementsByTagName("body")[0];
    await this.setState(state => ({ show: !state.show }));
    body.className = this.state.show ? "" : "sidebar-xs";
  }


  handleConfig(e) {
    this.setState(state => ({ config: !state.config }));
  }

  async logout(e) {
    e.preventDefault();
  }

  getAuth = async () => {
    this.setState({ loading: true });
    await axios.get(`${unujobs}/me`, { headers: { Authorization: await Bearer() } })
    .then(res => {
      let { user } = res.data;
      this.setState({ auth: user });
    }).catch(err => {
      console.log(err.message);
    });
    this.setState({ loading: false });
  }

  render() {

    let { loading, auth } = this.state;

    return (
      <Fragment>
        <header className="app-header app-header-dark bg-success">
          <div className="top-bar">
            <div className="top-bar-brand">
              <a href="/">
                <Logo />
              </a>
            </div>
            <div className="top-bar-list">
              <div className="top-bar-item px-2 d-md-none d-lg-none d-xl-none">
                <button
                  className="hamburger hamburger-squeeze"
                  type="button"
                  data-toggle="aside"
                  aria-label="toggle menu"
                >
                  <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                  </span>
                </button>
              </div>
              <div className="top-bar-item top-bar-item-right px-0 d-none d-sm-flex">
                <ul className="header-nav nav">
                  <li className="nav-item dropdown header-nav-dropdown has-notified">
                    <a
                      className="nav-link"
                      href="#"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="oi oi-envelope-open"></span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-rich dropdown-menu-right">
                      <div className="dropdown-arrow"></div>
                      <h6 className="dropdown-header stop-propagation">
                        <span>Messages</span> <a href="#">Mark all as read</a>
                      </h6>
                      <div className="dropdown-scroll perfect-scrollbar">
                        <a href="#" className="dropdown-item unread">
                          <div className="user-avatar">
                            <img src="/static/img/avatars/team1.jpg" alt="" />
                          </div>
                          <div className="dropdown-item-body">
                            <p className="subject"> Stilearning </p>
                            <p className="text text-truncate">
                              {" "}
                              Invitation: Joe's Dinner @ Fri Aug 22{" "}
                            </p>
                            <span className="date">2 hours ago</span>
                          </div>
                        </a>
                        <a href="#" className="dropdown-item">
                          <div className="user-avatar">
                            <img src="/static/img/avatars/team3.png" alt="" />
                          </div>
                          <div className="dropdown-item-body">
                            <p className="subject"> Openlane </p>
                            <p className="text text-truncate">
                              {" "}
                              Final reminder: Upgrade to Pro{" "}
                            </p>
                            <span className="date">23 hours ago</span>
                          </div>
                        </a>
                        <a href="#" className="dropdown-item">
                          <div className="tile tile-circle bg-green"> GZ </div>
                          <div className="dropdown-item-body">
                            <p className="subject"> Gogo Zoom </p>
                            <p className="text text-truncate">
                              {" "}
                              Live healthy with this wireless sensor.{" "}
                            </p>
                            <span className="date">1 day ago</span>
                          </div>
                        </a>
                        <a href="#" className="dropdown-item">
                          <div className="tile tile-circle bg-teal"> GD </div>
                          <div className="dropdown-item-body">
                            <p className="subject"> Gold Dex </p>
                            <p className="text text-truncate">
                              {" "}
                              Invitation: Design Review @ Mon Jul 7{" "}
                            </p>
                            <span className="date">1 day ago</span>
                          </div>
                        </a>
                        <a href="#" className="dropdown-item">
                          <div className="user-avatar">
                            <img src="/static/img/avatars/team2.png" alt="" />
                          </div>
                          <div className="dropdown-item-body">
                            <p className="subject"> Creative Division </p>
                            <p className="text text-truncate">
                              {" "}
                              Need some feedback on this please{" "}
                            </p>
                            <span className="date">2 days ago</span>
                          </div>
                        </a>
                        <a href="#" className="dropdown-item">
                          <div className="tile tile-circle bg-pink"> LD </div>
                          <div className="dropdown-item-body">
                            <p className="subject"> Lab Drill </p>
                            <p className="text text-truncate">
                              {" "}
                              Our UX exercise is ready{" "}
                            </p>
                            <span className="date">6 days ago</span>
                          </div>
                        </a>
                      </div>
                      <a href="page-messages.html" className="dropdown-footer">
                        All messages{" "}
                        <i className="fas fa-fw fa-long-arrow-alt-right"></i>
                      </a>
                    </div>
                  </li>
                </ul>

                      <div className="dropdown d-flex">
                        {loading ? (
                          <SkullAuth />
                        ) : (
                          <button
                            className="btn-account d-none d-md-flex"
                            type="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="user-avatar user-avatar-md">
                              <img
                                src="/static/img/perfil.jpg"
                                alt=""
                              />
                            </span>{" "}
                            <span className="account-summary pr-lg-4 d-none d-lg-block">
                              <span className="account-name" style={{ textTransform: 'capitalize' }}>
                                {auth && auth.nombre_completo}
                              </span>{" "}
                              <span className="account-description">
                                {auth &&
                                  auth.email}
                              </span>
                            </span>
                          </button>
                        )}

                        <div className="dropdown-menu">
                          <div className="dropdown-arrow ml-3"></div>
                          <h6 className="dropdown-header d-none d-md-block d-lg-none">
                            {" "}
                            Beni Arisandi{" "}
                          </h6>
                          <a className="dropdown-item" href="user-profile.html">
                            <span className="dropdown-icon oi oi-person"></span>{" "}
                            Profile
                          </a>{" "}

                                <a
                                  href="#"
                                  className="dropdown-item"
                                  onClick={this.logout.bind(this)}
                                >
                                  <span className="dropdown-icon oi oi-account-logout"></span>{" "}
                                  Cerrar Cuenta
                                </a>

                        </div>
                      </div>

              </div>
            </div>
          </div>
        </header>
      </Fragment>
    );
  }
}

export default Navbar;
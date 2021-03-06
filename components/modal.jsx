import React, { Component } from "react";

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.setState((state, props) => ({
      isShow: props.show ? props.show : false
    }));
  }

  componentWillReceiveProps(Newprops) {
    if (Newprops.show != this.props.show) this.setState({ isShow: Newprops.show });
  }

  close(e) {
    let { isClose } = this.props;
    this.setState({ isShow: false });
    if (typeof isClose == "function") {
      this.props.isClose(false);
    }
  }

  render() {
    let { md, disabled = false, display } = this.props;
    let { isShow } = this.state;

    if (isShow || display) {
      return (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: "0px",
            left: "0px",
            zIndex: "1050",
            display: display ? display : 'flex',
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "0.5em",
          }}
        >
          <div
            className={`col-md-${md ? md : "6"}`}
            style={{ position: "relative" }}
          >
            <div className="card">
              <div className="card-header">
                {this.props.titulo}
                <button
                  className="close"
                  disabled={disabled}
                  onClick={this.close}
                >
                  <i className="fas fa-times fa-xs"></i>
                </button>
              </div>
              <div style={{ overflowY: "auto", maxHeight: "85vh", height: "85vh", position: "relative" }}>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
import React, { Fragment } from 'react'
import App from 'next/app'
import Head from 'next/head'
import Sidebar from '../components/sidebar';
import { getToken } from '../services/auth';
import Navbar from '../components/navbar';
import { Content, Body } from '../components/Utils';

class MyApp extends App {

  constructor(props) {
    super(props);
    this.state = {
      logging: false
    };
  }

  async componentDidMount() {
    let logging = await getToken() ? true : false;
    this.setState({ logging });
  }

  render() {
    const { Component, pageProps } = this.props
    return <Fragment>
      
      
          <Head>
            <meta charSet="utf-8"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
            <title>SRH</title>
            <link rel="shortcut icon" href="/static/favicon.ico"></link>
            <meta name="theme-color" content="#3063A0"></meta>
            <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,600,700,900" rel="stylesheet" type="text/css" />
            <link rel="stylesheet" href="/static/css/open-iconic-bootstrap.min.css" />
            <link rel="stylesheet" href="/static/css/all.css" />
            <link rel="stylesheet" href="/static/css/buttons.bootstrap4.min.css"></link>
            <link rel="stylesheet" href="/static/css/flatpickr.min.css" />
            <link rel="stylesheet" href="/static/css/theme.min.css" data-skin="default" />

            { this.state.logging 
              ? <Fragment>
                  <link rel="stylesheet" href="/static/css/theme-dark.min.css" data-skin="dark" disabled={true} />
                  <link rel="stylesheet" href="/static/css/custom.css" />
                  <link rel="stylesheet" href="/static/css/skull.css" />
                  <script src="/static/js/pace.min.js"></script>
                </Fragment>
              : <Fragment>
                   <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,600,700,900" rel="stylesheet" type="text/css" />
                    <link rel="stylesheet" href="/static/css/export.css"/>
                    <link rel="stylesheet" href="/static/css/draft.css"/>
                    <link rel="stylesheet" href="/static/css/main.css"/>
                    <link rel="stylesheet" href="/static/css/chunk.css"/>
                    <link rel="stylesheet" href="/static/css/chunk-main.css"/>
                </Fragment>
            }

        </Head>


      {
        this.state.logging ?
          <div className="full-layout">
            <div className="gx-app-layout ant-layout ant-layout-has-sider">
              <div className="ant-layout">
                <Navbar/>
                <div className="gx-layout-content   ant-layout-content">
                  <div className="gx-main-content-wrapper">
                  <Sidebar/>
                    <Content>
                      <Body>
                        <Component {...pageProps}/>
                      </Body>
                    </Content>
                  </div>
                </div>
              </div>
            </div>
          </div>
        : <Component {...pageProps}/>
      }
      


    </Fragment>
  }
}

export default MyApp
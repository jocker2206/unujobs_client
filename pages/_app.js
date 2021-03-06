import React, { Fragment } from 'react'
import Head from 'next/head'
import App from 'next/app';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import { Content, Body } from '../components/Utils';
import { AUTH } from '../services/auth';
import { getAuth, authsActionsTypes } from '../storage/actions/authsActions';
import { app } from '../env.json';


// config redux
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import initsStore from '../storage/store';

class MyApp extends App {

  static getInitialProps = async ({ Component, ctx, store }) => {
    let pageProps = {};
    // ejecutar initial de los children
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // obtener auth
    if (await AUTH(ctx)) {
      await ctx.store.dispatch(getAuth(ctx));
    } else {
      await ctx.store.dispatch({ type: authsActionsTypes.LOGOUT });
    }
    // page
    return { pageProps, store, auth_token: await AUTH(ctx) };
  }

  constructor(props) {
    super(props);
  }

  capitalize(word) {
    if (word)  return "- " + word[0].toUpperCase() + word.slice(1);
    return null;
  }

  render() {
    const { Component, pageProps, store, auth_token } = this.props

    let paths = typeof location == 'object' ? location.pathname.split('/') : [];
    let titulo = paths[paths.length == 0 ? 0 : paths.length - 1];

    return  <Fragment>
      <Provider store={store}>
        <Head>
          <meta charSet="utf-8"></meta>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
          <title>{app.name} {this.capitalize(titulo)}</title>
          <link rel="shortcut icon" href="/img/logo-unu.png"></link>
          <meta name="theme-color" content="#3063A0"></meta>
          <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,600,700,900" rel="stylesheet" type="text/css" />
          <link rel="stylesheet" href="/css/open-iconic-bootstrap.min.css" />
          <link rel="stylesheet" href="/css/all.css" />
          <link rel="stylesheet" href="/css/buttons.bootstrap4.min.css"></link>
          <link rel="stylesheet" href="/css/flatpickr.min.css" />
          <link rel="stylesheet" href="/css/theme.min.css" data-skin="default" />
          <link rel="stylesheet" href="/css/theme-dark.min.css" data-skin="dark" disabled={true} />
          <link rel="stylesheet" href="/css/custom.css" />
          <link rel="stylesheet" href="/css/skull.css" />

          <script src="/js/jquery.min.js"></script>
          <script src="/js/popper.min.js"></script>
          <script src="/js/bootstrap.min.js"></script>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css" />


          {auth_token ? <script src="/js/pace.min.js"></script> : ''}

          <script src="/js/stacked-menu.min.js"></script>
          <script src="/js/perfect-scrollbar.min.js"></script>
          <script src="/js/flatpickr.min.js"></script>
          <script src="/js/jquery.easypiechart.min.js"></script>
          <script src="/js/Chart.min.js"></script>
          <script src="/js/theme.min.js"></script>

        </Head>


        {
          auth_token ?
              <div className="full-layout">
                <div className="gx-app-layout ant-layout ant-layout-has-sider">
                  <div className="ant-layout">
                    <Navbar/>
                    <div className="gx-layout-content ant-layout-content">
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
      
      </Provider>

    </Fragment>
  }
}

export default withRedux(initsStore)(MyApp);
import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { GUEST } from '../services/auth';
import { authentication } from '../services/apis';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import initStore from '../storage/store';
import { app } from '../env.json';


class Login extends Component
{

    static getInitialProps = async (ctx) => {
        let { query, pathname } = ctx.req;
        // verificar guest
        await GUEST(ctx)
        // response
        return { query, pathname };
    }

    state = {
        email: "",
        password: "",
        loading: false,
        errors: {},
        progress: 0
    };


    handleInput = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }   


    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        let payload = { 
            email: this.state.email, 
            password: this.state.password
        };
        await authentication.post('login', payload)
        .then(async res => {
            let { success, message, token } = res.data;
            if (success) {
                Cookies.remove('auth_token');
                Cookies.set('auth_token', token);
                history.go('/');
            }else {
                // mensage de error
                Swal.fire({icon: 'error', text: message });
            }
        })
        .catch(err => Swal.fire({icon: 'error', text: err.message}));
        this.setState({ loading: false });
    }


    render() {

        let { errors, email, password, loading } = this.state;

        return (
            <div className="auth">
                <header
                    id="auth-header"
                    className={`auth-header bg-${app.theme}`}
                    style={{ paddingTop: "3em" }}
                >
    
                    <img src={app.logo}
                        alt={app.descripcion}
                        style={{ width: "120px", borderRadius: "0.5em", padding: '0.5em', background: '#fff' }}
                    />
                    
                    <h4>{app.name}</h4>

                    <h1>
                        <span className="sr-only">Iniciar Sesión</span>
                    </h1>
                    <p>
                        {" "}
                    </p>
                </header>

                <form
                    className="auth-form"
                    onSubmit={this.handleSubmit}
                >
                    <div className="form-group">
                        <div className="form-label-group">
                        <input
                            type="text"
                            id="inputUser"
                            className={`form-control`}
                            placeholder="Correo Electrónico"
                            name="email"
                            onChange={this.handleInput}
                            value={email}
                        />{" "}
                            <label htmlFor="inputUser">Correo</label>
                        </div>
                        <b className="text-danger">{errors.email && errors.email[0]}</b>
                    </div>

                    <div className="form-group">
                        <div className="form-label-group">
                        <input
                            type="password"
                            id="inputPassword"
                            className={`form-control`}
                            placeholder="Contraseña"
                            name="password"
                            onChange={this.handleInput}
                            value={password}
                        />{" "}
                            <label htmlFor="inputPassword">Contraseña</label>
                        </div>
                        <b className="text-danger">{errors.password && errors.password[0]}</b>
                    </div>

                    <div className="form-group">
                        <button
                            disabled={loading}
                            className={`btn btn-lg btn-primary btn-block btn-${app.theme}`}
                            type="submit"
                        >
                            {loading ? "Verificando...." : "Iniciar Sesión"}
                            <i className="icon-circle-right2 ml-2"></i>
                        </button>
                    </div>

                    <div className="form-group text-center">
                        <div className="custom-control custom-control-inline custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="remember-me"
                        />
                        </div>
                    </div>

                    <div className="text-center pt-0">
                        <a href="/recovery_password" className="link">
                        Recuperar cuenta
                        </a>
                    </div>
                </form>

                <footer className="auth-footer">
                    {" "}
                    © 2019 Todos Los Derechos Reservados <a href="#">Privacidad</a> y
                    <a href="#">Terminos</a>
                </footer>
            </div>
        )
    }

}


export default connect(initStore)(Login);
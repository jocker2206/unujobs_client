import React, { Component } from 'react';
import { unujobs } from '../services/urls';
import axios from 'axios';
import Swal from 'sweetalert2';
import { login, isGuest } from '../services/auth';

export default class Login extends Component
{

    state = {
        email: "",
        password: "",
        loading: false,
        errors: {},
        page: false,
    };


    componentDidMount = async () => {
        this.setState({ page: await isGuest() });
    }


    handleInput = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }   


    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ loading: true, errors: {} });
        let { email, password } = this.state;
        axios.post(`${unujobs}/login`, { email, password }).then( async res => {
            let { success, message, token } = res.data;
            let icon = success ? 'success' : 'error';
            await Swal.fire({ icon, text: message });
            if (await login(token)) {
                location.href = "/";
            }
        }).catch(err => {
            let { data } = err.response ? err.response : {};
            if (data) {
                this.setState({ errors: data ? data.errors : {} });
            } else {
                Swal.fire({ icon: "error", text: err.message });
            }
        });
        this.setState({ loading: false });
    }


    render() {

        let { page, errors, email, password, loading } = this.state;

        if (page == false) return null;

        return (
            <div className="auth">
                <header
                    id="auth-header"
                    className="auth-header bg-success"
                    style={{ paddingTop: "3em" }}
                >
    
                    <img src="/static/img/logo-unu.png"
                        alt="logo"
                        style={{ width: "150px", borderRadius: "0.5em" }}
                    />
                    
                    <h4>UNU - SRH</h4>

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
                        <b class="text-danger">{errors.email && errors.email[0]}</b>
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
                        <b class="text-danger">{errors.password && errors.password[0]}</b>
                    </div>

                    <div className="form-group">
                        <button
                            disabled={loading}
                            className={`btn btn-lg btn-success btn-block`}
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
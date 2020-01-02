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
            <div className="gx-app-login-wrap">
                <div className="gx-app-login-container" style={{ marginTop: "5em" }}>
                    <div className="gx-app-login-main-content">
                        <div className="gx-app-logo-content">
                            <div className="gx-app-logo-content-bg">
                                <img src="/static/img/cover.jpg" alt="Cover" style={{ objectFit: "cover" }}/>
                            </div>

                            <div className="gx-app-logo-wid">
                                <h1><span>Iniciar Sesión</span></h1>
                                <p><span>Sistema de Gestión de Planilla</span></p>
                                <p><span>Entrar!!!</span></p>
                            </div>

                            <div className="gx-app-logo">
                                <img alt="example" src="/static/img/logo-unu.png" style={{ width: "75px", borderRadius: "0.4em" }}/>
                            </div>
                        </div>
                        
                        <div className="gx-app-login-content">
                            <form className="ant-form ant-form-horizontal gx-signin-form gx-form-row0" onSubmit={this.handleSubmit}>
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-control-wrapper">
                                        <div className={`ant-form-item-control has-${errors.email &&  errors.email[0] ? 'error' : 'success'}`}>
                                            <span className="ant-form-item-children">
                                                <input placeholder="Correo Electrónico" 
                                                    name="email" 
                                                    type="text" 
                                                    className="ant-input has-error"
                                                    value={email}
                                                    onChange={this.handleInput}
                                                    disabled={loading}
                                                />
                                                <small className="ant-form-explain">{errors.email && errors.email[0]}</small>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-control-wrapper">
                                        <div className={`ant-form-item-control has-${errors.password &&  errors.password[0] ? 'error' : 'success'}`}>
                                            <span className="ant-form-item-children">
                                                <input type="password" 
                                                    placeholder="Contraseña" 
                                                    name="password"
                                                    className="ant-input" 
                                                    value={password}
                                                    onChange={this.handleInput}
                                                    disabled={loading}
                                                />
                                                <small className="ant-form-explain">{errors.password && errors.password[0]}</small>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-control-wrapper">
                                        <div className="ant-form-item-control has-success">
                                            
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col ant-form-item-control-wrapper">
                                        <div className="ant-form-item-control">
                                            <span className="ant-form-item-children">
                                                <button type="submit" 
                                                    className="ant-btn gx-mb-0 ant-btn-primary"
                                                    disabled={loading || !email || !password}
                                                >
                                                    <span>{loading ? 'Cargando...' : 'Entrar'}</span>
                                                </button>
                                                <span>
                                                    <span>o </span>
                                                </span> 
                                                <a href="/signup"><span>Recuperar Cuenta</span></a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="gx-flex-row gx-justify-content-between">
                                    <span></span>
                                    <ul className="gx-social-link">
                                        <br/><br/>
                                    </ul>
                                </div>
                                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
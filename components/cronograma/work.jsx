import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { unujobs } from '../../services/urls';
import { BtnEditar } from '../../components/Utils';

export default class Work extends Component {

    state = {
        history: {},
        work: {},
    };


    componentDidMount() {
        this.setting(this.props);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.historial != this.props.historial) {
            this.setting(nextProps);
        }
    }

    setting = async (nextProps) => {
        await this.setState({ 
            history: nextProps.historial ? nextProps.historial : {}, 
            work: nextProps.historial.work ? nextProps.historial.work : {} 
        });
    }


    handleInput = async (e) => {
        let { name, value } = e.target;
        let newWork = await Object.assign({}, this.state.work);
        newWork[name] = value;
        this.setState({ work: newWork });
    }


    render() {

        let { work } = this.state;
        let { bancos } = this.props;

        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <b>Apellido Paterno</b>
                            <input type="text" 
                                className="form-control" 
                                name="ape_paterno"
                                value={work.ape_paterno}
                                onChange={this.handleInput}
                                disabled={true}
                            />
                        </div>

                        <div className="form-group">
                            <b>Fecha de Nacimiento</b>
                            <input type="date" 
                                className="form-control" 
                                name="ape_paterno"
                                value={work.fecha_de_nacimiento}
                                onChange={this.handleInput}
                                disabled={true}
                            />
                        </div>

                        <div className="form-group">
                            <b>N° Teléfono</b>
                            <input type="text" 
                                className="form-control" 
                                name="phone"
                                value={work.phone ? work.phone : ""}
                                disabled={!this.props.edit}
                                onChange={this.handleInput}
                            />
                        </div>

                        <div className="form-group">
                            <b>¿Sincronizar datos con RENIEC?</b>
                            <button 
                                className="btn btn-success btn-block"
                                disabled={!this.props.edit}
                            >
                                <i className="fas fa-sync"></i> Sincronizar datos con RENIEC
                            </button>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <b>Apellido Materno</b>
                            <input type="text" 
                                className="form-control" 
                                name="ape_materno"
                                value={work.ape_materno}
                                onChange={this.handleInput}
                                disabled={true}
                            />
                        </div>

                        <div className="form-group">
                            <b>Sexo</b>
                            <select name="sexo" 
                                value={work.sexo} 
                                className="form-control"
                                onChange={this.handleInput}
                                disabled={true}
                            >
                                <option value="">Select. Sexo</option>
                                <option value="1">Masculino</option>
                                <option value="0">Femenino</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <b>Correo Electrónico</b>
                            <input type="text" 
                                className="form-control" 
                                name="email"
                                value={work.email}
                                disabled={!this.props.edit}
                                onChange={this.handleInput}
                            />
                        </div>              
                    </div>

                    <div className="col-md-3">
                        <div className="form-group">
                            <b>Nombres</b>
                            <input type="text" 
                                className="form-control" 
                                name="nombres"
                                value={work.nombres}
                                disabled={true}
                            />
                        </div>

                        <div className="form-group">
                            <b>Dirección</b>
                            <input type="text" 
                                className="form-control" 
                                name="direccion"
                                value={work.direccion}
                                disabled={!this.props.edit}
                                onChange={this.handleInput}
                            />
                        </div>

                        <div className="form-group">
                            <b>Banco</b>
                            <select name="banco_id" 
                                value={work.banco_id} 
                                className="form-control"
                                disabled={!this.props.edit}
                                onChange={this.handleInput}
                            >
                                <option value="">Select. Banco</option>
                                {bancos.map(obj => 
                                    <option key={`afp-item-${obj.id}`} 
                                        value={obj.id}
                                    >
                                        {obj.nombre}
                                    </option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="form-group">
                            <b>N° Documento</b>
                            <input type="text" 
                                className="form-control" 
                                name="numero_de_documento"
                                disabled={true}
                                value={work.numero_de_documento}
                            />
                        </div>

                        <div className="form-group">
                            <b>Profesión</b>
                            <input type="text" 
                                className="form-control" 
                                name="profesion"
                                value={work.profesion}
                                disabled={!this.props.edit}
                                onChange={this.handleInput}
                            />
                        </div>

                        <div className="form-group">
                            <b>N° de Cuenta</b>
                            <input type="text" 
                                className="form-control"
                                name="numero_de_cuenta"
                                value={work.numero_de_cuenta}
                                disabled={!this.props.edit}
                                onChange={this.handleInput}
                            />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

}
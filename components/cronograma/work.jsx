import React, { Component, Fragment } from 'react';
import { authentication } from '../../services/apis';
import { Form, Button, Select } from 'semantic-ui-react';
import { parseOptions } from '../../services/utils';
import Show from '../show';


export default class Work extends Component {

    state = {
        history: {},
        work: {},
    };


    componentDidMount() {
        this.setting(this.props);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.edit != this.props.edit || nextProps.historial != this.props.historial) {
            this.setting(nextProps);
        }   
        // update send
        if (nextProps.send == true && nextProps.send != this.props.send) {
            this.updateWork();
        }
    }

    setting = async (nextProps) => {
        await this.setState({ 
            history: nextProps.historial ? nextProps.historial : {}, 
            work: nextProps.historial.work ? nextProps.historial.work : {} 
        });
    }


    handleInput = (e) => {
        let { name, value } = e.target;
        let newWork = Object.assign({}, this.state.work);
        newWork[name] = value;
        this.setState({ work: newWork });
    }

    handleSelect = async (e, { name, value }) => {
        let newWork = await Object.assign({}, this.state.work);
        newWork[name] = value;
        this.setState({ work: newWork });
    }

    fireSent = () => {
        if (typeof this.props.fireSent == 'function') this.props.fireSent();
    }

    updateWork = () => {
        alert('updating work...');
    }

    render() {

        let { work } = this.state;
        let { bancos } = this.props;

        return (
            <Fragment>
                <Show condicion={this.props.total}>
                    <div className="row">
                        <div className="col-md-3">
                            <Form.Field>
                                <b>Apellido Paterno</b>
                                <input type="text" 
                                    name="ape_paterno"
                                    value={work.ape_paterno}
                                    onChange={this.handleInput}
                                    readOnly
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Fecha de Nacimiento</b>
                                <input type="date" 
                                    name="ape_paterno"
                                    value={work.fecha_de_nacimiento}
                                    onChange={this.handleInput}
                                    readOnly
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>N° Teléfono</b>
                                <input type="text"  
                                    name="phone"
                                    value={work.phone ? work.phone : ""}
                                    disabled={!this.props.edit}
                                    onChange={this.handleInput}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Sincronización de datos con RENIEC</b>
                                <Button 
                                    basic
                                    fluid
                                    color="olive"
                                    disabled={!this.props.edit}
                                >
                                    <i className="fas fa-sync"></i> Sincronizar datos con RENIEC
                                </Button>
                            </Form.Field>
                        </div>
                        <div className="col-md-3">
                            <Form.Field>
                                <b>Apellido Materno</b>
                                <input type="text" 
                                    name="ape_materno"
                                    value={work.ape_materno}
                                    onChange={this.handleInput}
                                    readOnly
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Género</b>
                                <Select placeholder="Select. Género"
                                    options={[
                                        {key: "t", value: "", text: "Select. Género"},
                                        {key: "m", value: 1, text: "Masculino"},
                                        {key: "f", value: 0, text: "Femenino"}
                                    ]}
                                    name="sexo"
                                    value={work.sexo}
                                    onChange={this.handleSelect}
                                    disabled={!this.props.edit}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Correo Electrónico</b>
                                <input type="text" 
                                    name="email"
                                    value={work.email ? work.email : ''}
                                    disabled={!this.props.edit}
                                    onChange={this.handleInput}
                                />
                            </Form.Field>             
                        </div>

                        <div className="col-md-3">
                            <Form.Field>
                                <b>Nombres</b>
                                <input type="text" 
                                    name="nombres"
                                    value={work.nombres}
                                    readOnly
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Dirección</b>
                                <input type="text" 
                                    name="direccion"
                                    value={work.direccion ? work.direccion : ''}
                                    disabled={!this.props.edit}
                                    onChange={this.handleInput}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Banco</b>
                                <Select placeholder='Select. Banco' 
                                    options={parseOptions(bancos, ['sel-afp', '', 'Select. Banco'], ['id', 'id', 'nombre'])} 
                                    disabled={!this.props.edit}
                                    value={work.banco_id ? work.banco_id : ''}
                                    name="banco_id"
                                    onChange={this.handleSelect}
                                    disabled={!this.props.edit}
                                    onChange={this.handleSelect}
                                />
                            </Form.Field>
                        </div>

                        <div className="col-md-3">
                            <Form.Field>
                                <b>N° Documento</b>
                                <input type="text" 
                                    name="numero_de_documento"
                                    readOnly
                                    value={work.numero_de_documento}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Profesión</b>
                                <input type="text"
                                    name="profesion"
                                    value={work.profesion ? work.profesion : ''}
                                    disabled={!this.props.edit}
                                    onChange={this.handleInput}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>N° de Cuenta</b>
                                <input type="text" 
                                    name="numero_de_cuenta"
                                    value={work.numero_de_cuenta ? work.numero_de_cuenta : ''}
                                    disabled={!this.props.edit}
                                    onChange={this.handleInput}
                                />
                            </Form.Field>
                        </div>
                    </div>
                </Show>
            </Fragment>
        );
    }

}
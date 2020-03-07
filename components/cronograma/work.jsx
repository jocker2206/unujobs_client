import React, { Component, Fragment } from 'react';
import { authentication } from '../../services/apis';
import { Form, Button, Select, Message } from 'semantic-ui-react';
import { parseOptions } from '../../services/utils';
import Show from '../show';
import Swal from 'sweetalert2';


export default class Work extends Component {

    state = {
        history: {},
        work: {},
        error: ""
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

    updateWork = async () => {
        this.setState({ error: "" });
        let form = Object.assign({}, this.state.work);
        form._method = 'PUT';
        await authentication.post(`work/${this.state.work.id}`, form)
        .then(async res => {
            let { success, message } = res.data;
            let newHistorial = Object.assign({}, this.state.history);
            newHistorial.work = this.state.work;
            let icon = success ? 'success' : 'error';
            await Swal.fire({ icon, text: message });
            success ? await this.props.updatedHistorial(newHistorial) : null;
        })
        .catch(({ response }) => this.setState({ error: response.data.message }));
        this.props.fireSent();
    }

    render() {

        let { work, error } = this.state;

        return (
            <Fragment>

                <Show condicion={error}>
                    <Message color="red">
                        Error: { error }
                    </Message>
                </Show>

                <Show condicion={this.props.total}>
                    <div className="row">
                        <div className="col-md-3">
                            <Form.Field>
                                <b>Apellido Paterno</b>
                                <input type="text" 
                                    name="ape_paterno"
                                    defaultValue={work.ape_paterno}
                                    disabled={true}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Fecha de Nacimiento</b>
                                <input type="date" 
                                    name="ape_paterno"
                                    defaultValue={work.fecha_de_nacimiento}
                                    disabled={true}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Ubigeo</b>
                                <select name="ubigeo_id"
                                    disabled={!this.props.edit}
                                    value={work.ubigeo_id}
                                    onChange={this.handleInput}
                                >
                                    <option value="">Select. Ubigeo</option>
                                    {this.props.ubigeos.map(obj => 
                                        <option value={obj.id} key={`ubigeo-${obj.id}`}>
                                            {obj.departamento} | {obj.provincia} | {obj.distrito}
                                        </option>    
                                    )}
                                </select>
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
                                    defaultValue={work.ape_materno}
                                    disabled={true}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Género</b>
                                <Select placeholder="Select. Género"
                                    options={[
                                        {key: "t", value: "", text: "Select. Género"},
                                        {key: "m", value: "M", text: "Masculino"},
                                        {key: "f", value: "F", text: "Femenino"},
                                        {key: "i", value: "I", text: "No Binario"}
                                    ]}
                                    name="genero"
                                    value={work.genero}
                                    onChange={this.handleSelect}
                                    disabled={!this.props.edit}
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
                        </div>

                        <div className="col-md-3">
                            <Form.Field>
                                <b>Nombres</b>
                                <input type="text" 
                                    name="nombres"
                                    defaultValue={work.nombres}
                                    disabled={true}
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
                                <b>N° Documento</b>
                                <input type="text" 
                                    name="numero_de_documento"
                                    defaultValue={work.numero_de_documento}
                                    disabled={true}
                                />
                            </Form.Field>

                            <Form.Field>
                                <b>Profesión Abrev.</b>
                                <input type="text"
                                    name="profesion"
                                    value={work.profesion ? work.profesion : ''}
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
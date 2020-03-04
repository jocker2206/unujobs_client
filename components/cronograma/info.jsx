import React, { Component, Fragment } from 'react';
import Modal from '../modal';
import { Card, Row } from 'react-bootstrap';
import { authentication } from '../../services/apis';
import atob from 'atob';
import Swal from 'sweetalert2';
import { CSVLink } from "react-csv";
import { parseOptions } from '../../services/utils';
import Show from '../../components/show';
import TabCronograma from './TabCronograma';
import { Form, Button, Input, Select, Icon, Message } from 'semantic-ui-react';


export default class Info extends Component {

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            like: "",
            page: 1,
            cronograma_id: '',
            last_page: 1,
            edit: false,
            loading: false,
            cronograma: {
                year: 2019,
                mes: 9,
                adicional: 0,
                planilla_id: "",
            },
            historial: {},
            cargo_id: "",
            type_categoria_id: "",
            afp_id: "",
            planillas: [],
            afps: [],
            cargos: [],
            type_categorias: [],
            bancos: [],
            send: false,
            exports: {
                click: 0,
                loading: false,
                headers: [],
                content: []
            },
            block: false
        };

        this.close = this.close.bind(this);
    }

    async componentDidMount() {
        let { query } = this.props;
        let id = query.info ? await atob(query.info) : "";
        await this.setState({ cronograma_id: id });
        if (this.props.show && !Object.keys(this.state.historial).length) {
            this.getCronograma(this.props, this.state);
        }
        // obtener configuración basica
        this.getBancos();
        this.getPlanillas();
        this.getAFPs();
    }

    componentWillUpdate = (nextProps, nextState) => {
        if (nextState.cronograma.planilla_id != this.state.cronograma.planilla_id) this.getCargos(nextState);
        if (nextState.cargo_id != "" && nextState.cargo_id != this.state.cargo_id) this.gettype_categorias(nextState);
        if (nextState.cargo_id == "" && nextState.cargo_id != this.state.cargo_id) this.setState({ type_categoria_id: "", type_categorias: [] });
        if (nextProps.show != this.props.show && nextProps.show && !Object.keys(nextState.historial).length) this.getCronograma(nextProps, nextState);
    }

    getPlanillas = async () => {
        this.setState({ loading: true });
        await authentication.get(`planilla`)
        .then(res => {
            let planillas = res.data ? res.data : []
            this.setState({ planillas });
        }).catch(err => console.log(err.message));
        this.setState({ loading: false });
    }

    getAFPs = () => {
        authentication.get(`cronograma/${this.state.cronograma_id}/afp`)
        .then(res => this.setState({ afps: res.data }))
        .catch(err => console.log(err.message));
    }

    getBancos = () => {
        authentication.get(`banco`)
        .then(res => this.setState({ bancos: res.data }))
        .catch(err => console.log(err.message));
    }

    handleInput = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSelect = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    readCronograma = async (e) => {
        if (!this.state.edit) {
            await this.setState({ page: 1 });
            this.getCronograma(this.props, this.state);
        } else {
            this.getAlert();
        }
    }

    getExport = async () => {
        let newExport = Object.assign({}, this.state.exports);
        newExport.click = 1;
        newExport.loading = true;
        await this.setState({ exports: newExport });
        await this.readCronograma();
    }

    clearSearch = async () => {
        await this.setState({ 
            afp_id: "",
            cargo_id: "",
            like: "",
            page: 1
        });
        // filtrar
        await this.readCronograma();
    }

    getAlert = () => {
        Swal.fire({ icon: "warning", text: "La edición está activa!. Actualize o Cancele la edición" });
    }

    getCronograma = async (props, state) => {
        this.setState({ loading: true });
        try {
            let { query } = props;
            let { page, cargo_id, type_categoria_id, afp_id, like, exports } = state;
            let id = query.info ? atob(query.info) : "";
            let params = `page=${page}&cargo_id=${cargo_id}&type_categoria_id=${type_categoria_id}&afp_id=${afp_id}&like=${like}&export=${exports.click}`;
            await authentication.get(`cronograma/${id}?${params}`)
            .then(async res => {
                if (exports.click) {
                    let { headers, content } = res.data;
                    let newExport = Object.assign({}, exports);
                    newExport.headers = headers;
                    newExport.content = content;
                    this.setState({ exports: newExport, block: true });
                } else {
                    let { cronograma, historial } = res.data;
                    let tmp_historial = {};
                    let tmp_cronograma = cronograma;
                    tmp_cronograma.year = cronograma.año;
                    await historial.data.filter(obj => tmp_historial = obj);
                    // setting
                    this.setState({ 
                        cronograma: tmp_cronograma, 
                        historial: tmp_historial, 
                        total: historial.total, 
                        last_page: historial.last_page 
                    });
                }
            }).catch(err => console.log(err));
        } catch(ex) {
            console.log(ex);
        }

        let newExport = Object.assign({}, this.state.exports);
        newExport.loading = false;
        this.setState({ loading: false, exports: newExport });
    }

    sendEmail = async () => {
        let  { historial } = this.state;
        this.setState({ block: true });
        await authentication.post(`historial/${historial.id}/send_boleta`)
        .then(async res => {
            let { success, message } = res.data;
            let icon = success ? 'success' : 'error';
            await Swal.fire({ icon, text: message });
        }).catch(err => {
            Swal.fire({ icon: 'error', text: "Algo salió mal, vuelva más tarde!" });
        });
        this.setState({ block: false });
    }

    getCargos = (state) => {
        let { cronograma } = state;
        authentication.get(`cronograma/${cronograma.id}/cargo`)
        .then(async res => {
            this.setState({ cargos: res.data });
        }).catch(err =>  console.log(err.message));
    }

    gettype_categorias = (state) => {
        let { cargo_id } = state;
        authentication.get(`cargo/${cargo_id}`)
        .then(async res => {
            let { type_categorias } = res.data;
            this.setState({ type_categorias: type_categorias ? type_categorias : [] });
        }).catch(err =>  console.log(err.message));
    }

    next = async (e) => {
        let { page, last_page, edit } = this.state;
        if (!edit) {
            if (page < last_page) {
                await this.setState(state => ({ page: state.page + 1 }));
                await this.getCronograma(this.props, this.state);
            }else {
                Swal.fire({ icon: "warning", text: "No hay más registros" });
            }
        } else {
            this.getAlert();
        }
    }

    previus = async (e) => {
        let { page, edit } = this.state;
        if (!edit) {
            if (page > 1) {
                await this.setState(state => ({ page: state.page - 1 }));
                this.getCronograma(this.props, this.state);
            }else {
                Swal.fire({ icon: "warning", text: "No hay más registros" });
            }
        } else {
            this.getAlert();
        }
    }

    close(e) {
        if (typeof this.props.close == 'function') this.props.close(e);
        this.setState({ 
            cargo_id: "", 
            type_categoria_id: "", 
            page: 1, 
            afp_id: "",
            like: "",
            historial: {},
            exports: {
                click: 0,
                loading: false,
                headres: [],
                content: [],
            }
        });  
    }

    sentEnd = async () => {
        await this.setState({ loading: false, send: false });
    }

    updatingHistorial = async (newHistorial) => {
        await this.setState({ historial: newHistorial, edit: false });
    }

    handleConfirm = async (e) => {
        let { value } = await Swal.fire({ 
            icon: 'warning',
            text: "¿Deseas guardar los cambios?",
            confirmButtonText: "Continuar",
            showCancelButton: true
        });
        if (value) this.setState({ loading: true, send: true });
    }

    render() {

        let { show } = this.props;
        let { 
            cronograma, exports, 
            historial, planillas, 
            afps, cargos, 
            type_categorias, loading, 
            cargo_id, type_categoria_id, 
            afp_id 
        } = this.state;

        

        let filname = `${historial.planilla && historial.planilla.descripcion}_${cronograma.mes}_${cronograma.year}${cronograma.adicional ? `_adicional_${cronograma.numero}` : ''}`;

        return (
            <Modal show={show}
                isClose={this.close}
                disabled={this.state.edit || this.state.block}
                md="11"
                titulo={`INFORMACIÓN DE "${historial && historial.work ? historial.work.nombre_completo : 'NO HAY TRABAJADOR DISPONIBLE'}"`}
            >
                    <Card.Body style={{ height: "85%", overflowY: "auto" }}>
                        <Form>
                            <Row>
                                <div className="col-md-3">
                                    <Form.Field> 
                                        <input type="search" 
                                            className={`${this.state.like ? 'border-dark text-dark' : ''}`}
                                            disabled={loading || this.state.edit || this.state.block}
                                            value={this.state.like}
                                            onChange={this.handleInput}
                                            name="like"
                                            placeholder="Buscar por Nombre Completo o N° de documento"
                                        />  
                                    </Form.Field>
                                </div>

                                <div className="col-md-2 mb-1">
                                    <Select placeholder='Select. Cargo' 
                                        options={parseOptions(cargos, ['sel-car', '', 'Select. Cargo'], ['id', 'id', 'descripcion'])} 
                                        disabled={loading || this.state.edit || this.state.block}
                                        value={cargo_id}
                                        name="cargo_id"
                                        onChange={this.handleSelect}
                                        wrapSelection={false}
                                    />
                                </div>
                                
                                <div className="col-md-2 mb-1">
                                    <Select placeholder='Select. Categoría' 
                                        options={parseOptions(type_categorias, ['sel-cat', '', 'Select. Categoría'], ['id', 'id', 'descripcion'])}
                                        disabled={loading || this.state.edit || this.state.block}
                                        value={type_categoria_id}
                                        name="type_categoria_id"
                                        onChange={this.handleSelect}
                                    />
                                </div>
                                
                                <div className="col-md-2 mb-1">
                                    <Select placeholder='Select. AFP' 
                                        options={parseOptions(afps, ['sel-afp', '', 'Select. AFP'], ['id', 'id', 'nombre'])} 
                                        disabled={loading || this.state.edit || this.state.block}
                                        value={afp_id}
                                        name="afp_id"
                                        onChange={this.handleSelect}
                                    />
                                </div>
                                
                                <div className="col-md-2 mb-1">
                                    <Show condicion={exports.click}>
                                        <Button color="red"
                                            disabled={exports.loading}
                                            fluid
                                            onClick={(e) => {
                                                let newExport = Object.assign({}, exports);
                                                newExport.click = 0;
                                                this.setState({ exports: newExport, block: false });
                                            }}
                                        >
                                            <Icon name="delete"/> Limpiar
                                        </Button>
                                    </Show>
                                    <Show condicion={!exports.click}>
                                        <Button color="black"
                                            fluid
                                            onClick={this.readCronograma}
                                            title="Realizar Búsqueda"
                                            disabled={loading || this.state.edit || this.state.block}
                                        >
                                            <Icon name="filter"/> Filtrar
                                        </Button>
                                    </Show>
                                </div>

                                <Show condicion={this.state.total && !this.state.block}>
                                    <div className="col-md-1 mb-1">
                                        <Show condicion={exports.click}>
                                            <Show condicion={exports.loading}>
                                                <Button color="green"
                                                    basic
                                                    loading={exports.loading}
                                                    disabled={exports.loading}
                                                    fluid
                                                >
                                                    <i className="fas fa-upload"></i>
                                                </Button>
                                            </Show>
                                        </Show>
                                        <Show condicion={!exports.click}>
                                            <Button color="green"
                                                basic
                                                onClick={this.getExport}
                                                title="Realizar exportación en CSV del Resultado."
                                                disabled={loading || this.state.edit}
                                                fluid
                                            >
                                                <i className="fas fa-file-excel"></i>
                                            </Button>
                                        </Show>
                                    </div>
                                </Show>

                                <Show condicion={this.state.total && this.state.block && !exports.loading}>
                                    <div className="col-md-1">
                                        <CSVLink data={exports.content} 
                                            headers={exports.headers} 
                                            target="__blank"
                                            className="ui green button fluid"
                                            filename={`${filname}.xlsx`}
                                        >
                                            <i className="fas fa-download"></i>
                                        </CSVLink>
                                    </div>
                                </Show>
                                
                                <Show condicion={this.state.total}>
                                    <TabCronograma
                                        historial={historial}
                                        bancos={this.state.bancos}
                                        edit={this.state.edit}
                                        loading={this.state.loading}
                                        send={this.state.send}
                                        total={this.state.total}
                                        sentEnd={this.sentEnd}
                                        updatingHistorial={this.updatingHistorial}
                                        menu={{ secondary: true, pointing: true }}
                                    />  
                                </Show>          
                                
                                <Show condicion={!this.state.total}>
                                    <div className="w-100 text-center">
                                        <h4 className="mt-5">No se encotró trabajadores</h4>
                                    </div>
                                </Show>                    
                            </Row>
                        </Form>
                    </Card.Body>
                    <Card.Footer style={{ position: "absolute", background: "#fff", bottom: "0px", width: "100%", left: "0px" }}>
                        <Card.Body>
                            <Form>
                                <Row className="justify-content-between"> 
                                    <div className="col md-8">
                                        <div className="row">
                                            <div className="col-md-2 mb-1">
                                                <Form.Field>
                                                    <input type="number"  
                                                        placeholder="Año"
                                                        defaultValue={cronograma.year}
                                                        disabled={true}
                                                    />
                                                </Form.Field>
                                            </div>

                                            <div className="col-md-2 mb-1">
                                                <Form.Field>
                                                    <input type="number" 
                                                        placeholder="Mes"
                                                        defaultValue={cronograma.mes}
                                                        disabled={true}
                                                    />
                                                </Form.Field>
                                            </div>

                                            <div className="col-md-3 mb-1">
                                                <Select placeholder='Select. Planilla' 
                                                    options={parseOptions(planillas, ['sel-afp', '', 'Select. Planilla'], ['id', 'id', 'nombre'])} 
                                                    value={cronograma.planilla_id}
                                                    disabled={true}
                                                />
                                            </div>

                                            <Show condicion={cronograma.adicional}>
                                                <div className="col-md-2 mb-1">
                                                    <Form.Field>
                                                        <input type="text" 
                                                            value={`Adicional ${cronograma.adicional}`}
                                                            readOnly
                                                        />
                                                    </Form.Field>
                                                </div>
                                            </Show>

                                            <div className="col-md-2 mb-1">
                                                <Show condicion={this.state.total}>
                                                    <Button color="black"
                                                        fluid
                                                    >
                                                        {this.state.page} de {this.state.total}
                                                    </Button>
                                                </Show>
                                                <Show condicion={!this.state.total}>
                                                    <Button color="red"
                                                        disabled={loading}
                                                        onClick={this.clearSearch}
                                                        fluid
                                                    >
                                                        <i className="fas fa-trash"></i> Limpiar
                                                    </Button>
                                                </Show>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4 text-right">
                                        <Show condicion={this.state.total && cronograma.estado}>
                                            <Button color={this.state.edit ? 'red' : 'teal'}
                                                disabled={loading || this.state.block || this.state.send}
                                                onClick={(e) => this.setState(state => ({ edit: !state.edit }))}
                                            >
                                                <Icon name={this.state.edit ? 'cancel' : 'pencil'}/> { this.state.edit ? 'Cancelar' : 'Editar' }
                                            </Button>
                                        </Show>

                                        <Show condicion={this.state.total && !cronograma.estado}>
                                            <Button
                                                color="orange"
                                                disabled={loading || this.state.block}
                                                onClick={this.sendEmail}
                                            >
                                                <Icon name="send"/> { this.state.send ? 'Enviando...' : 'Enviar Email' }
                                            </Button>
                                        </Show>

                                        <Show condicion={!this.state.edit && this.state.total}>
                                            <Button
                                                color="black"
                                                disabled={loading || this.state.edit || this.state.block}
                                                onClick={this.readCronograma}
                                            >
                                                Pág N° 1
                                            </Button>   
                                        </Show>

                                        <Show condicion={!this.state.edit && this.state.total}>
                                            <Button  
                                                color="black"
                                                disabled={loading || this.state.edit || this.state.block}
                                                onClick={this.previus}
                                            >
                                                <Icon name="triangle left"/>
                                            </Button>
                                        </Show>

                                        <Show condicion={!this.state.edit && this.state.total}>
                                            <Button 
                                                color="black"
                                                disabled={loading || this.state.edit || this.state.block}
                                                onClick={this.next}
                                            >
                                                <Icon name="triangle right"/>
                                            </Button>
                                        </Show>

                                        <Show condicion={this.state.edit}>
                                            <Button
                                                color="blue"
                                                loading={this.state.send}
                                                disabled={loading || !this.state.edit || this.state.block}
                                                onClick={this.handleConfirm}
                                            >
                                                <Icon name="save"/> Guardar
                                            </Button>
                                        </Show>
                                    </div>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card.Footer>
            </Modal>    
        )
        
    }

}
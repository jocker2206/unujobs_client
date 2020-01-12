import React, { Component, Fragment } from 'react';
import Modal from '../modal';
import { Card, Row, Button } from 'react-bootstrap';
import { unujobs } from '../../services/urls';
import axios from 'axios';
import atob from 'atob';
import { Tab } from '../Utils';
import Swal from 'sweetalert2';
import Spinner from '../../components/spinner';
import { CSVLink } from "react-csv";
import Work from './work';
import Afectacion from './afectacion';
import Remuneracion from './Remuneracion';
import Descuento from './Descuento';

export default class Info extends Component {

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            like: "",
            page: 1,
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
            categoria_id: "",
            afp_id: "",
            planillas: [],
            afps: [],
            cargos: [],
            categorias: [],
            bancos: [],
            current: "general",
            send: false,
            navs: [
                { id: 1, name: "Datos Generales", key: "general", active: true },
                { id: 2, name: "Afectación Presupuestal", key: "afectacion",  active: false },
                { id: 3, name: "Remuneraciones", key: "remuneracion", active: false },
                { id: 4, name: "Descuentos", key: "descuento", active: false },
                { id: 5, name: "Aportación Empleador", key: "aportacion", active: false },
                { id: 6, name: "Obligaciones Judiciales", key: "obligacion", active: false },
                { id: 7, name: "Tasa Educacional", key: "educacional", active: false }
            ],
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

    componentDidMount() {
        this.getBancos();
        this.getPlanillas();
        this.getAFPs();
        if (this.props.show && !Object.keys(this.state.historial).length) {
            this.getCronograma(this.props, this.state);
            console.log('ok');
        }
    }


    componentWillUpdate = (nextProps, nextState) => {
        if (nextState.cronograma.planilla_id != this.state.cronograma.planilla_id ) this.getCargos(nextState);
        if (nextState.cargo_id != "" && nextState.cargo_id != this.state.cargo_id) this.getCategorias(nextState);
        if (nextState.cargo_id == "" && nextState.cargo_id != this.state.cargo_id) this.setState({ categoria_id: "", categorias: [] });
        if (nextProps.show != this.props.show && nextProps.show && !Object.keys(nextState.historial).length) this.getCronograma(nextProps, nextState);
    }


    getPlanillas = async () => {
        this.setState({ loading: true });
        await axios.get(`${unujobs}/planilla`)
        .then(res => {
            this.setState({ planillas: res.data });
        }).catch(err => console.log(err.message));
        this.setState({ loading: false });
    }


    getAFPs = () => {
        axios.get(`${unujobs}/afp`)
        .then(res => this.setState({ afps: res.data }))
        .catch(err => console.log(err.message));
    }


    getBancos = () => {
        axios.get(`${unujobs}/banco`)
        .then(res => this.setState({ bancos: res.data }))
        .catch(err => console.log(err.message));
    }


    handleInput = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }


    handleNavs = async (e, obj, index) => {
        if (!this.state.edit) {
            let newNavs = this.state.navs;
            await newNavs.map(nav => nav.active = false);
            obj.active = true;
            newNavs[index] = obj;
            this.setState({ navs: newNavs, current: obj.key });  
        } else {
            this.getAlert();
        }
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
            let { page, cargo_id, categoria_id, afp_id, like, exports } = state;
            let id = query.info ? atob(query.info) : "";
            let params = `page=${page}&cargo_id=${cargo_id}&categoria_id=${categoria_id}&afp_id=${afp_id}&like=${like}&export=${exports.click}`;
            await axios.get(`${unujobs}/cronograma/${id}?${params}`)
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
            }).catch(err => {
                console.log(err);
            });
        } catch(ex) {
            console.log(ex);
        }

        let newExport = Object.assign({}, this.state.exports);
        newExport.loading = false;
        this.setState({ loading: false, exports: newExport });
    }


    sendEmail = async () => {
        let  { historial } = this.state;
        this.setState({ block: true, send: true });
        await axios.post(`${unujobs}/historial/${historial.id}/send_boleta`)
        .then(res => {
            let { success, message } = res.data;
            let icon = success ? 'success' : 'error';
            Swal.fire({ icon, text: message });
        }).catch(err => {
            Swal.fire({ icon: 'error', text: "Algo salió mal, vuelva más tarde!" });
        });
        this.setState({ block: false, send: false });
    }


    getCargos = (state) => {
        let { cronograma } = state;
        axios.get(`${unujobs}/planilla/${cronograma.planilla_id}`)
        .then(async res => {
            let { cargos } = res.data;
            this.setState({ cargos });
        }).catch(err =>  console.log(err.message));
    }


    getCategorias = (state) => {
        let { cargo_id } = state;
        axios.get(`${unujobs}/cargo/${cargo_id}`)
        .then(async res => {
            let { categorias } = res.data;
            this.setState({ categorias: categorias ? categorias : [] });
        }).catch(err =>  console.log(err.message));
    }


    next = async (e) => {
        let { page, last_page, edit } = this.state;
        if (!edit) {
            if (page < last_page) {
                await this.setState(state => ({ page: state.page + 1 }));
                this.getCronograma(this.props, this.state);
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
            categoria_id: "", 
            page: 1, 
            afp_id: "",
            like: "",
            exports: {
                click: 0,
                loading: false,
                headres: [],
                content: [],
            }
        });  
    }

    render() {

        let { show } = this.props;
        let { 
            cronograma, exports, 
            historial, planillas, 
            afps, cargos, 
            categorias, loading, 
            cargo_id, categoria_id, 
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
                        <Row>
                            <div className="col-md-3">
                                <input type="text" 
                                    className={`form-control ${this.state.like ? 'border-dark text-dark' : ''}`}
                                    disabled={loading || this.state.edit || this.state.block}
                                    value={this.state.like}
                                    onChange={this.handleInput}
                                    name="like"
                                    placeholder="Buscar por Nombre Completo o N° de documento"
                                    autoComplete="false"
                                />   
                            </div>

                            <div className="col-md-2 mb-1">
                                <select name="cargo_id" 
                                    className={`form-control ${cargo_id ? 'border-dark text-dark' : ''}`}
                                    value={cargo_id}
                                    onChange={this.handleInput}
                                    disabled={loading || this.state.edit || this.state.block}
                                >
                                    <option value="">Select. Cargo</option>
                                    {cargos.map(obj => 
                                        <option key={`cargo-${obj.id}`}
                                            value={obj.id}
                                        >
                                            {obj.descripcion}
                                        </option>    
                                    )}
                                </select>
                            </div>
                            <div className="col-md-2 mb-1">
                                <select name="categoria_id" 
                                    className={`form-control ${categoria_id ? 'border-dark text-dark' : ''}`}
                                    value={categoria_id}
                                    onChange={this.handleInput}
                                    disabled={loading || this.state.edit || this.state.block}
                                >
                                    <option value="">Select. Categoría</option>
                                    {categorias.map(obj => 
                                        <option key={`categoria-${obj.id}`}
                                            value={obj.id}
                                        >
                                            {obj.nombre}
                                        </option>    
                                    )}
                                </select>
                            </div>
                            <div className="col-md-2 mb-1">
                                <select name="afp_id" 
                                    className={`form-control ${afp_id ? 'border-dark text-dark' : ''}`}
                                    value={afp_id}
                                    onChange={this.handleInput}
                                    disabled={loading || this.state.edit || this.state.block}
                                >
                                    <option value="">Select. AFP</option>
                                    {afps.map(obj => 
                                        <option key={`categoria-${obj.id}`}
                                            value={obj.id}
                                        >
                                            {obj.nombre}
                                        </option>    
                                    )}
                                </select>
                            </div>
                            <div className="col-md-2 mb-1">
                                {
                                    exports.click 
                                        ?   <button className="btn btn-danger btn-block"
                                                disabled={exports.loading}
                                                onClick={(e) => {
                                                    let newExport = Object.assign({}, exports);
                                                    newExport.click = 0;
                                                    this.setState({ exports: newExport, block: false });
                                                }}
                                            >
                                                <i className="fas fa-times"></i> Limpiar
                                            </button>
                                        :   <button className="btn btn-dark btn-block"
                                                onClick={this.readCronograma}
                                                title="Realizar Búsqueda"
                                                disabled={loading || this.state.edit || this.state.block}
                                            >
                                                <i className="fas fa-filter"></i> Filtrar
                                            </button>
                                }
                            </div>

                            { this.state.total && !this.state.block
                                ?   <div className="col-md-1 mb-1">
                                        {
                                            exports.click 
                                            ?   exports.loading
                                                ?   <button className="btn-info btn btn-block"
                                                        disabled={exports.loading}
                                                    >
                                                        <i className="fas fa-upload"></i>
                                                    </button>
                                                :   <CSVLink data={exports.content} 
                                                        headers={exports.headers} 
                                                        target="__blank"
                                                        className="btn btn-info btn-block"
                                                        filename={`${filname}.xlsx`}
                                                    >
                                                        <i className="fas fa-download"></i>
                                                    </CSVLink>
                                            :   <button className="btn btn-success btn-block"
                                                    onClick={this.getExport}
                                                    title="Realizar exportación en CSV del Resultado."
                                                    disabled={loading || this.state.edit}
                                                >
                                                    <i className="fas fa-file-excel"></i> Exp.
                                                </button>
                                        }
                                    </div>
                                : null
                            }

                            <div className="col-md-12">
                                <Tab navs={this.state.navs}
                                    onClick={this.handleNavs}
                                />
                            </div>
                            
                            {loading 
                                ?   <div className="col-md-12 mt-3 text-center">
                                        <Spinner/>
                                    </div>
                                :   <div className="col-md-12 mt-3">
                                        {this.state.current == 'general' 
                                            ?   <Work 
                                                    bancos={this.state.bancos}
                                                    historial={historial}
                                                    edit={this.state.edit}
                                                /> 
                                            : null}
                                        {this.state.current == 'afectacion' 
                                            ?   <Afectacion 
                                                    edit={this.state.edit}
                                                    historial={historial}
                                                /> 
                                            : null}
                                        {this.state.current == 'remuneracion' 
                                            ?   <Remuneracion
                                                    edit={this.state.edit}
                                                    historial={historial}
                                                /> 
                                            : null}
                                        {this.state.current == 'descuento' 
                                            ?   <Descuento
                                                    edit={this.state.edit}
                                                    historial={historial}
                                                /> 
                                            : null}
                                    </div>
                            }
                        </Row>
                    </Card.Body>
                    <Card.Footer style={{ position: "absolute", background: "#fff", bottom: "0px", width: "100%", left: "0px" }}>
                        <Card.Body>
                            <Row className="justify-content-between">
                                
                                <div className="col md-8">
                                    <div className="row">
                                        <div className="col-md-2 mb-1">
                                            <input type="number" 
                                                className="form-control" 
                                                name="year" 
                                                placeholder="Año"
                                                value={cronograma.year}
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="col-md-2 mb-1">
                                            <input type="number" 
                                                className="form-control" 
                                                name="mes" 
                                                placeholder="Mes"
                                                value={cronograma.mes}
                                                disabled={true}
                                            />
                                        </div>

                                        <div className="col-md-3 mb-1">
                                            <select name="planilla_id" 
                                                className="form-control"
                                                value={cronograma.planilla_id}
                                                disabled={true}
                                            >
                                                <option value="">Select. Planilla</option>
                                                {planillas.map(obj => 
                                                    <option key={`planilla-${obj.id}`}
                                                        value={obj.id}
                                                    >
                                                        {obj.descripcion}
                                                    </option>    
                                                )}
                                            </select>
                                        </div>

                                        <div className="col-md-2 mb-1">
                                            <div className="form-control">
                                                { cronograma.adicional ? '' : 'No' } Adicional
                                                { cronograma.adicional 
                                                    ?  <Fragment>
                                                            <i className="text-primary fas fa-arrow-right ml-1"></i> {cronograma.numero}
                                                        </Fragment>
                                                    : '' 
                                                }
                                            </div>
                                        </div>

                                        <div className="col-md-2 mb-1">
                                            { this.state.total 
                                                ?   <span className="btn btn-dark">
                                                        {this.state.page} de {this.state.total}
                                                    </span> 
                                                :   <button className="btn btn-danger btn-block"
                                                        onClick={this.clearSearch}
                                                    >
                                                        <i className="fas fa-trash"></i> Limpiar
                                                    </button>
                                                }
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-4 text-right">
                                    {
                                        this.state.total && cronograma.estado
                                        ?   <Button size="md"
                                                className={`mr-1 btn-${this.state.edit ? 'danger' : 'warning'}`}
                                                disabled={loading || this.state.block}
                                                onClick={(e) => this.setState(state => ({ edit: !state.edit }))}
                                            >
                                                <i className={`fas fa-${this.state.edit ? 'times' : 'pencil-alt'} mr-1`}></i>
                                                { this.state.edit ? 'Cancelar' : 'Editar' }
                                            </Button>
                                        :   null
                                    }


                                    {
                                        this.state.total && !cronograma.estado
                                        ?   <Button size="md"
                                                className={`mr-1 btn-warning`}
                                                disabled={loading || this.state.block}
                                                onClick={this.sendEmail}
                                            >
                                                <i className="fas fa-envelope-open-text"></i> { this.state.send ? 'Enviando...' : 'Enviar Email' }
                                            </Button>
                                        :   null
                                    }


                                    {   !this.state.edit && this.state.total
                                        ?   <Button size="md" 
                                                className="mr-1 btn-dark"
                                                disabled={loading || this.state.edit || this.state.block}
                                                onClick={this.readCronograma}
                                            >
                                                Pág N° 1
                                            </Button>   
                                        : null
                                    }

                                    {   !this.state.edit && this.state.total
                                        ?   <Button size="md" 
                                                className="mr-1 btn-dark"
                                                disabled={loading || this.state.edit || this.state.block}
                                                onClick={this.previus}
                                            >
                                                <i className="fas fa-arrow-left"></i>
                                            </Button>   
                                        : null
                                    }

                                    {   !this.state.edit && this.state.total
                                        ?   <Button size="md" 
                                                className="mr-1 btn-dark"
                                                disabled={loading || this.state.edit || this.state.block}
                                                onClick={this.next}
                                            >
                                                <i className="fas fa-arrow-right"></i>
                                            </Button>
                                        :   null
                                    }

                                    { this.state.edit
                                        ?   <Button size="md"
                                                disabled={loading || !this.state.edit || this.state.block}
                                            >
                                                <i className="fas fa-sync mr-1"></i>
                                                Actualizar
                                            </Button>
                                        :  null
                                    }
                                </div>
                            </Row>
                        </Card.Body>
                    </Card.Footer>
            </Modal>    
        )
    }

}
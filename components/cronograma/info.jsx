import React, { Component } from 'react';
import Modal from '../modal';
import { Card, Row, Button } from 'react-bootstrap';
import { unujobs } from '../../services/urls';
import axios from 'axios';
import atob from 'atob';
import { Tab } from '../Utils';
import Work from './work';
import Afectacion from './afectacion';
import Swal from 'sweetalert2';
import Spinner from '../../components/spinner';

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
            current: "general",
            navs: [
                { id: 1, name: "Datos Generales", key: "general", active: true },
                { id: 2, name: "Afectación Presupuestal", key: "afectacion",  active: false },
                { id: 3, name: "Remuneraciones", key: "remuneracion", active: false },
                { id: 4, name: "Descuentos", key: "descuento", active: false },
                { id: 5, name: "Aportación Empleador", key: "aportacion", active: false },
                { id: 6, name: "Obligaciones Judiciales", key: "obligacion", active: false },
                { id: 7, name: "Tasa Educacional", key: "educacional", active: false }
            ]
        };

        this.close = this.close.bind(this);
    }

    componentDidMount() {
        this.getPlanillas();
        this.getAFPs();
    }

    componentWillReceiveProps(nextProps) {
        let { query } = this.props;
        if (nextProps.query.info != "" && query.info != nextProps.info) this.getCronograma(nextProps, this.state);
    }


    componentWillUpdate = (nextProps, nextState) => {
        if (nextState.cronograma.planilla_id != this.state.cronograma.planilla_id ) this.getCargos(nextState);
        if (nextState.cargo_id != "" && nextState.cargo_id != this.state.cargo_id) this.getCategorias(nextState);
        if (nextState.cargo_id == "" && nextState.cargo_id != this.state.cargo_id) this.setState({ categoria_id: "", categorias: [] });
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


    getAlert = () => {
        Swal.fire({ icon: "warning", text: "La edición está activa!. Actualize o Cancele la edición" });
    }


    setEdit = (e) => {
        this.setState({ edit: e });
    }


    getCronograma = async (props, state) => {
        this.setState({ loading: true });
        try {
            let { query } = props;
            let { page, cargo_id, categoria_id, afp_id, like } = state;
            let id = query.info ? atob(query.info) : "";
            await axios.get(`${unujobs}/cronograma/${id}?page=${page}&cargo_id=${cargo_id}&categoria_id=${categoria_id}&afp_id=${afp_id}&like=${like}`)
            .then(async res => {
                let { cronograma, historial } = res.data;
                let tmp_historial = {};
                let tmp_cronograma = cronograma;
                tmp_cronograma.year = cronograma.año;
                await historial.data.filter(obj => tmp_historial = obj);
                // setting
                this.setState({ cronograma: tmp_cronograma, historial: tmp_historial, total: historial.total, last_page: historial.last_page });
            }).catch(err => {
                console.log(err);
            });
        } catch(ex) {
            console.log(ex);
        }

        this.setState({ loading: false });
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
        this.setState({ cargo_id: "", categoria_id: "", page: 1, afp_id: "" });  
    }

    render() {

        let { show } = this.props;
        let { cronograma, historial, planillas, afps, cargos, categorias, loading, cargo_id, categoria_id, afp_id } = this.state;

        return (
            <Modal show={show}
                isClose={this.close}
                md="11"
                titulo={`INFORMACIÓN DE "${historial && historial.work ? historial.work.nombre_completo : 'NO HAY TRABAJADOR DISPONIBLE'}"`}
            >
                    <Card.Body style={{ height: "85%", overflowY: "auto" }}>
                        <Row>
                            <div className="col-md-4">
                                <input type="text" 
                                    className={`form-control ${this.state.like ? 'border-dark text-dark' : ''}`}
                                    disabled={loading}
                                    value={this.state.like}
                                    onChange={this.handleInput}
                                    name="like"
                                    placeholder="Buscar por Nombre Completo o N° de documento"
                                    autoComplete={false}
                                />   
                            </div>

                            <div className="col-md-2 mb-1">
                                <select name="cargo_id" 
                                    className={`form-control ${cargo_id ? 'border-dark text-dark' : ''}`}
                                    value={cargo_id}
                                    onChange={this.handleInput}
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                <button className="btn btn-dark btn-block"
                                    onClick={this.readCronograma}
                                    title="filtrar"
                                >
                                    <i className="fas fa-filter"></i> Filtrar
                                </button>
                            </div>

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
                                            ?   <Work historial={historial}
                                                    setEdit={this.setEdit}/> 
                                            : null}
                                        {this.state.current == 'afectacion' 
                                            ?   <Afectacion 
                                                    setEdit={this.setEdit}
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
                                <div className="col-md-1 mb-1">
                                    <input type="number" 
                                        className="form-control" 
                                        name="year" 
                                        placeholder="Año"
                                        value={cronograma.year}
                                        disabled={true}
                                    />
                                </div>

                                <div className="col-md-1 mb-1">
                                    <input type="number" 
                                        className="form-control" 
                                        name="mes" 
                                        placeholder="Mes"
                                        value={cronograma.mes}
                                        disabled={true}
                                    />
                                </div>

                                <div className="col-md-2 mb-1">
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
                                    <select name="adicional" 
                                        className="form-control"
                                        value={cronograma.adicional}
                                        disabled={true}
                                    >
                                        <option value="0">No Adicional</option>
                                        <option value="1">Adicional</option>
                                    </select>
                                </div>
                                {
                                    cronograma.numero 
                                    ?   <div className="col-md-1 mb-1">
                                            <input type="number" 
                                                placeholder="Numero de adicional"
                                                min="1"
                                                className="form-control"
                                                name="numero"
                                                value={cronograma.numero}
                                                disabled={true}
                                            />
                                        </div> 
                                    : null
                                }
                                <div className="col-md-2 mb-1">
                                    <span className="btn btn-dark">
                                        Pág {this.state.page} de {this.state.total}
                                    </span>
                                </div>
                                
                                <div className="col-md-3 text-right">
                                    <Button size="md" 
                                        className="mr-1 btn-dark"
                                        disabled={loading}
                                        onClick={this.previus}
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </Button>
                                    <Button size="md" 
                                        className="mr-1 btn-dark"
                                        disabled={loading}
                                        onClick={this.next}
                                    >
                                        <i className="fas fa-arrow-right"></i>
                                    </Button>
                                    <Button size="md"
                                        disabled={loading || !this.state.edit}
                                    >
                                        <i className="fas fa-sync mr-1"></i>
                                        Actualizar
                                    </Button>
                                </div>
                            </Row>
                        </Card.Body>
                    </Card.Footer>
            </Modal>    
        )
    }

}
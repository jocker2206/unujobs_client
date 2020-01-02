import React, { Component } from 'react';
import axios from 'axios';
import { unujobs } from '../../services/urls';
import { BtnEditar } from '../../components/Utils';

export default class Afectacion extends Component {


    state = {
        history: {},
        work: {},
        afps: [],
        type_afps: [],
        metas: [],
        sindicatos: [],
        cargos: [],
        categorias: [],
        edit: false,
    };


    async componentDidMount() {
        await this.setting(this.props, this.state);
        await this.getAFPs();
        this.getTypeAFP(this.state);
        this.getMetas();
        this.getSindicatos();
        this.getCargos(this.state);
        this.getCategorias(this.state);
    }
 

    componentWillUpdate(nextProps, nextState) {
        if ( nextState.history.afp_id != this.state.history.afp_id) this.getTypeAFP(nextState);
        if ( nextState.edit != this.state.edit && !nextState.edit ) this.setting(nextProps, nextState);
        if ( nextState.edit != this.state.edit && nextState.edit ) this.setEdit(nextState);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.historial != this.props.historial) this.setting(nextProps);
    }


    setting = async (nextProps, nextState) => {
        this.setState({ 
            history: nextProps.historial ? nextProps.historial : {}, 
            work: nextProps.historial.work ? nextProps.historial.work : {} 
        });
        // actualizar la edicion
        this.setEdit(nextState);
    }



    setEdit = (state) => {
        let { setEdit } = this.props;
        if (typeof setEdit == 'function') setEdit(state.edit);
    }


    getAFPs = async () => {
        await axios.get(`${unujobs}/afp`)
        .then(res => this.setState({ afps: res.data ? res.data : [] }))
        .catch(err => console.log(err.message));
    }


    getTypeAFP = async (state) => {
        let { afps, history } = state;
        await afps.filter(obj => {
            if (history.afp_id == obj.id) {
                this.setState({ type_afps: obj.type_afps });
            }
        });

    }


    handleInput = async (e) => {
        let { name, value } = e.target;
        let newObject = await Object.assign({}, this.state.history);
        newObject[name] = value;
        this.setState({ history: newObject });
    }


    getMetas = () => {
        axios.get(`${unujobs}/meta`)
        .then(res => this.setState({ metas: res.data }))
        .catch(err => console.log(err.message));
    }


    getCargos = (state) => {
        let { history } = state;
        axios.get(`${unujobs}/planilla/${history.planilla_id}`)
        .then(res => {
            let { cargos } = res.data;
            this.setState({ cargos: cargos ? cargos : [] });
        }).catch(err => console.log(err.message));
    }


    getSindicatos = () => {
        axios.get(`${unujobs}/sindicato`)
        .then(res => this.setState({ sindicatos: res.data }))
        .catch(err => console.log(err.message));
    }


    getCategorias = (state) => {
        let { history } = state;
        axios.get(`${unujobs}/cargo/${history.cargo_id}`)
        .then(res => {
            let { categorias } = res.data;
            this.setState({ categorias: categorias ? categorias : [] });
        }).catch(err => console.log(err.message));
    }


    render() {

        let {  history, cargos, categorias, afps, type_afps, metas, sindicatos } = this.state;

        return (
            <form className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <b>AFP</b>
                        {this.state.edit 
                            ?   <select name="afp_id" 
                                    className="form-control"
                                    value={history.afp_id}
                                    onChange={this.handleInput}
                                    disabled={!this.state.edit}
                                >
                                    <option value="">Select. AFP</option>
                                    {afps.map(obj => 
                                        <option key={`afp-item-${obj.id}`} 
                                            value={obj.id}
                                        >
                                            {obj.nombre}
                                        </option>
                                    )}
                                </select>
                            :   <input type="text" 
                                    className="form-control"
                                    disabled={true}
                                    value={history.afp && history.afp.nombre}
                                />
                            }
                    </div>

                    <div className="form-group">
                        <b>Fecha de Ingreso</b>
                        <input type="date" 
                            className="form-control"
                            name="fecha_de_ingreso"
                            value={history.fecha_de_ingreso}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <b>Meta</b>
                        { this.state.edit
                            ?   <select name="meta_id" 
                                    className="form-control"
                                    value={history.meta_id}
                                    onChange={this.handleInput}
                                    disabled={!this.state.edit}
                                >
                                    <option value="">Select. Meta</option>
                                    {metas.map(obj => 
                                        <option key={`afp-item-${obj.id}`} 
                                            value={obj.id}
                                        >
                                            {obj.metaID}.-{obj.meta}
                                        </option>
                                    )}
                                </select>
                            :   <input type="text" 
                                    className="form-control"
                                    name="meta_id"
                                    disabled={true}
                                    value={`${history.meta && history.meta.metaID}.-${history.meta && history.meta.meta}`}
                                />
                        }
                    </div>

                    <div className="form-group">
                        <b>Planilla</b>
                        <input type="text" 
                            className="form-control"
                            value={history.planilla && history.planilla.descripcion}
                            disabled={true}
                        />
                    </div>

                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <b>Tipo de AFP</b>
                        { this.state.edit
                            ?   <select name="type_afp_id" 
                                    className="form-control"
                                    value={history.type_afp_id}
                                    onChange={this.handleInput}
                                    disabled={!this.state.edit}
                                >
                                    <option value="">Select. Tipo de AFP</option>
                                    {type_afps.map(obj => 
                                        <option key={`afp-item-${obj.id}`} 
                                            value={obj.id}
                                        >
                                            {obj.descripcion}
                                        </option>
                                    )}
                                </select>
                            :   <input type="text" 
                                    className="form-control"
                                    disabled={true}
                                    name="type_afp_id"
                                    value={history.type_afp && history.type_afp.descripcion}
                                />
                        }
                    </div>

                    <div className="form-group">
                        <b>Fecha de Cese</b>
                        <input type="date" 
                            className="form-control"
                            name="fecha_de_cese"
                            value={history.fecha_de_cese}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <b>Escuela</b>
                        <input type="text" 
                            className="form-control"
                            name="escuela"
                            value={history.escuela}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <b>Cargo</b>
                        { this.state.edit 
                            ?   <select name="cargo_id" 
                                    className="form-control"
                                    value={history.cargo_id}
                                    onChange={this.handleInput}
                                    disabled={!this.state.edit}
                                >
                                    <option value="">Select. Cargo</option>
                                    {cargos.map(obj => 
                                        <option key={`cargo-item-${obj.id}`} 
                                            value={obj.id}
                                        >
                                            {obj.descripcion}
                                        </option>
                                    )}
                                </select>
                            :   <input type="text" 
                                    className="form-control"
                                    value={history.cargo && history.cargo.descripcion}
                                    disabled={true}
                                />
                        }
                    </div>

                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <b>N° CUSSP</b>
                        <input type="text" 
                            name="numero_de_cussp" 
                            className="form-control"
                            min="10"
                            value={history.numero_de_cussp}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <b>N° Autogenerado</b>
                        <input type="text" 
                            name="numero_de_essalud" 
                            className="form-control"
                            value={history.numero_de_essalud}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <b>Perfil Trabajador</b>
                        <input type="text" 
                            name="perfil" 
                            className="form-control"
                            value={history.perfil}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <b>Categoría</b>
                        { this.state.edit 
                            ?   <select name="categoria_id" 
                                    className="form-control"
                                    value={history.categoria_id}
                                    onChange={this.handleInput}
                                    disabled={!this.state.edit}
                                >
                                    <option value="">Select. Categoría</option>
                                    {categorias.map(obj => 
                                        <option key={`categoria-item-${obj.id}`} 
                                            value={obj.id}
                                        >
                                            {obj.nombre}
                                        </option>
                                    )}
                                </select>
                            :   <input type="text" 
                                    className="form-control"
                                    disabled={true}
                                    name="categoria_id"
                                    value={history.categoria && history.categoria.nombre}
                                />
                        }
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <b>Fecha de Afiliación</b>
                        <input type="date" 
                            className="form-control"
                            name="fecha_de_afiliacion"
                            value={history.fecha_de_afiliacion}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <b>Sindicato</b>
                        <select name="sindicato_id" 
                            className="form-control"
                            value={history.sindicato_id}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        >
                            <option value="">Select. Sindicato</option>
                            {sindicatos.map(obj => 
                                <option key={`afp-item-${obj.id}`} 
                                    value={obj.id}
                                >
                                    {obj.nombre}
                                </option>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <b>Plaza</b>
                        <input type="text" 
                            name="plaza" 
                            className="form-control"
                            value={history.plaza}
                            onChange={this.handleInput}
                            disabled={!this.state.edit}
                        />
                    </div>

                    <div className="form-group">
                        <BtnEditar edit={this.state.edit}
                            onClick={(e) => this.setState(state => ({ edit: !state.edit }))}
                        />
                    </div>
                </div>

                <div className="col-md-9">
                    <textarea name="observacion" 
                        className="form-control" 
                        style={{ width: "100%" }}
                        rows="8"
                        value={history.observacion}
                        onChange={this.handleInput}
                        disabled={!this.state.edit}
                    />
                </div>
            </form>
        )
    }

}
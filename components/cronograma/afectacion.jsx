import React, {Component} from 'react';
import axios from 'axios';
import {unujobs} from '../../services/urls';
import {BtnEditar} from '../../components/Utils';

export default class Afectacion extends Component {


    state = {
        history: {},
        work: {},
        afps: [],
        type_afps: [],
        metas: [],
        sindicatos: [],
        cargos: [],
        categorias: []
    };


    async componentDidMount() {
        await this.setting(this.props, this.state);
        await this.getAFPs();
        this.getTypeAFP(this.state);
        this.getMetas();
        this.getSindicatos();
        this.getCargos(this.state);
    }


    componentWillUpdate(nextProps, nextState) {
        if (nextState.history.afp_id != this.state.history.afp_id) 
            this.getTypeAFP(nextState);
        


    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.historial != this.props.historial) 
            this.setting(nextProps);
        


    }


    setting = async (nextProps) => {
        this.setState({
            history: nextProps.historial ? nextProps.historial : {},
            work: nextProps.historial.work ? nextProps.historial.work : {}
        });
    }


    getAFPs = async () => {
        await axios.get(`${unujobs}/afp`).then(res => this.setState({
            afps: res.data ? res.data.data : []
        })).catch(err => console.log(err.message));
    }


    getTypeAFP = async (state) => {
        let {afps, history} = state;
        await afps.filter(obj => {
            if (history.afp_id == obj.id) {
                this.setState({type_afps: obj.type_afps});
            }
        });

    }


    handleInput = async (e) => {
        let {name, value} = e.target;
        let newObject = await Object.assign({}, this.state.history);
        newObject[name] = value;
        this.setState({history: newObject});
    }


    getMetas = () => {
        let {history} = this.state;
        axios.get(`${unujobs}/cronograma/${
            history.cronograma_id
        }/meta`).then(res => this.setState({metas: res.data})).catch(err => console.log(err.message));
    }


    getCargos = (state) => {
        let {history} = state;
        axios.get(`${unujobs}/cronograma/${
            history.cronograma_id
        }/cargo`).then(res => {
            let {cargos} = res.data;
            this.setState({
                cargos: cargos ? cargos : []
            });
        }).catch(err => console.log(err.message));
    }


    getSindicatos = () => {
        axios.get(`${unujobs}/sindicato`).then(res => this.setState({sindicatos: res.data})).catch(err => console.log(err.message));
    }


    render() {

        let {
            history,
            cargos,
            categorias,
            afps,
            type_afps,
            metas,
            sindicatos
        } = this.state;

        return (
            <form className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <b>AFP</b>
                        {
                        this.props.edit ? <select name="afp_id" className="form-control"
                            value={
                                history.afp_id
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                        }>
                            <option value="">Select. AFP</option>
                            {
                            afps && afps.map(obj => <option key={
                                    `afp-item-${
                                        obj.id
                                    }`
                                }
                                value={
                                    obj.id
                            }>
                                {
                                obj.nombre
                            } </option>)
                        } </select> : <input type="text" className="form-control"
                            disabled={true}
                            value={
                                history.afp && history.afp.nombre
                            }/>
                    } </div>

                    <div className="form-group">
                        <b>Fecha de Ingreso</b>
                        <input type="date" className="form-control" name="fecha_de_ingreso"
                            value={
                                history.fecha_de_ingreso
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>Meta</b>
                        {
                        this.props.edit ? <select name="meta_id" className="form-control"
                            value={
                                history.meta_id
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                        }>
                            <option value="">Select. Meta</option>
                            {
                            metas && metas.map(obj => <option key={
                                    `afp-item-${
                                        obj.id
                                    }`
                                }
                                value={
                                    obj.id
                            }>
                                {
                                obj.metaID
                            }.-{
                                obj.meta
                            } </option>)
                        } </select> : <input type="text" className="form-control" name="meta_id"
                            disabled={true}
                            value={
                                `${
                                    history.meta && history.meta.metaID
                                }.-${
                                    history.meta && history.meta.meta
                                }`
                            }/>
                    } </div>

                    <div className="form-group">
                        <b>Planilla</b>
                        <input type="text" className="form-control"
                            value={
                                history.planilla && history.planilla.descripcion
                            }
                            disabled={true}/>
                    </div>

                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <b>Tipo de AFP</b>
                        {
                        this.props.edit ? <select name="type_afp_id" className="form-control"
                            value={
                                history.type_afp_id
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                        }>
                            <option value="">Select. Tipo de AFP</option>
                            {
                            type_afps && type_afps.map(obj => <option key={
                                    `afp-item-${
                                        obj.id
                                    }`
                                }
                                value={
                                    obj.id
                            }>
                                {
                                obj.descripcion
                            } </option>)
                        } </select> : <input type="text" className="form-control"
                            disabled={true}
                            name="type_afp_id"
                            value={
                                history.type_afp && history.type_afp.descripcion
                            }/>
                    } </div>

                    <div className="form-group">
                        <b>Fecha de Cese</b>
                        <input type="date" className="form-control" name="fecha_de_cese"
                            value={
                                history.fecha_de_cese
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>Escuela</b>
                        <input type="text" className="form-control" name="escuela"
                            value={
                                history.escuela
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>Cargo</b>
                        {
                        this.props.edit ? <select name="cargo_id" className="form-control"
                            value={
                                history.cargo_id
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                        }>
                            <option value="">Select. Cargo</option>
                            {
                            cargos && cargos.map(obj => <option key={
                                    `cargo-item-${
                                        obj.id
                                    }`
                                }
                                value={
                                    obj.id
                            }>
                                {
                                obj.descripcion
                            } </option>)
                        } </select> : <input type="text" className="form-control"
                            value={
                                history.cargo && history.cargo.descripcion
                            }
                            disabled={true}/>
                    } </div>

                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <b>N° CUSSP</b>
                        <input type="text" name="numero_de_cussp" className="form-control" min="10"
                            value={
                                history.numero_de_cussp
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>N° Autogenerado</b>
                        <input type="text" name="numero_de_essalud" className="form-control"
                            value={
                                history.numero_de_essalud
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>Perfil Trabajador</b>
                        <input type="text" name="perfil" className="form-control"
                            value={
                                history.perfil
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>Categoría</b>
                        <input type="text" className="form-control"
                            disabled={true}
                            name="categoria_id"
                            value={
                                history.categoria && history.categoria.nombre
                            }/>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <b>Fecha de Afiliación</b>
                        <input type="date" className="form-control" name="fecha_de_afiliacion"
                            value={
                                history.fecha_de_afiliacion
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>Plaza</b>
                        <input type="text" name="plaza" className="form-control"
                            value={
                                history.plaza
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>P.A.P</b>
                        <input type="text" name="pap" className="form-control"
                            value={
                                history.pap
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>

                    <div className="form-group">
                        <b>Ext. Presupuestal</b>
                        <input type="text" name="pap" className="form-control"
                            value={
                                history.cargo && history.cargo.ext_pptto
                            }
                            onChange={
                                this.handleInput
                            }
                            disabled={
                                !this.props.edit
                            }/>
                    </div>
                </div>

                <div className="col-md-9">
                    <b>Observación</b>
                    <textarea name="observacion" className="form-control"
                        style={
                            {width: "100%"}
                        }
                        rows="8"
                        value={
                            history.observacion
                        }
                        onChange={
                            this.handleInput
                        }
                        disabled={
                            !this.props.edit
                        }/>
                </div>
            </form>
        )
    }

}

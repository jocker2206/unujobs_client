import React, {Component} from 'react';
import { authentication } from '../../services/apis';
import { Form, Select } from 'semantic-ui-react';
import Show from '../show';
import { parseOptions } from '../../services/utils';

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
        if (nextState.history.afp_id != this.state.history.afp_id) {
            this.getTypeAFP(nextState);
        }
    }


    async componentWillReceiveProps(nextProps) {
        if (nextProps.historial != this.state.history || nextProps.historial != this.props.historial) {
            await this.setting(nextProps);
        }
    }


    setting = async (nextProps) => {
        this.setState({
            history: nextProps.historial ? nextProps.historial : {},
            work: nextProps.historial.work ? nextProps.historial.work : {}
        });
    }


    getAFPs = async () => {
        await authentication.get(`afp`).then(res => this.setState({
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


    handleSelect = async (e, { name, value }) => {
        let newObject = Object.assign({}, this.state.history);
        newObject[name] = value;
        this.setState({history: newObject});
    }


    getMetas = () => {
        let {history} = this.state;
        authentication.get(`cronograma/${history.cronograma_id}/meta`)
        .then(res => this.setState({metas: res.data}))
        .catch(err => console.log(err.message));
    }


    getCargos = (state) => {
        let {history} = state;
        authentication.get(`cronograma/${history.cronograma_id}/cargo`)
        .then(res => {
            this.setState({ cargos: res.data ? res.data : [] });
        }).catch(err => console.log(err.message));
    }


    getSindicatos = () => {
        authentication.get(`sindicato`)
        .then(res => this.setState({sindicatos: res.data}))
        .catch(err => console.log(err.message));
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
            <div className="row">
                <div className="col-md-3">
                    <Form.Field>
                        <b>AFP <b className="text-red">*</b></b>
                        <Show condicion={this.props.edit}>
                            <Select
                                options={parseOptions(afps, ['sel-afp', '', 'Select. AFP'], ['id', 'id', 'nombre'])}
                                placeholder="Select. AFP"
                                value={history.afp_id}
                                name="afp_id"
                                onChange={this.handleSelect}
                            />
                        </Show>
                        <Show condicion={!this.props.edit}>
                            <input type="text"
                                disabled={true}
                                value={history.afp && history.afp.nombre}
                            />
                        </Show>
                    </Form.Field>

                    <Form.Field>
                        <b>Fecha de Ingreso <b className="text-red">*</b></b>
                        <input type="date" 
                            name="fecha_de_ingreso"
                            value={history.fecha_de_ingreso}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>Meta <b className="text-red">*</b></b>
                        <Show condicion={this.props.edit}>
                            <Select
                                options={parseOptions(metas, ['sel-meta', '', 'Select. Meta'], ['id', 'id', 'metaID'])}
                                placeholder="Select. Meta"
                                value={history.meta_id}
                                name="meta_id"
                                onChange={this.handleSelect}
                            />
                        </Show>
                        <Show condicion={!this.props.edit}>
                            <input type="text" name="meta_id"
                                disabled={true}
                                value={`${history.meta && history.meta.metaID}.-${history.meta && history.meta.meta}`}
                            />
                        </Show>
                    </Form.Field>
                    
                    <Form.Field>
                        <b>Planilla</b>
                        <input type="text"
                            value={history.planilla && history.planilla.descripcion}
                            disabled={true}
                        />
                    </Form.Field>

                </div>

                <div className="col-md-3">

                    <Form.Field>
                        <b>Tipo de AFP</b>
                        <Show condicion={this.props.edit}>
                            <Select
                                options={parseOptions(type_afps, ['sel-tipo-afp', '', 'Select. Tip. AFP'], ['id', 'id', 'descripcion'])}
                                placeholder="Select. Tip. AFP"
                                value={history.type_afp_id ? history.type_afp_id : ''}
                                name="type_afp_id"
                                onChange={this.handleSelect}
                            />
                        </Show>
                        <Show condicion={!this.props.edit}>
                            <input type="text"
                                placeholder="Tip. AFP"
                                disabled={true}
                                name="type_afp_id"
                                value={history.type_afp && history.type_afp.descripcion}
                            />
                        </Show>
                    </Form.Field>

                    <Form.Field>
                        <b>Fecha de Cese</b>
                        <input type="date" 
                            name="fecha_de_cese"
                            value={history.fecha_de_cese ? history.fecha_de_cese : ''}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>Escuela</b>
                        <input type="text" 
                            name="escuela"
                            value={history.escuela ? history.escuela : ''}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>Cargo <b className="text-red">*</b></b>
                        <Show condicion={this.props.edit}>
                            <Select
                                options={parseOptions(cargos, ['sel-cargo', '', 'Select. Cargo'], ['id', 'id', 'descripcion'])}
                                placeholder="Select. Cargo"
                                value={history.cargo_id}
                                name="cargo_id"
                                onChange={this.handleSelect}
                            />
                        </Show>
                        <Show condicion={!this.props.edit}>
                            <input type="text" 
                                value={history.cargo && history.cargo.descripcion}
                                disabled={true}
                            />
                        </Show>
                    </Form.Field>

                </div>

                <div className="col-md-3">
                    <Form.Field>
                        <b>N° CUSSP</b>
                        <input type="text" 
                            name="numero_de_cussp"  
                            min="8"
                            value={history.numero_de_cussp ? history.numero_de_cussp : ''}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>N° Autogenerado</b>
                        <input type="text" 
                            name="numero_de_essalud"
                            value={history.numero_de_essalud ? history.numero_de_essalud : ''}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>Perfil Trabajador</b>
                        <input type="text" 
                            name="perfil"
                            value={history.perfil}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>Categoría</b>
                        <input type="text"
                            disabled={true}
                            name="categoria_id"
                            value={history.categoria && history.categoria.descripcion}
                        />
                    </Form.Field>
                </div>

                <div className="col-md-3">
                    <Form.Field>
                        <b>Fecha de Afiliación</b>
                        <input type="date" 
                            name="fecha_de_afiliacion"
                            value={history.fecha_de_afiliacion ? history.fecha_de_afiliacion : ''}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>Plaza</b>
                        <input type="text" 
                            name="plaza"
                            value={history.plaza ? history.plaza : ''}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>P.A.P</b>
                        <input type="text" 
                            name="pap"
                            value={history.pap}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>

                    <Form.Field>
                        <b>Ext. Presupuestal</b>
                        <input type="text" 
                            value={history.cargo && history.cargo.ext_pptto}
                            disabled={true}
                        />
                    </Form.Field>
                </div>

                <div className="col-md-9 mt-2">
                    <Form.Field>
                        <b>Observación</b>
                        <textarea 
                            name="observacion" 
                            style={{width: "100%"}}
                            rows="8"
                            value={history.observacion ? history.observacion : ''}
                            onChange={this.handleInput}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>
                </div>

                <div className="col-md-3 mt-2">
                    <Form.Field>
                        <b>Prima Seguros</b>
                        <Select
                            options={[
                                {key: "n", value: 0, text: "No Afecto"},
                                {key: "a", value: 1, text: "Afecto"}
                            ]}
                            placeholder="Select. Prima Seguro"
                            value={history.prima_afecto & history.prima_afecto}
                            name="prima_afecto"
                            onChange={this.handleSelect}
                            disabled={!this.props.edit}
                        />
                    </Form.Field>
                </div>
            </div>
        )
    }

}

import React, {Component, Fragment} from 'react';
import Datatable from '../../components/datatable';
import Router from 'next/router';
import btoa from 'btoa';
import Info from '../../components/cronograma/info';
import { authentication } from '../../services/apis';
import { Form, Button } from 'semantic-ui-react';

export default class Cronograma extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mes: 6,
            year: 2019,
            page: false,
            loading: false,
            cronogramas: []
        }

        this.handleInput = this.handleInput.bind(this);
        this.getOption = this.getOption.bind(this);
    }

    static getInitialProps(props) {
        let {query, pathname} = props;
        return {query, pathname}
    }

    async componentDidMount() {
        let date = new Date();
        await this.setState({
            year: date.getFullYear(),
            mes: date.getMonth() + 1
        });
        // obtener cronogramas
        this.getCronogramas();
    }

    handleInput(e) {
        let {name, value} = e.target;
        this.setState({[name]: value});
    }

    getCronogramas = async () => {
        this.setState({loading: true});
        let {mes, year} = this.state;
        await authentication.get(`cronograma?mes=${mes}&year=${year}`).then(res => {
            let {data} = res.data;
            this.setState({cronogramas: data});
        }).catch(err => console.log(err.message));
        this.setState({loading: false});
    }

    getOption(obj, key, index) {
        let {pathname, query} = Router;
        query[key] = btoa(obj.id);
        Router.push({pathname, query});
    }

    render() {

        let {loading, cronogramas} = this.state;
        let {query, pathname} = this.props;

        return (
            <div>
                <Datatable titulo="Lista de Planillas x Mes"
                    isFilter={false}
                    loading={loading}
                    headers={ ["#ID", "Planilla", "Sede", "Estado"]}
                    index={
                        [
                            {
                                key: "id",
                                type: "text"
                            }, {
                                key: "planilla.descripcion",
                                type: "text",
                                children: [
                                    {
                                        key: "numero",
                                        type: "icon",
                                        prefix: "Adicional"
                                    }
                                ]
                            }, {
                                key: "sede.descripcion",
                                type: "text"
                            }, {
                                key: "estado",
                                type: "switch",
                                is_true: "Abierta",
                                is_false: "Cerrada"
                            }
                        ]
                    }
                    options={
                        [
                            {
                                id: 1,
                                key: "info",
                                icon: "fas fa-info"
                            }, {
                                id: 1,
                                key: "edit",
                                icon: "fas fa-pencil-alt"
                            }, {
                                id: 1,
                                key: "add",
                                icon: "fas fa-user-plus"
                            }, {
                                id: 1,
                                key: "report",
                                icon: "fas fa-file-alt"
                            }
                        ]
                    }
                    getOption={this.getOption}
                    data={cronogramas}>
                    <Form className="mb-3">
                        <div className="row">
                            <div className="col-md-2 mb-1">
                                <Form.Field>
                                    <input type="number" 
                                        min="2019" 
                                        placeholder="Año" 
                                        name="year"
                                        value={this.state.year}
                                        disabled={this.state.loading}
                                        onChange={this.handleInput}
                                    />
                                </Form.Field>
                            </div>
                            <div className="col-md-2 mb-1">
                                <Form.Field>
                                    <input type="number" 
                                        min="1" 
                                        max="12" 
                                        placeholder="Mes" 
                                        name="mes"
                                        value={this.state.mes}
                                        onChange={this.handleInput}
                                        disabled={this.state.loading}
                                    />
                                </Form.Field>
                            </div>
                            <div className="col-md-2">
                                <Button 
                                    onClick={this.getCronogramas}
                                    disabled={this.state.loading}
                                    color="blue"
                                >
                                    <i className="fas fa-search"></i>
                                    <span>Buscar</span>
                                </Button>
                            </div>
                        </div>
                        <hr/>
                    </Form>
                </Datatable>
                {/* componentes de la ventana  */}
                <Info show={
                        query.info
                    }
                    query={query}
                    pathname={pathname}
                    close={
                        (e) => {
                            query.info = "";
                            Router.push({pathname, query});
                        }
                    }/>
            </div>
        )
    }

}

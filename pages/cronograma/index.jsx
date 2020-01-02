import React, { Component, Fragment } from 'react';
import { Button } from 'react-bootstrap';
import Datatable from '../../components/datatable';
import { unujobs } from '../../services/urls';
import axios from 'axios';
import Router from 'next/router';
import btoa from 'btoa';
import Info from '../../components/cronograma/info';

export default class Cronograma extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mes: 6,
            year: 2019,
            page: false,
            loading: false,
            cronogramas: [],
        }

        this.handleInput = this.handleInput.bind(this);
        this.getOption = this.getOption.bind(this);
    }

    static getInitialProps(props) {
        let { query, pathname } = props;
        return { query, pathname }
    }

    async componentDidMount() {
        let date = new Date();
        await this.setState({ 
            year: date.getFullYear(),
            mes: date.getMonth() == 0 ? 1 : date.getMonth()
        });
        // obtener cronogramas
        this.getCronogramas();
    }

    handleInput(e) {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    getCronogramas = async () => {
        this.setState({ loading: true });
        let { mes, year } = this.state;
        await axios.get(`${unujobs}/cronograma?mes=${mes}&year=${year}`)
        .then(res => {
            let  { data } = res.data;
            this.setState({ cronogramas: data });
        }).catch(err => console.log(err.message));
        this.setState({ loading: false });
    }

    getOption(obj, key, index) {
        let { pathname, query } = Router;
        query[key] = btoa(obj.id);
        Router.push({ pathname, query });
    }

    render() {

        let { loading, cronogramas } = this.state;
        let { query, pathname } = this.props;

        return (
            <div>
                <Datatable 
                    titulo="Lista de Planillas x Mes"
                    isFilter={false}
                    loading={loading}
                    headers={["#ID", "Planilla", "Sede", "Estado"]}
                    index={[
                        { key: "id", type: "text" },
                        { key: "planilla.descripcion", type: "text", children: [ { key: "numero", type: "icon", prefix: "Adicional" } ] },
                        { key: "sede.descripcion", type: "text" },
                        { key: "estado", type: "switch" }
                    ]}
                    options={[
                        { id: 1, key: "info", icon: "fas fa-info" },
                        { id: 1, key: "edit", icon: "fas fa-pencil-alt" },
                        { id: 1, key: "add", icon: "fas fa-user-plus" },
                        { id: 1, key: "report", icon: "fas fa-file-alt" }
                    ]}
                    getOption={this.getOption}
                    data={cronogramas}
                >  
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-2 mb-1">
                                <input type="number" 
                                    min="2019" 
                                    className="form-control" 
                                    placeholder="Año"
                                    name="year"
                                    value={this.state.year}
                                    disabled={this.state.loading}
                                    onChange={this.handleInput}
                                />
                            </div>
                            <div className="col-md-2 mb-1">
                                <input type="number" 
                                    min="1" 
                                    max="12" 
                                    className="form-control" 
                                    placeholder="Mes"
                                    name="mes"
                                    value={this.state.mes}
                                    onChange={this.handleInput}
                                    disabled={this.state.loading}
                                />
                            </div>
                            <div className="col-md-2">
                                <Button
                                    onClick={this.getCronogramas}
                                    disabled={this.state.loading}
                                    className="btn-block"
                                >
                                    <i className="fas fa-search"></i>
                                    <span> Buscar</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Datatable>
                {/* componentes de la ventana  */}
                <Info 
                    show={query.info}
                    query={query}
                    pathname={pathname}
                    close={(e) => {
                        query.info = "";
                        Router.push({ pathname, query });
                    }}
                />
            </div>
        )
    }

}
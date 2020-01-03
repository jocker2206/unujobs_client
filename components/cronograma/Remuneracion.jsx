import React, { Component } from 'react';
import axios from 'axios';
import { unujobs } from '../../services/urls';

export default class Remuneracion extends Component
{


    state = {
        remuneraciones: [],
        loader: false,
        total_bruto: 0,
        total_desct: 0,
        base: 0,
        total_neto: 0,
    }


    componentDidMount() {
        this.getRemuneraciones(this.props);
    }


    getRemuneraciones = async (props) => {
        let { historial } = props;
        axios.get(`${unujobs}/historial/${historial.id}/remuneracion`)
        .then(res => {
            let { remuneraciones, total_bruto, total_desct, total_neto, base } = res.data;
            this.setState({ 
                remuneraciones: remuneraciones ? remuneraciones : [],
                total_bruto,
                total_desct,
                total_neto,
                base
            });
        }).catch(err => console.log(err.message));
    }


    render() {

        let { remuneraciones, total_bruto, total_desct, total_neto, base } = this.state;
 
        return (
            <form className="row">

                <div className="col-md-12">
                    <div className="row justify-content-center">
                        <b className="col-md-3">
                            <span className="btn btn-outline-dark btn-block">Total Descuentos: S/ { total_desct }</span>
                        </b>
                        <b className="col-md-3">
                            <span className="btn btn-outline-dark btn-block">Total Bruto: S/ { total_bruto }</span>
                        </b>
                        <b className="col-md-3">
                            <span className="btn btn-outline-dark btn-block">Base Imponible: S/ { base }</span>
                        </b>
                        <b className="col-md-3">
                            <span className="btn btn-outline-dark btn-block">Total Neto: S/ { total_neto }</span>
                        </b>
                    </div>
                </div>
                
                <div className="col-md-12">
                    <hr/>
                </div>

                {remuneraciones.map(obj => 
                    <div  key={`remuneracion-${obj.id}`}
                         className="col-md-4 mb-1"
                    >
                        <div className="row">
                            <b className="col-md-8">
                                <span className="text-danger">
                                    {obj.type_remuneracion && obj.type_remuneracion.key}
                                </span>
                                .-
                                <span className="text-primary">
                                    {obj.type_remuneracion && obj.type_remuneracion.alias}
                                </span>
                            </b>
                            <div className="col-md-4">
                                <input type="text" 
                                    className="form-control"
                                    value={obj.monto}
                                    disabled={obj.edit ? true : false}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </form>
        )
    }

}
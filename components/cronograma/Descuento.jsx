import React, { Component } from 'react';
import axios from 'axios';
import { unujobs } from '../../services/urls';

export default class Descuento extends Component
{


    state = {
        descuentos: [],
        total_neto: 0,
        total_bruto: 0,
        total_desct: 0,
        base: 0,
        loader: false
    }


    componentDidMount() {
        this.getRemuneraciones(this.props);
    }


    getRemuneraciones = async (props) => {
        let { historial } = props;
        axios.get(`${unujobs}/historial/${historial.id}/descuento`)
        .then(res => {
            let { descuentos, total_bruto, total_desct, total_neto, base } = res.data;
            this.setState({ 
                descuentos: descuentos ? descuentos : [],
                total_bruto,
                total_desct,
                total_neto,
                base
            });
        }).catch(err => console.log(err.message));
    }


    render() {

        let { descuentos, total_bruto, total_neto, total_desct, base } = this.state;
 
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

                {descuentos.map(obj => 
                    <div  key={`descuento-${obj.id}`}
                         className="col-md-4 mb-1"
                    >
                        <div className="row">
                            <b className="col-md-8">
                                <span className="text-danger">
                                    {obj.type_descuento && obj.type_descuento.key}
                                </span>
                                .-
                                <span className="text-primary">
                                    {obj.type_descuento && obj.type_descuento.descripcion}
                                </span>
                            </b>
                            <div className="col-md-4">
                                { obj.edit 
                                    ?   <input type="number"
                                            name="monto"
                                            className="form-control"
                                            value={obj.monto}
                                            disabled={!this.props.edit}
                                        />
                                    :   <input type="text"
                                            className="form-control"
                                            value={obj.monto}
                                            disabled={true}
                                        />
                                }
                            </div>
                        </div>
                    </div>
                )}
            </form>
        )
    }

}
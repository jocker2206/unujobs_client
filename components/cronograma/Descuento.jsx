import React, { Component } from 'react';
import { unujobs } from '../../services/apis';
import { Button, Form } from 'semantic-ui-react';
import Swal from 'sweetalert2';


export default class Descuento extends Component
{


    state = {
        descuentos: [],
        payload: [],
        loader: false,
        total_bruto: 0,
        total_desct: 0,
        base: 0,
        total_neto: 0,
    }


    async componentDidMount() {
        await this.getDescuentos(this.props);
    }

    componentWillReceiveProps = async (nextProps) => {
        if (nextProps.historial && nextProps.historial.id != this.props.historial.id) {
            await this.getDescuentos(nextProps);
        }
        // update 
        if (nextProps.send && nextProps.send != this.props.send) {
            await this.updateDescuentos();
        }
    }

    getDescuentos = async (props) => {
        this.setState({ 
            descuentos: props.data,
            total_bruto: props.historial.total_bruto,
            total_desct: props.historial.total_desct,
            total_neto: props.historial.total_neto,
            base: props.historial.base
        });
    }

    handleMonto = (id, monto, index) => {
        let newPayload = this.state.payload;
        newPayload[index] = { id, monto };
        this.setState({ payload: newPayload });
    }

    updateDescuentos = async () => {
        const form = new FormData();
        form.append('_method', 'PUT');
        form.append('descuentos', JSON.stringify(this.state.payload));
        await unujobs.post(`descuento/${this.props.historial.id}/all`, form)
        .then(async res => {
            let { success, message, body } = res.data;
            let icon = success ? 'success' : 'error';
            await Swal.fire({ icon, text: message });
            if (success) {
                let { total_bruto, total_desct, base, total_neto } = body;
                this.setState({ total_bruto, total_desct, base, total_neto });
                this.props.setEdit(false);
            }
        })
        .catch(err => console.log(err.message));
        this.props.fireSent();
    }

    render() {

        let { descuentos, total_bruto, total_desct, total_neto, base, loader } = this.state;
 
        return (
            <Form className="row">

                <div className="col-md-12">
                    <div className="row justify-content-center">
                        <b className="col-md-3">
                            <Button basic loading={loader} fluid color="black">
                                {loader ? 'Cargando...' : `Total Bruto: S/ ${total_bruto}`}
                            </Button>
                        </b>
                        <b className="col-md-3">
                            <Button basic loading={loader} fluid color="black">
                                {loader ? 'Cargando...' : `Total Descuentos: S/ ${total_desct}`}
                            </Button>
                        </b>
                        <b className="col-md-3">
                            <Button basic loading={loader} fluid color="black">
                                {loader ? 'Cargando...' : `Base Imponible: S/ ${base}`}
                            </Button>
                        </b>
                        <b className="col-md-3">
                            <Button basic loading={loader} fluid color="black">
                                {loader ? 'Cargando...' : `Total Neto: S/ ${total_neto}`}
                            </Button>
                        </b>
                    </div>
                </div>
                
                <div className="col-md-12">
                    <hr/>
                </div>

                {descuentos.map((obj, index) => 
                    <div  key={`descuento-${obj.id}`}
                         className="col-md-3 mb-1"
                    >
                        <span className={obj.monto > 0 ? 'text-red' : ''}>
                            {obj.key}
                        </span>
                            .-
                        <span className={obj.monto > 0 ? 'text-primary' : ''}>
                            {obj.descripcion}
                        </span>
                        <Form.Field>
                            <input type="number"
                                step="any" 
                                defaultValue={obj.monto}
                                disabled={!obj.edit ? true : !this.props.edit}
                                onChange={({target}) => this.handleMonto(obj.id, target.value, index)}
                                min="0"
                            />
                        </Form.Field>
                    </div>
                )}
            </Form>
        )
    }

}
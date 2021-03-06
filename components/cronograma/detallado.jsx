import React, { Component } from 'react';
import { unujobs } from '../../services/apis';
import { Button, Form, Select, Icon, Grid } from 'semantic-ui-react';
import { parseOptions } from '../../services/utils';
import Swal from 'sweetalert2';


export default class Remuneracion extends Component
{


    state = {
        type_detalles: [],
        detalles: [],
        type_detalle_id: "",
        monto: "",
        loader: true,
        payload: []
    }


    componentDidMount = async () => {
        await this.getTypeDetalles();
        await this.getDetalles(this.props);
        await this.setState({ loader: false });
    }

    componentWillReceiveProps = async (nextProps) => {
        if (nextProps.historial && nextProps.historial.id != this.props.historial.id) {
            // await this.getDetalles(nextProps);
            await this.setState({ loader: false });
        }
    }

    handleInput = ({ name, value }) => {
        this.setState({ [name]: value });
    }

    create = async () => {
        this.setState({ loader: true });
        let payload = {
            historial_id: this.props.historial.id,
            type_detalle_id: this.state.type_detalle_id,
            monto: this.state.monto
        };
        // request
        await unujobs.post('detalle', payload)
        .then(async res => {
            let { success, message } = res.data;
            let icon = success ? 'success' : 'error';
            Swal.fire({ icon, text: message });
            if (success) {
                await this.getDetalles(this.props);
                await this.setState({ loader: false });
                await this.props.updatingHistorial();
                this.props.setEdit(false);
            }
        })
        .catch(err => Swal.fire({ icon: 'error', text: err.message }));
        this.setState({ loader: false });
        this.props.setLoading(false);
        this.props.setSend(false);
    }

    getDetalles = async (props) => {
        let { historial } = props;
        await unujobs.get(`historial/${historial.id}/detalle`)
        .then(async res => {
            await this.setState({ detalles: res.data ? res.data : [] });
        }).catch(err => console.log(err.message));
    }

    getTypeDetalles = async () => {
        await unujobs.get('type_detalle')
        .then(res => this.setState({ type_detalles: res.data }))
        .catch(err => console.log(err.message));
    }

    handleMonto = async (id, monto, index) => {
        let newPayload = this.state.payload;
        newPayload[index] = { id, monto };
        this.setState({ payload: newPayload });
    }

    render() {

        let { detalles, type_detalle_id, monto, type_detalles, loader } = this.state;
 
        return (
            <Form className="row" loading={loader}>

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4">
                            <Select
                                fluid
                                placeholder="Select. Tipo Detalle"
                                options={parseOptions(type_detalles, ['sel-type', '', 'Select. Tipo Detalle'], ['id', 'id', 'descripcion'])}
                                name="type_detalle_id"
                                value={type_detalle_id}
                                onChange={(e, obj) => this.handleInput(obj)}
                                disabled={!this.props.edit}
                            />
                        </div>

                        <div className="col-md-3">
                            <Form.Field>
                                <input type="number"
                                    name="monto"
                                    step="any"
                                    value={monto}
                                    placeholder="Ingrese un monto"
                                    disabled={!this.props.edit}
                                    onChange={({target}) => this.handleInput(target)}
                                />
                            </Form.Field>
                        </div>

                        <div className="col-xs">
                            <Button color="green"
                                disabled={!type_detalle_id}
                                onClick={this.create}    
                            >
                                <Icon name="plus"/> Agregar
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-12">
                    <hr/>
                </div>

                <div className="col-md-12">
                    <Grid columns={4} fluid>
                        {detalles.map(det => 
                            <Grid.Column key={`type_detalle_${det.id}`}>
                                <b><span className="text-red mb-2">{det.key}</span>.- <span className="text-primary">{det.descripcion}</span></b>
                                <hr/>
                                {det.detalles.map((detalle, index) => 
                                    <Form.Field key={`detalle-${detalle.id}`}>
                                        <label htmlFor="">{detalle.type_detalle && detalle.type_detalle.descripcion}</label>
                                        <input type="number" 
                                            step="any"
                                            defaultValue={detalle.monto}
                                            disabled={!this.props.edit}
                                            onChange={({target}) => this.handleMonto(detalle.id, target.value, index)}
                                            min="0"
                                        />
                                    </Form.Field>    
                                )}
                            </Grid.Column>    
                        )}
                    </Grid>
                </div>
            </Form>
        )
    }

}
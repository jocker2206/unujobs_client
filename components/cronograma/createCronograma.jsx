import React, { Component } from 'react'
import { Form, Grid, Checkbox, Select, Button, Icon, Divider, Message, Input } from 'semantic-ui-react';
import Show from '../show';
import { authentication } from '../../services/apis';
import { parseOptions } from '../../services/utils';
import Swal from 'sweetalert2';

export default class CreateCronograma extends  Component{

    state = {
        planillas: [],
        planilla_id: "",
        year: 2020,
        mes: 6,
        dias: 30,
        observacion: "",
        adicional: false,
        remanente: false,
        loading: true,
        errors: {}
    }

    componentDidMount = async () => {
        let newDate = new Date();
        await this.getPlanillas();
        this.setState({
            year: newDate.getFullYear(),
            mes: newDate.getMonth() + 1,
            loading: false,
        });
    }

    handleInput = ({ name, value }) => {
        this.setState({[name]: value});
    }

    getPlanillas = async () => {
        await authentication.get('planilla')
        .then(res => this.setState({ planillas: res.data }))
        .catch(err => console.log(err.message));
    }

    readySend = () => {
        let { planilla_id, year, mes, dias } = this.state;
        return planilla_id && year && mes && dias;
    }

    saveAndContinue = async () => {
        await this.setState({ loading: true });
        let { fireCookie } = this.props;
        // send
        authentication.post('cronograma', this.state)
        .then(async res => {
            let { success, message, payload } = res.data;
            let icon = success ? 'success' : 'error';
            await Swal.fire({ icon, text: message });
            if (success) {
                if (typeof fireCookie == 'function') await fireCookie(payload, "config_boleta");
            } 
        })
        .catch(err => this.setState({ errors: err.response.data }));
        await this.setState({ loading: false });
    }

    render() {

        let { errors } = this.state;

        return (
            <Form loading={this.state.loading} action="#" onSubmit={(e) => e.preventDefault()}>
                <Grid centered columns={3}>
                    <Grid.Column>
                        <Form.Field>
                            <label htmlFor="" className="text-left">Planilla</label>
                            <Select placeholder="Select. Planilla"
                                options={parseOptions(this.state.planillas, ["", "", "Select. Planilla"], ["id", "id", "nombre"])}
                                name="planilla_id"
                                value={this.state.planilla_id}
                                onChange={(e, obj) => this.handleInput(obj)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Input
                                className="text-left"
                                error={null}
                                type="number"
                                fluid
                                label="Mes"
                                name="mes"
                                value={this.state.mes}  
                                onChange={(e, obj) => this.handleInput(obj)}
                                placeholder='Ingrese el mes'
                            />
                        </Form.Field>
                    </Grid.Column>

                    <Grid.Column>
                        <Form.Field>
                            <Form.Input
                                className="text-left"
                                error={null}
                                fluid
                                label="Año"
                                name="year"
                                type="number"
                                value={this.state.year}  
                                onChange={(e, obj) => this.handleInput(obj)}
                                placeholder='Ingrese el año'
                                disabled
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Input
                                className="text-left"
                                error={null}
                                type="number"
                                fluid
                                label="Dias"
                                name="dias"
                                value={this.state.dias}  
                                onChange={(e, obj) => this.handleInput(obj)}
                                placeholder='Ingrese los dias'
                                disabled={!this.state.adicional}
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid>

                <Grid centered columns="2">
                    <Grid.Column>
                        <Show condicion={this.state.year != 12}>
                            <Form.Field>
                                <label htmlFor="">¿Es una planilla adicional?</label>
                                <Checkbox label='Si' 
                                    checked={this.state.adicional} 
                                    name="adicional"
                                    value={!this.state.adicional}
                                    onChange={(e, obj) => this.handleInput(obj)}
                                />
                            </Form.Field>
                        </Show>

                        <Show condicion={this.state.year == 12}>
                            <Form.Field>
                                <label htmlFor="">¿Es una planilla remanente?</label>
                                <Checkbox label='Si'
                                    checked={this.state.remanente} 
                                    name="remanente"
                                    value={!this.state.remanente}
                                    onChange={(e, obj) => this.handleInput(obj)}
                                />
                            </Form.Field>
                        </Show>
                    </Grid.Column>
                </Grid>

                <Grid centered columns={2}>
                    <Grid.Column>
                        <Form.Field>
                            <label htmlFor="" className="text-left">Observación</label>
                            <textarea name="observacion"
                                rows="6"
                                value={this.state.observacion}
                                placeholder="Ingrese una observación para el cronograma"
                                onChange={({ target }) => this.handleInput(target)}
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid>

                <Divider/>

                <Grid columns={1} textAlign="right">
                    <Grid.Column>
                        <Button color="teal"
                            disabled={!this.readySend()}
                            onClick={this.saveAndContinue}
                        >
                            <Icon name="save"/> Guardar y Continuar
                        </Button>
                    </Grid.Column>
                </Grid>
            </Form>
        )
    }

}

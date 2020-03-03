import React, { Component, Fragment } from 'react';
import { Button, Grid, Accordion, Form, Icon, Label } from 'semantic-ui-react';
import { authentication } from '../../services/apis';
import Show from '../show';
import Boleta from './boleta';

export default class ConfigBoletas extends Component
{

    state = {
        planilla: {},
        type_categorias: [],
        current: "",
        loading: true
    }

    componentDidMount = async () => {
        await this.getPlanilla();
        await this.getTypeCategoria();
        this.setState({ loading: false });
    }

    getPlanilla = async () => {
        let { payload } = this.props;
        await authentication.get(`planilla/${payload.planilla_id}`)
        .then(res => this.setState({ planilla: res.data }))
        .catch(err => console.log(err.message));
    }

    getTypeCategoria = async () => {
        let { payload } = this.props;
        await authentication.get(`cronograma/${payload.id}/type_categoria`)
        .then(async res => await this.setState({ type_categorias: res.data }))
        .catch(err => console.log(err.message));
    }

    render() {

        let { payload } = this.props;
        let { planilla, type_categorias, loading, current } = this.state;

        return (
            <Form loading={loading}>
                <Grid columns="4" fluid className="mb-1">
                    <Grid.Column>
                        <Button color="black" basic fluid>
                            <span className="mr-2">ID:</span> {payload.id}
                        </Button>
                    </Grid.Column>

                    <Grid.Column>
                        <Button color="black" basic fluid>
                            <span className="mr-2">Planilla:</span> {planilla && planilla.nombre}
                        </Button>
                    </Grid.Column>

                    <Grid.Column>
                        <Button color="black" basic fluid>
                            <span className="mr-2">Año:</span> {payload.year}
                        </Button>
                    </Grid.Column>

                    <Grid.Column>
                        <Button color="black" basic fluid>
                            <span className="mr-2">Mes:</span> {payload.mes}
                        </Button>
                    </Grid.Column>
                </Grid>

                <Accordion fluid styled>
                    {type_categorias.map((obj, index) => 
                        <Fragment>
                            <Accordion.Title active={index === current} onClick={(e) => this.setState({ current: index })}>                     
                                <Label color="red" basic={index !== current}>
                                    <Icon name='dropdown' /> Categoría <Icon name="arrow alternate circle right" className="ml-1"/>  {obj.descripcion}
                                </Label>
                            </Accordion.Title>
                            <Accordion.Content active={index === current}>
                                <Boleta categoria={obj}/>
                            </Accordion.Content> 
                        </Fragment>   
                    )}
                </Accordion>

                <Show condicion={!loading && type_categorias.length == 0}>
                    <div className="text-center pt-5 mt-3">
                        <Icon name="question circle outline" size="huge"/> 
                        <h4 className="mt-0">No hay Categorías</h4>
                    </div>
                </Show>
            </Form>
        );
    }

}
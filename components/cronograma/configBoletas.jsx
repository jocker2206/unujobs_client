import React, { Component } from 'react';
import { Button, Grid, Select, Form } from 'semantic-ui-react';
import { authentication } from '../../services/apis';

export default class ConfigBoletas extends Component
{

    state = {
        planilla: {},
        loading: true
    }

    componentDidMount = async () => {
        await this.getPlanilla();
        this.setState({ loading: false });
    }

    getPlanilla = async () => {
        let { payload } = this.props;
        await authentication.get(`planilla/${payload.id}`)
        .then(res => this.setState({ planilla: res.data }))
        .catch(err => console.log(err.message));
    }

    render() {

        let { payload } = this.props;
        let { planilla, loading } = this.state;

        return (
            <Form loading={loading}>
                <Grid columns="4" fluid>
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
            </Form>
        );
    }

}
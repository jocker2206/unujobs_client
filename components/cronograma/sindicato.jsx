import React, { Component } from 'react';
import { authentication } from '../../services/apis';
import { Button, Form, Select, Icon } from 'semantic-ui-react';
import { parseOptions } from '../../services/utils';


export default class Remuneracion extends Component
{


    state = {
        sindicatos: [],
        aportaciones: [],
        sindicato_id: "",
        loader: true,
    }


    componentDidMount = async () => {
        // await this.getAportaciones(this.props);
        await this.getSindicatos();
        await this.setState({ loader: false });
    }

    componentWillReceiveProps = async (nextProps) => {
        if (nextProps.historial && nextProps.historial.id != this.props.historial.id) {
            // await this.getAportaciones(nextProps);
            await this.setState({ loader: false });
        }
    }

    handleInput = ({ name, value }) => {
        this.setState({ [name]: value });
    }

    getAportaciones = async (props) => {
        let { historial } = props;
        await authentication.get(`historial/${historial.id}/aportacion`)
        .then(async res => {
            await this.setState({ aportaciones: res.data ? res.data : [] });
        }).catch(err => console.log(err.message));
    }

    getSindicatos = async () => {
        await authentication.get('sindicato')
        .then(res => this.setState({ sindicatos: res.data }))
        .catch(err => console.log(err.message));
    }

    render() {

        let { sindicato_id, sindicatos, loader } = this.state;
 
        return (
            <Form className="row" loading={loader}>

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4">
                            <Select
                                fluid
                                placeholder="Select. Sindicato"
                                options={parseOptions(sindicatos, ['sel-type', '', 'Select. Sindicato'], ['id', 'id', 'nombre'])}
                                name="sindicato_id"
                                value={sindicato_id}
                                onChange={(e, obj) => this.handleInput(obj)}
                                disabled={!this.props.edit}
                            />
                        </div>
                        <div className="col-xs">
                            <Button color="green"
                                disabled={!sindicato_id}    
                            >
                                <Icon name="plus"/> Agregar
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-12">
                    <hr/>
                </div>

            </Form>
        )
    }

}
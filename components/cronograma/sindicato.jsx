import React, { Component } from 'react';
import { unujobs } from '../../services/apis';
import { Button, Form, Select, Icon } from 'semantic-ui-react';
import { parseOptions } from '../../services/utils';
import Show from '../show';


export default class Remuneracion extends Component
{


    state = {
        type_sindicatos: [],
        sindicatos: [],
        sindicato_id: "",
        loader: true,
    }


    componentDidMount = async () => {
        await this.getTypeSindicatos();
        await this.getSindicatos(this.props);
    }

    componentWillReceiveProps = async (nextProps) => {
        if (nextProps.historial && nextProps.historial.id != this.props.historial.id) {
            await this.getSindicatos(nextProps);
        }
    }

    handleInput = ({ name, value }) => {
        this.setState({ [name]: value });
    }

    getSindicatos = async (props) => {
        this.setState({ loader: true });
        let { historial } = props;
        await unujobs.get(`historial/${historial.id}/type_sindicato`)
        .then(async res => await this.setState({ sindicatos: res.data ? res.data : [] }))
        .catch(err => console.log(err.message));
        this.setState({ loader: false });
    }

    getTypeSindicatos = async () => {
        await unujobs.get('type_sindicato')
        .then(res => this.setState({ type_sindicatos: res.data }))
        .catch(err => console.log(err.message));
    }

    render() {

        let { sindicato_id, type_sindicatos, sindicatos, loader } = this.state;
 
        return (
            <Form className="row" loading={loader}>

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4">
                            <Select
                                fluid
                                placeholder="Select. Sindicato"
                                options={parseOptions(type_sindicatos, ['sel-type', '', 'Select. Sindicato'], ['id', 'id', 'nombre'])}
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

                {sindicatos.map((obj, index) => 
                <div className="col-md-4" key={`sindicato-${obj.id}`}>
                    <div className="row">
                            <div className="col-md-10">
                                <Button fluid>
                                    {obj.nombre} 
                                    <Show condicion={obj.porcentaje}>
                                        <span className="ml-2 badge badge-dark">%{obj.porcentaje}</span>
                                    </Show>
                                    <Show condicion={!obj.porcentaje}>
                                        <span className="ml-2 badge badge-dark">S./{obj.monto}</span>
                                    </Show>
                                </Button>
                            </div>    
                            <div className="col-md-2">
                                <Button color="red" fluid>
                                    <i className="fas fa-trash-alt"></i>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </Form>
        )
    }

}
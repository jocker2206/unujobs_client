import React, { Component } from 'react';
import { authentication } from '../../services/apis';
import { Button, Form, Select, Icon } from 'semantic-ui-react';
import { parseOptions } from '../../services/utils';


export default class Remuneracion extends Component
{


    state = {
        type_aportaciones: [],
        aportaciones: [],
        sindicato_id: "",
        loader: true,
    }


    componentDidMount = async () => {
        await this.getAportaciones(this.props);
        await this.getTypeAportaciones();
        await this.setState({ loader: false });
    }

    componentWillReceiveProps = async (nextProps) => {
        if (nextProps.historial && nextProps.historial.id != this.props.historial.id) {
            await this.getAportaciones(nextProps);
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

    getTypeAportaciones = async () => {
        await authentication.get('type_aportacion')
        .then(res => this.setState({ type_aportaciones: res.data }))
        .catch(err => console.log(err.message));
    }

    render() {

        let { aportaciones, sindicato_id, type_aportaciones, loader } = this.state;
 
        return (
            <Form className="row" loading={loader}>

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4">
                            <Select
                                fluid
                                placeholder="Select. Sindicato"
                                options={parseOptions(type_aportaciones, ['sel-type', '', 'Select. Sindicato'], ['id', 'id', 'descripcion'])}
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

                {aportaciones.map(obj => 
                    <div  key={`remuneracion-${obj.id}`}
                         className="col-md-3 mb-1"
                    >
                        <span className="text-danger">
                            {obj.type_aportacion && obj.type_aportacion.key}
                        </span>
                            .-
                        <span className="text-primary">
                            {obj.type_aportacion && obj.type_aportacion.descripcion}
                        </span>
                        <Form.Field>
                            <input type="number"
                                step="any" 
                                value={obj.monto}
                                disabled={!this.props.edit}
                            />
                        </Form.Field>
                    </div>
                )}
            </Form>
        )
    }

}
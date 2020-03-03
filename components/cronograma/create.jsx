import React, { Component } from 'react';
import Modal from '../modal';
import { Icon, Step } from 'semantic-ui-react'
import Show from '../show';
import configOptions from './configOptions';
import Cookies  from 'js-cookie';
import CreateCronograma from './createCronograma';
import ConfigBoletas from './configBoletas';


export default class Create extends Component
{

    state = {
        options: configOptions,
        group_current: "config",
        current: "create",
        payload: {}
    }

    componentDidMount = () => {
        this.getCurrentCookie();
    }


    getCurrentCookie = () => {
        let config_cronograma = Cookies.get('config_cronograma') ? JSON.parse(Cookies.get('config_cronograma')) : this.state;
        let { group_current, current, payload } = config_cronograma;
        this.setState({ group_current, current, payload });
    }

    setCurrentCookie = (payload = {}, next = "create") => {
        let { group_current } = this.state;
        let config_cronograma = {
            group_current: group_current,
            current: next,
            payload: payload
        };
        // set
        Cookies.set('config_cronograma', config_cronograma);
    }

    render() {

        let { group_current, current, options } = this.state;

        return (
            <Modal {...this.props}
                titulo={<span><Icon name="universal access" size="large"/>Asistente de creación de cronograma</span>}
                md="11"
            >
                <div className="card-body">
                    <Step.Group fluid>
                        {options.map(obj => 
                            <Show condicion={obj.group == group_current} key={obj.key}>
                                <Step completed={obj.completed}
                                    active={current == obj.key}
                                    disabled={current != obj.key}
                                >
                                    <Icon name={obj.icon}/>
                                    <Step.Content>
                                        <Step.Title>{obj.title}</Step.Title>
                                        <Step.Description>{obj.descripcion}</Step.Description>
                                    </Step.Content>
                                </Step>
                            </Show>
                        )}
                    </Step.Group>
                    {/* renderizar optiones */}
                    <Show condicion={current == 'create'}>
                        <CreateCronograma fireCookie={this.setCurrentCookie}/>
                    </Show>
                    <Show condicion={current == 'config_boleta'}>
                        <ConfigBoletas fireCookie={this.setCurrentCookie} payload={this.state.payload}/>
                    </Show>
                </div>
            </Modal>
        )
    }

}
import React, { Component } from 'react';
import Work from './work';
import Afectacion from './afectacion';
import Remuneracion from './remuneracion';
import Descuento from './descuento';
import Aportacion from './aportacion';
import { Tab } from 'semantic-ui-react'
import Obligacion from './obligacion';
import Sindicato from './sindicato';
import Detallado from './detallado';

export default class TabCronograma extends Component
{

    constructor(props) {
        super(props);
    }

    onSend = (e) => {
        if (typeof this.props.sentEnd == 'function') {
            this.props.sentEnd();
        }
    }

    updatedHistorial = async (newHistorial) => {
        if (typeof this.props.updatingHistorial == 'function') {
            await this.props.updatingHistorial(newHistorial);
        }
    }

    render() {

        let { loading, edit, send, total } = this.props;

        let styles = {
            border: '0px'
        }

        const panes = [
            { 
                menuItem: {key: 'info', icon: 'info circle', content: 'Datos Generales', disabled: edit }, 
                render: () => 
                    <Tab.Pane style={styles} loading={loading}>
                        <Work 
                            bancos={this.props.bancos}
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        />
                    </Tab.Pane> 
            },
            {
                menuItem: {key: 'afectacion', icon: 'cogs', content: 'Afectacion Presupuestal', disabled: edit },
                render: () => (
                    <Tab.Pane style={styles} loading={loading}>
                        <Afectacion
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        /> 
                    </Tab.Pane>
                )
            },
            {
                menuItem: {key: 'remuneracion', icon: 'dollar', content: 'Remuneraciones', disabled: edit },
                render: () => (
                    <Tab.Pane style={styles} loading={loading}>
                        <Remuneracion
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        /> 
                    </Tab.Pane>
                )
            },
            {
                menuItem: {key: 'descuento', icon: 'arrow down cart', content: 'Descuentos', disabled: edit },
                render: () => (
                    <Tab.Pane style={styles} loading={loading}>
                        <Descuento
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        /> 
                    </Tab.Pane>
                )
            },
            {
                menuItem: {key: 'detallado', icon: 'briefcase', content: 'Descuentos Detallados', disabled: edit },
                render: () => (
                    <Tab.Pane style={styles} loading={loading}>
                        <Detallado
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        /> 
                    </Tab.Pane>
                )
            },
            {
                menuItem: {key: 'obligacion', icon: 'balance scale', content: 'Obligaciones Judicial', disabled: edit },
                render: () => (
                    <Tab.Pane style={styles} loading={loading}>
                        <Obligacion
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        /> 
                    </Tab.Pane>
                )
            },
            {
                menuItem: {key: 'sindicato', icon: 'users', content: 'Sindicatos', disabled: edit },
                render: () => (
                    <Tab.Pane style={styles} loading={loading}>
                        <Sindicato
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        /> 
                    </Tab.Pane>
                )
            },
            {
                menuItem: {key: 'aportacion', icon: 'certificate', content: 'Aportes Empleador', disabled: edit },
                render: () => (
                    <Tab.Pane style={styles} loading={loading}>
                        <Aportacion
                            edit={this.props.edit}
                            historial={this.props.historial}
                            send={send}
                            total={total}
                            fireSent={this.onSend}
                            updatedHistorial={this.updatedHistorial}
                        /> 
                    </Tab.Pane>
                )
            }
        ];

        return <Tab panes={panes} menu={this.props.menu} className="w-100"/>

    }

}
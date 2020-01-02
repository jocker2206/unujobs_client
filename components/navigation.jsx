import React, { Component, Fragment } from 'react';
import SkullNavigation from './loaders/skullNavigation';
import Router from 'next/router';


const NavLink = ({ children, active = false, url = '/' }) => {
    return (
        <a className={`menu-link ${active ? 'active' : ''}`}
            href={url}
        >
            { children }
        </a>
    )
}


class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = { newOptions: [] }

        this.handleClick = this.handleClick.bind(this);
        this.ActiveChildren = this.ActiveChildren.bind(this);
    }


    componentWillReceiveProps(newProps) {
        this.setState((state, props) => ({
            newOptions: props.options
        }));
    }


    handleClick(id, e) {
        this.setState(async (state, props) => {
            let newOptions = await state.newOptions.filter(async opt => {
                let isActive = opt.id == id || props.current == `/${opt.url}` ? true : false;
                let isParent = opt.modulos && opt.modulos.length > 0;
                // actulizamos el active de las opciones
                opt.active = isActive;
                // verificamos que tengan hijos y si el padre esta activo
                if (isActive && isParent) {
                    // actualizamos los toggles de los padres
                    opt.toggle = !opt.toggle;
                }else {
                    // desactivamos los toggles de los padres
                    opt.toggle = false;
                }
                // devolvemos una nueva options modificada
                return e;   
            });

            return { options: newOptions };
        });
    }

    async ActiveChildren(childID, index, e) {
        let option = this.state.newOptions[index];
        await option.modulos.map(ch => {
            let isActive = ch.id == childID;
            ch.active = isActive;
            return ch;
        });

        this.setState(state => {
            state.newOptions[index] = option;
            state.newOptions[index].toggle = true;
            return { newOptions: state.newOptions };
        });
    }

    render() {

        let { newOptions } = this.state;
        if (newOptions && newOptions.length > 0) {
            return newOptions.map((obj, index) => 
                <li className={`menu-item ${obj.toggle ? 'has-open' : 'has-child'}`}
                    key={`option-sidebar-${obj.id}`}
                >
                    <span style={{ cursor: 'pointer' }} className="menu-link" onClick={this.handleClick.bind(this, obj.id)}>
                      <span className={`menu-icon ${obj.icono}`}></span>
                      <span className="menu-text">{obj.name}</span>{" "}
                      <span className="badge badge-xs badge-warning">{obj.version}</span>
                    </span>
                    {
                        obj.modulos ? 
                        <ul className="menu">
                            <li className="menu-subhead">{obj.name}</li>
                            {obj.modulos.map( mod => 
                                <li className="menu-item" key={`childre-${mod.id}`}>
                                    <NavLink url={`/${mod.slug}`}>
                                        { mod.name }
                                    </NavLink>
                                </li>
                            )}
                        </ul> : null
                    }
                </li>  
            );
        } 

        return <SkullNavigation/>
    }

}


export default Navigation
import React, { Component } from 'react';

export default class Logo extends Component
{

    render() {
        return (
            <h3>
                <img src="/img/logo-unu.png" alt="logo" style={{ width: "30px", marginRight: "0.3em", borderRadius: '0.2em' }}/>
                UNU
            </h3>
        );
    }

}
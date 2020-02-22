import React, { Component } from 'react';
import { AUTH } from '../services/auth';


export default class Index extends Component
{

    static getInitialProps = async (ctx) => {
        return { 
            auth_token: AUTH(ctx)
        }
    }

    render() {
        return (
            <div>   
                Index
            </div>
        )
    }

}
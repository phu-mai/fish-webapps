﻿import * as React from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router';

export class ManageUsers extends React.Component<RouteComponentProps<{}>, any> {
    constructor(props: any){
        super(props)
    }

    render() {
        return (
            <div>
                <h3>Người dùng</h3>
            </div>
            );
    }
}
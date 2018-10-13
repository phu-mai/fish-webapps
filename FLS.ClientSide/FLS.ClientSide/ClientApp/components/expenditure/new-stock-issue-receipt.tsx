﻿import * as React from "react";
import PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router';
import { UnderConstructor } from "../shared/under-constructor";

export class NewStockIssueReceipt extends React.Component<RouteComponentProps<{}>, any> {
    constructor(props: any){
        super(props)
    }

    render() {
        return (
            <UnderConstructor /> ||
            <div>
                <h3>Tạo phiếu thu</h3>
            </div>
            );
    }
}
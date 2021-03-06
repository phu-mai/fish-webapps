﻿import * as React from "react";
import { CustomerModel } from "../../models/customer";
import { Modal, Button } from "react-bootstrap";
import { FormErrors } from "../shared/form-errors";
import PropTypes from 'prop-types';
import { LabeledInput, LabeledTextArea } from "../shared/input/labeled-input";
import { CustomerAPICaller } from "../../api-callers/customer";
import { _HString } from "../../handles/handles";

export class CustomerEdit extends React.Component<ICustomerProps, ICustomerState> {
    constructor(props: ICustomerProps){
        super(props)
        this.state = {
            isShow: props.isShow,
            model: props.model ? props.model : new CustomerModel(),
            errorList: {}
        }
    }
    static contextTypes = {
        ShowGlobalMessage: PropTypes.func,
        ShowGlobalMessageList: PropTypes.func,
    }
    componentDidMount() {
        //init comboboxes
        ////
    }
    componentWillReceiveProps(props) {
        // call load data by this.props.model.id from server
        ////
        this.setState({ model: props.model, isShow: props.isShow });
    }
    onCloseModal() {
        this.setState({ errorList: {} });
        if (this.props.onCloseModal)
            this.props.onCloseModal();
    }
    onFieldValueChange(model: any) {
        const nextState = {
            ...this.state,
            model: {
                ...this.state.model,
                [model.name]: model.value,
            }
        };
        this.setState(nextState);
    }
    private _validate() {
        var errors = {};
        if (_HString.IsNullOrEmpty(this.state.model.name)) {
            errors['name'] = 'Chưa nhập tên khách hàng';
        }
        return errors;
    }

    async onFormSubmit(e) {
        var errors = this._validate();
        if (Object.keys(errors).length > 0) {
            this.setState({
                errorList: errors
            });
            return;
        }
        if (this.props.isEdit) {
            let response = await CustomerAPICaller.Update(this.state.model);
            if (!response.hasError) {
                this.onCloseModal();
                // return succeed value to parent
                if (this.props.onFormAfterSubmit)
                    this.props.onFormAfterSubmit(true, this.state.model);
                this.context.ShowGlobalMessage('success', 'Cập nhật khách hàng thành công');
            } else {
                this.context.ShowGlobalMessageList('error', response.errors);
            }
        } else {
            let response = await CustomerAPICaller.Create(this.state.model);
            if (!response.hasError) {
                this.onCloseModal();
                // return succeed value to parent
                if (this.props.onFormAfterSubmit)
                    this.props.onFormAfterSubmit(this.state.model);
                this.context.ShowGlobalMessage('success', 'Tạo khách hàng thành công');
            } else {
                this.context.ShowGlobalMessageList('error', response.errors);
            }
        }
    }
    render() {
        return (
            <Modal show={this.state.isShow} onHide={this.onCloseModal.bind(this)}
                className="modal-medium"
                aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form-horizontal">
                        {this.state.errorList ? <FormErrors formErrors={this.state.errorList} /> : null}
                        {
                            this.props.isEdit ?
                                <LabeledInput
                                    name={'id'}
                                    value={this.state.model.id}
                                    readOnly={true}
                                    title={'Mã khách hàng'}
                                    placeHolder={'Mã khách hàng'} />
                                : null
                        }
                        <LabeledInput
                            name={'name'}
                            value={this.state.model.name}
                            title={'Tên khách hàng'}
                            placeHolder={'Tên khách hàng'}
                            error={this.state.errorList['name']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledInput
                            name={'address'}
                            value={this.state.model.address}
                            title={'Địa chỉ'}
                            placeHolder={'Địa chỉ'}
                            error={this.state.errorList['address']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledInput
                            name={'taxCode'}
                            value={this.state.model.taxCode}
                            title={'Mã số thuế'}
                            placeHolder={'Mã số thuế'}
                            error={this.state.errorList['taxCode']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledInput
                            name={'phone'}
                            value={this.state.model.phone}
                            title={'Điện thoại'}
                            placeHolder={'Điện thoại'}
                            error={this.state.errorList['phone']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledInput
                            name={'email'}
                            value={this.state.model.email}
                            title={'Email'}
                            placeHolder={'Email'}
                            error={this.state.errorList['email']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledInput
                            name={'website'}
                            value={this.state.model.website}
                            title={'Website'}
                            placeHolder={'Website'}
                            error={this.state.errorList['website']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledTextArea
                            rows={5}
                            name={'description'}
                            value={this.state.model.description}
                            title={'Mô tả'}
                            placeHolder={'Mô tả'}
                            error={this.state.errorList['description']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.onFormSubmit.bind(this)}>{this.props.isEdit ? 'Cập nhật' : 'Tạo'} </Button>
                    <Button onClick={this.onCloseModal.bind(this)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
            );
    }
}

interface ICustomerProps {
    isShow: boolean,
    onCloseModal: any,
    title: string,
    onFormAfterSubmit?: any,
    isEdit: boolean,
    model?: CustomerModel,
}

interface ICustomerState {
    isShow: boolean,
    model?: CustomerModel,
    errorList: any,
}
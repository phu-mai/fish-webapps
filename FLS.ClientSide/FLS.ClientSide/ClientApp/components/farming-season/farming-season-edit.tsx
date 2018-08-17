﻿import * as React from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { FarmingSeasonModel } from "../../models/farming-season";
import { Modal, Button, Alert } from "react-bootstrap";
import { FormErrors } from "../shared/FormErrors";
import { IdNameModel, ErrorItem } from "../../models/shared";
import * as Moment from 'moment';
import { LabeledInput, LabeledTextArea, LabeledSelect } from "../shared/input/labeled-input";
import LabeledSingleDatePicker from "../shared/date-time/labeled-single-date-picker";
import { FarmingSeasonAPICaller } from "../../api-callers/farming-season";
import { CacheAPI } from "../../api-callers/cache";
import { StringHandle } from "../../handles/string-handle";

interface IFarmingSeasonProps {
    isShow: boolean,
    onCloseModal: any,
    title: string,
    onFormAfterSubmit?: any,
    isEdit: boolean,
    model?: FarmingSeasonModel
    fishPonds: IdNameModel[]
}

interface IFarmingSeasonState {
    isShow: boolean,
    model?: FarmingSeasonModel,
    errorList: any,
    fishPonds: IdNameModel[],
}

export class FarmingSeasonEdit extends React.Component<IFarmingSeasonProps, IFarmingSeasonState> {
    constructor(props: IFarmingSeasonProps){
        super(props)
        this.state = {
            isShow: props.isShow,
            model: props.model ? props.model : new FarmingSeasonModel(),
            errorList: {},
            fishPonds: [],
        }
    }
    async componentWillMount() {
        //init comboboxes
    }

    componentWillReceiveProps(nextProps) {
        // call load data by this.props.model.id from server
        this.setState({ model: nextProps.model, isShow: nextProps.isShow, fishPonds: nextProps.fishPonds });
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
    onFieldDateChange(model: any) {
        let date = model.value as Moment.Moment;
        const nextState = {
            ...this.state,
            model: {
                ...this.state.model,
                [model.name]: date.toDate(),
            }
        };
        this.setState(nextState);
    }
    private _validate() {
        var errors = {};
        if (StringHandle.IsNullOrEmpty(this.state.model.name)) {
            errors['name'] = 'Chưa nhập tên đợt nuôi';
        }
        if (!this.state.model.fishPondId) {
            errors['fishPondId'] = 'Chưa chọn ao';
        }
        return errors;
    }

    async onFormSubmit() {
        var errors = this._validate();
        if (Object.keys(errors).length > 0) {
            this.setState({
                errorList: errors
            });
            return;
        }
        if (this.props.isEdit) {
            let request = await FarmingSeasonAPICaller.Update(this.state.model).then(response => {
                if (response.ok) {
                    this.setState({ errorList: {} });
                    this.onCloseModal();
                    // return succeed value to parent
                    if (this.props.onFormAfterSubmit)
                        this.props.onFormAfterSubmit(true, this.state.model);
                }
            });
        } else {
            let request = await FarmingSeasonAPICaller.Create(this.state.model).then(response => {
                if (response.ok) {
                    this.setState({ errorList: {} });
                    this.onCloseModal();
                    // return succeed value to parent
                    if (this.props.onFormAfterSubmit)
                        this.props.onFormAfterSubmit(this.state.model);
                }
            });
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
                    <div className="form-horizontal">
                        {this.state.errorList && <FormErrors formErrors={this.state.errorList} />}
                        {
                            this.props.isEdit ? 
                                <LabeledInput
                                    name={'id'}
                                    value={this.state.model.id}
                                    readOnly={true}
                                    title={'Mã đợt nuôi'}
                                    placeHolder={'Mã đợt nuôi'}/>
                            : null
                        }
                        <LabeledInput
                            name={'name'}
                            value={this.state.model.name}
                            title={'Tên đợt nuôi'}
                            placeHolder={'Tên đợt nuôi'}
                            error={this.state.errorList['name']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledSelect
                            options={this.state.fishPonds}
                            name={'fishPondId'}
                            value={this.state.model.fishPondId}
                            title={'Ao nuôi'}
                            placeHolder={'Ao nuôi'}
                            error={this.state.errorList['fishPondId']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledSingleDatePicker
                            name='startFarmDate'
                            date={Moment(this.state.model.startFarmDate)}
                            title={'Ngày bắt đầu'}
                            dateChange={this.onFieldDateChange.bind(this)} />
                        <LabeledSingleDatePicker
                            name='finishFarmDateExpected'
                            date={Moment(this.state.model.finishFarmDateExpected)}
                            title={'Ngày kết thúc dự kiến'}
                            dateChange={this.onFieldDateChange.bind(this)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.onFormSubmit.bind(this)}>{this.props.isEdit ? 'Cập nhật' : 'Tạo'} </Button>
                    <Button onClick={this.onCloseModal.bind(this)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
            );
    }
}

﻿import * as React from "react";
import { FishPondModel } from "../../models/fish-pond";
import { Modal, Button } from "react-bootstrap";
import { FormErrors } from "../shared/form-errors";
import PropTypes from 'prop-types';
import { LabeledInput, LabeledSelect } from "../shared/input/labeled-input";
import { FishPondAPICaller } from "../../api-callers/fish-pond";
import { CacheAPI } from "../../api-callers/cache";
import { _HString, _HNumber } from "../../handles/handles";

interface IFishPondProps {
    isShow: boolean,
    onCloseModal: any,
    title: string,
    onFormAfterSubmit?: any,
    isEdit: boolean,
    model?: FishPondModel
    farmRegions: any,
}

interface IFishPondState {
    isShow: boolean,
    model?: FishPondModel,
    errorList: any,
    farmRegions: any,
    warehouses: any,
    isDisable: boolean,
    warehousesFilter: any
}

export class FishPondEdit extends React.Component<IFishPondProps, IFishPondState> {
    constructor(props: IFishPondProps) {
        super(props)
        this.state = {
            isShow: props.isShow,
            model: props.model ? props.model : new FishPondModel(),
            errorList: {},
            farmRegions: [],
            warehouses: [],
            warehousesFilter: [],
            isDisable: true
        }
    }

    static contextTypes = {
        ShowGlobalMessage: PropTypes.func,
        ShowGlobalMessageList: PropTypes.func,
    }

    async componentWillMount() {
        var warehouses = await CacheAPI.Warehouse();
        this.setState({ warehouses: warehouses.data});
    }
   
    componentWillReceiveProps(nextProps) {
        this.setState({ model: nextProps.model, isShow: nextProps.isShow, farmRegions: nextProps.farmRegions });
        let { model } = nextProps;
        if (model.farmRegionId > 0) {
            let { warehouses } = this.state;
            let warehousesByFarmRegion = warehouses.filter(function (item) {
                return item.parentId == model.farmRegionId;
            });
            this.setState({ warehousesFilter: warehousesByFarmRegion, isDisable: false });
        }
        else {
            this.setState({ warehousesFilter: [], isDisable: true });
        }  
    }

    componentWillUpdate(nextProps, nextState) {
        console.log("componentWillUpdate");
        console.log("nextProps: " + JSON.stringify(nextProps.model));
        console.log("nextState: " + JSON.stringify(nextState.model));
       // this.setState({ model: nextState.model, isShow: nextState.isShow, farmRegions: nextState.farmRegions });
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
        if (model.name == "farmRegionId") {
            if (Number(model.value) > 0) {
                let { warehouses } = this.state;
                let warehousesByFarmRegion = warehouses.filter(function (item) {
                    return item.parentId == model.value;
                });
                this.setState({ warehousesFilter: warehousesByFarmRegion, isDisable: false });
            }
            else {
                this.setState({ warehousesFilter: [], isDisable: true });
            }
        }
    }
    onEdgeValueChange(model) {
        const nextState = {
            ...this.state,
            model: {
                ...this.state.model,
                [model.name]: model.value,
            }
        };
        nextState.model.waterSurfaceArea = _HNumber.Sum(nextState.model.a, nextState.model.c) * _HNumber.Sum(nextState.model.b, nextState.model.d) / 4;
        this.setState(nextState);
    }
    resetStateWithUpdates(stateUpdates = {}) {
        this.setState({ ...this.state, ...stateUpdates });
    }
    //private _validate() {
    //    var errors = {};
    //    if (_HString.IsNullOrEmpty(this.state.model.name)) {
    //        errors['name'] = 'Chưa nhập ao nuôi';
    //    }
    //    if (!this.state.model.farmRegionId) {
    //        errors['farmRegionId'] = 'Chưa chọn khu vực nuôi';
    //    }
    //    if (!this.state.model.defaultWarehouseId) {
    //        errors['defaultWarehouseId'] = 'Chưa chọn kho';
    //    }
    //    return errors;
    //}

    async onFormSubmit() {
        //var errors = this._validate();
        //if (Object.keys(errors).length > 0) {
        //    this.setState({
        //        errorList: errors
        //    });
        //    return;
        //}

        let { model } = this.state;
        if (this.props.isEdit) {
            let response = await FishPondAPICaller.Update(model);
            if (!response.hasError) {
                this.onCloseModal();
                // return succeed value to parent
                if (response.data > 0) {
                    if (this.props.onFormAfterSubmit)
                        this.props.onFormAfterSubmit(true, this.state.model);
                    this.context.ShowGlobalMessage('success', 'Cập nhật ao nuôi thành công');
                } else {

                    this.context.ShowGlobalMessage('error', 'Có lỗi trong quá trình cập nhật');
                }
            } else {
                this.context.ShowGlobalMessageList('error', response.errors);
                this.resetStateWithUpdates({ model });
            }

        } else {
            let response = await FishPondAPICaller.Create(model);
            if (!response.hasError) {
                this.onCloseModal();
                // return succeed value to parent
                if (response.data > 0) {
                    if (this.props.onFormAfterSubmit)
                        this.props.onFormAfterSubmit(this.state.model);
                    this.context.ShowGlobalMessage('success', 'Tạo ao nuôi thành công');
                } else {
                    this.context.ShowGlobalMessage('error', 'Có lỗi trong quá trình cập nhật');
                }
            } else {
                this.context.ShowGlobalMessageList('error', response.errors);
                this.resetStateWithUpdates({ model });
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
                    <div className="form-horizontal">
                        {this.state.errorList && <FormErrors formErrors={this.state.errorList} />}
                        {
                            this.props.isEdit ?
                                <LabeledInput
                                    name={'id'}
                                    value={this.state.model.id}
                                    readOnly={true}
                                    title={'Mã ao'}
                                    placeHolder={'Mã ao nuôi'} />
                                : null
                        }
                        <LabeledInput
                            name={'name'}
                            value={this.state.model.name}
                            title={'Tên ao'}
                            placeHolder={'Tên ao nuôi'}
                            error={this.state.errorList['name']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledSelect
                            options={this.state.farmRegions}
                            name={'farmRegionId'}
                            value={this.state.model.farmRegionId}
                            title={'Chọn khu vực nuôi'}
                            placeHolder={'Khu vực nuôi'}
                            error={this.state.errorList['farmRegionId']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledSelect
                            options={this.state.warehousesFilter}
                            name={'defaultWarehouseId'}
                            value={this.state.model.defaultWarehouseId}
                            title={'Kho'}
                            placeHolder={'Chọn kho'}
                            disabled={this.state.isDisable}
                            error={this.state.errorList['defaultWarehouseId']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledInput
                            inputType={'number'}
                            name={'a'}
                            value={this.state.model.a}
                            title={'A (m)'}
                            placeHolder={'A'}
                            error={this.state.errorList['a']}
                            valueChange={this.onEdgeValueChange.bind(this)} />
                        <LabeledInput
                            inputType={'number'}
                            name={'b'}
                            value={this.state.model.b}
                            title={'B (m)'}
                            placeHolder={'B'}
                            error={this.state.errorList['b']}
                            valueChange={this.onEdgeValueChange.bind(this)} />
                        <LabeledInput
                            inputType={'number'}
                            name={'c'}
                            value={this.state.model.c}
                            title={'C (m)'}
                            placeHolder={'C'}
                            error={this.state.errorList['c']}
                            valueChange={this.onEdgeValueChange.bind(this)} />
                        <LabeledInput
                            inputType={'number'}
                            name={'d'}
                            value={this.state.model.d}
                            title={'D (m)'}
                            placeHolder={'D'}
                            error={this.state.errorList['d']}
                            valueChange={this.onEdgeValueChange.bind(this)} />
                        <LabeledInput
                            inputType={'number'}
                            name={'waterSurfaceArea'}
                            value={this.state.model.waterSurfaceArea}
                            title={'Diện tích mặt nước (m2)'}
                            placeHolder={'Diện tích mặt nước'}
                            error={this.state.errorList['waterSurfaceArea']}
                            valueChange={this.onFieldValueChange.bind(this)} />
                        <LabeledInput
                            inputType={'number'}
                            name={'depth'}
                            value={this.state.model.depth}
                            title={'Độ sâu'}
                            placeHolder={'Độ sâu'}
                            error={this.state.errorList['depth']}
                            valueChange={this.onFieldValueChange.bind(this)} />
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


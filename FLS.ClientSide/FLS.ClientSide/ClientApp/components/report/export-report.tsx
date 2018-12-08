﻿import * as React from "react";
import * as Moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { LabeledSelect } from "../shared/input/labeled-input";
import { ReportFarmingSeasonHistoryStockRequest, ReportFarmingSeasonHistoryStock } from "../../models/report";
import { ReportAPICaller } from "../../api-callers/report";

interface ExportReportStates {
    request: ReportFarmingSeasonHistoryStockRequest,
    model: ThisModel[],
    isLoading: boolean,
}
class ThisModel {

    childs: ReportFarmingSeasonHistoryStock[]
}
export class ExportReports extends React.Component<RouteComponentProps<{}>, ExportReportStates> {
    constructor(props: any) {
        super(props)
        let request = new ReportFarmingSeasonHistoryStockRequest();
        request.farmingSeasonId = 1;
        this.state = {
            request,
            model: [],
            isLoading: false,
        }
    }
    static contextTypes = {
        ShowGlobalMessage: React.PropTypes.func,
        ShowGlobalMessageList: React.PropTypes.func,
    }
    componentDidMount() {

    }
    onDocketFieldChange(model: any) {
        //const nextState = {
        //    ...this.state,
        //    releaseDocket: {
        //        ...this.state.releaseDocket,
        //        [model.name]: model.value,
        //    }
        //};
        //this.setState(nextState);
    }
    onReceiveDocketDateChange(evt) {
        let startDate = evt.startDate as Moment.Moment;
        let endDate = evt.endDate as Moment.Moment;
        debugger
        //let releaseDocket = this.state.releaseDocket;
        //releaseDocket[evt.name] = date;
        //this.setState({ releaseDocket });
    }

    async GetReport() {
        let { request } = this.state;
        // validate request

        // lấy dữ liệu
        this.setState({ isLoading: true });
        let result = await ReportAPICaller.GetFarmingSeasonHistoryStock(request);
        if (result.hasError) {
            this.context.ShowGlobalMessageList('error', result.errors);
            this.setState({ model: [], isLoading: false });
        }
        else {
            this.setState({ model: result.data, isLoading: false });
            console.log(result.data)
        }
    }
    ExportExcel() {
        alert("chưa làm");
    }
    //Test(list: ReportFarmingSeasonHistoryStock[]): ReportFarmingSeasonHistoryStock[]
    //{
    //    let newList  = [];
    //    list.map(item => {
    //        var exist = newList.find(i => i.id == item.productSubgroupId);
    //        if (exist) {
    //            exist.childs.push(item);
    //        } else {
    //            exist ;
    //            exist.
                
    //            exist.childs.Add(item);
    //            newList.Add(exist);
    //        }
    //        else {
    //            exist.childs.Add(item);
    //        }
    //    });
    //    return newList;
    //}
    private renderTable(models: any) {
        return (
            <table className="table-responsive table table-striped table-hover border">
                <thead>
                    <tr>
                        <td colSpan={7}><strong>Ao số 1 - Đợt 01 từ 15/03/2018 đến 30/09/2018 - Ngày thả: 25/0/2018 05:30</strong></td>
                    </tr>
                    <tr className="text-center">
                        <td>STT</td>
                        <td>Mã sản phẩm</td>
                        <td>Tên sản phẩm</td>
                        <td>ĐVT</td>
                        <td>Số lượng</td>
                        <td>Đơn giá BQ</td>
                        <td>Thành tiền</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={7}><strong>Nhóm hàng: Cá giống</strong></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td className="text-center">1050068588</td>
                        <td className="text-center">Cá basa</td>
                        <td className="text-center">con</td>
                        <td className="text-right">6534534</td>
                        <td className="text-right">31.720</td>
                        <td className="text-right">14235345,56565</td>
                    </tr>
                    <tr>
                        <td colSpan={7}><strong>Nhóm hàng: Thuốc trung hòa</strong></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td className="text-center">645764567</td>
                        <td className="text-center">Muối</td>
                        <td className="text-center">Kg</td>
                        <td className="text-right">40</td>
                        <td className="text-right">90.56767</td>
                        <td className="text-right">6457576765767</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td className="text-center">756756776</td>
                        <td className="text-center">Final</td>
                        <td className="text-center">Lít</td>
                        <td className="text-right">10</td>
                        <td className="text-right">33.5666</td>
                        <td className="text-right">4645.465475656</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td className="text-center">7567567567</td>
                        <td className="text-center">VTM C</td>
                        <td className="text-center">Bao</td>
                        <td className="text-right">10</td>
                        <td className="text-right">150.5767</td>
                        <td className="text-right">57576.868688</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>Tổng cộng</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td className="text-right">456588679.475686786</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    render() {
        let { ...state } = this.state;
        return (
            <div id="info" className="tab-pane fade in active">
                {state.isLoading == true ? <div className="icon-loading"></div> : null}
                <div className="panel panel-info">
                    <div className="panel-body">
                        <div className="col-md-4">
                            <LabeledSelect
                                name={'fishPondWarehouseId'}
                                value={0}
                                title={'Vùng nuôi'}
                                placeHolder={'Vùng nuôi'}
                                valueKey={'belongId'}
                                nameKey={'name'}
                                valueChange={this.onDocketFieldChange.bind(this)}
                                options={[]} />
                        </div>
                        <div className="col-md-4">
                            <LabeledSelect
                                name={'fishPondWarehouseId'}
                                value={0}
                                title={'Ao nuôi'}
                                placeHolder={'Ao nuôi'}
                                valueKey={'belongId'}
                                nameKey={'name'}
                                valueChange={this.onDocketFieldChange.bind(this)}
                                options={[]} />
                        </div>
                        <div className="col-md-4">
                            <LabeledSelect
                                name={'fishPondWarehouseId'}
                                value={0}
                                title={'Đợt nuôi'}
                                placeHolder={'Đợt nuôi'}
                                valueKey={'belongId'}
                                nameKey={'name'}
                                valueChange={this.onDocketFieldChange.bind(this)}
                                options={[]} />
                        </div>
                        <div className="col-md-4">
                            <LabeledSelect
                                name={'fishPondWarehouseId'}
                                value={0}
                                title={'Ngành hàng'}
                                placeHolder={'Ngành hàng'}
                                valueKey={'belongId'}
                                nameKey={'name'}
                                valueChange={this.onDocketFieldChange.bind(this)}
                                options={[]} />
                        </div>
                        <div className="col-md-4">
                            <LabeledSelect
                                name={'fishPondWarehouseId'}
                                value={0}
                                title={'Nhóm hàng'}
                                placeHolder={'Nhóm hàng'}
                                valueKey={'belongId'}
                                nameKey={'name'}
                                valueChange={this.onDocketFieldChange.bind(this)}
                                options={[]} />
                        </div>
                        <div className="col-md-4">
                            <LabeledSelect
                                name={'fishPondWarehouseId'}
                                value={0}
                                title={'Sản phẩm'}
                                placeHolder={'Sản phẩm'}
                                valueKey={'belongId'}
                                nameKey={'name'}
                                valueChange={this.onDocketFieldChange.bind(this)}
                                options={[]} />
                        </div>
                        <div className="col-md-4">
                            <label className="control-label min-w-140 float-left"></label>
                            <button className="btn btn-primary mg-r-15" onClick={() => this.GetReport()}>Xem báo cáo</button>
                            <button className="btn btn-default mg-r-15" onClick={() => this.ExportExcel()}>Xuất excel</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-sm-12'>
                        {this.renderTable(this.state.model)}
                    </div>
                </div>
            </div>
        );
    }
}
﻿import * as React from "react";
import { NavLink } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { PaginateModel, ResponseConsult } from "../../models/shared";
import Pagination from "react-js-pagination";
import PropTypes from 'prop-types';
import { StockReceiveDocketTypeModel } from "../../models/stock-receive-docket-type";
import { ButtonGroup, Glyphicon, Button } from "react-bootstrap";
import { StockReceiveDocketTypeEdit } from "./stock-receive-docket-type-edit";
import { StockReceiveDocketTypeAPICaller } from "../../api-callers/stock-receive-docket-type";
import { _HString } from "../../handles/handles";
import { EmptyTableMessage, IsSystem } from "../shared/view-only";
import { ConfirmButton } from "../shared/button/ConfirmButton";

export class StockReceiveDocketTypes extends React.Component<RouteComponentProps<{}>, StockReceiveDocketTypeState> {
    constructor(props: any) {
        super(props)
        this.state = {
            listStockReceiveDocketType: [],
            pagingModel: new PaginateModel(),
            searchKey: '',
            lastedSearchKey: undefined,
            selectedModel: new StockReceiveDocketTypeModel(),
            isTableLoading: true,
            editModalShow: false,
            editModalTitle: ''
        };
    }
    async componentWillMount() {
        await this.onPageChange(1, true);
    }
    static contextTypes = {
        ShowGlobalMessage: PropTypes.func,
        ShowGlobalMessageList: PropTypes.PropTypes.func,
    }
    async loadData(page: number, newSearch: boolean) {
        let keySearch = this.state.lastedSearchKey;
        if (newSearch)
            keySearch = this.state.searchKey;

        return await StockReceiveDocketTypeAPICaller.GetList({
            page: page,
            pageSize: this.state.pagingModel.pageSize,
            key: keySearch,
            filters: []
        });
    }
    async onPageChange(page: any, newSearch: boolean) {
        try {
            this.setState({ isTableLoading: true });
            var result = await this.loadData(page, newSearch) as ResponseConsult;
            if (!result) { return; }
            if (result.hasError) {
                this.context.ShowGlobalMessageList('error', result.errors);
            } else {
                var paging = new PaginateModel();
                paging.currentPage = result.data.currentPage;
                paging.totalItems = result.data.totalItems;
                this.setState({ listStockReceiveDocketType: result.data.items, pagingModel: paging });
                if (newSearch)
                    this.setState({ lastedSearchKey: this.state.searchKey });
            }
            if (result.hasWarning) {
                this.context.ShowGlobalMessageList('warning', result.warnings);
            }
        } finally {
            this.setState({ isTableLoading: false });
        }
    }
    async onDelete(id: number) {
        let result = await StockReceiveDocketTypeAPICaller.Delete(id);
        if (!result) { return; }
        if (result.hasError) {
            this.context.ShowGlobalMessageList('error', result.errors);
        } else if (result.data == true) {
            this.context.ShowGlobalMessage('success', 'Xóa loại phiếu nhập thành công');
            this.onPageChange(1, true);
        } else {
            this.context.ShowGlobalMessage('error', 'Có lỗi trong quá trình xóa dữ liệu');
        }
        if (result.hasWarning) {
            this.context.ShowGlobalMessageList('warning', result.warnings);
        }
    }
    onFormAfterSubmit(isSuccess, model) {
        if (isSuccess)
            this.onPageChange(this.state.pagingModel.currentPage, false)
    }
    onOpenEdit(model: StockReceiveDocketTypeModel) {
        if (model.id > 0) {
            this.setState({ editModalShow: true, editModalTitle: 'Chỉnh sửa loại phiếu nhập', selectedModel: model });
        }
        else
            this.setState({ editModalShow: true, editModalTitle: 'Tạo loại phiếu nhập', selectedModel: new StockReceiveDocketTypeModel()});
    }
    onCloseEdit() {
        this.setState({ editModalShow: false });
    }
    onSearchKeyChange(e) {
        this.setState({ searchKey: e.target.value});
    }
    onSearchKeyPress(e) {
        if (e.charCode == 13) {
            this.onPageChange(1, true);
        }
    }

    render() {
        let dataTable = this.renderTable(this.state.listStockReceiveDocketType);
        let renderPaging = this.state.listStockReceiveDocketType.length > 0 ? this.renderPaging() : null;
        let lastedSearchKey = _HString.IsNullOrEmpty(this.state.lastedSearchKey) ? "Tất cả" : this.state.lastedSearchKey;
        return (
            <div className="content-wapper">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/">Trang chủ</NavLink></li>
                    <li className="breadcrumb-item active" aria-current="page">Loại phiếu nhập</li>
                </ol>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="col-sm-8 mg-bt-15">
                            <div className="input-group">
                                <input type="text" className="form-control" name="search" placeholder="Tìm kiếm..." value={this.state.searchKey} onChange={this.onSearchKeyChange.bind(this)} onKeyPress={this.onSearchKeyPress.bind(this)} />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="button" onClick={() => this.onPageChange(1, true)}><span className="glyphicon glyphicon-search"></span></button>
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-4 mg-bt-15">
                            <div className="text-right">
                                
                                <Button
                                    bsStyle="primary"
                                    onClick={this.onOpenEdit.bind(this)}
                                >Thêm</Button>
                            </div>
                        </div>
                        {
                            this.state.lastedSearchKey == undefined ? null :
                                <div className="col-sm-12">
                                    <div className="alert alert-info text-center">
                                        Có {this.state.pagingModel.totalItems} kết quả cho <strong>{lastedSearchKey}</strong>
                                    </div>
                                </div>
                        }
                        <div className="col-sm-12">
                            <div className="table-responsive p-relative">
                                {dataTable}
                                {this.state.isTableLoading ? <div className="icon-loading"></div> : null}
                            </div>
                        </div>
                        {renderPaging}
                    </div>
                </div>
                <StockReceiveDocketTypeEdit
                    isShow={this.state.editModalShow}
                    onCloseModal={this.onCloseEdit.bind(this)}
                    title={this.state.editModalTitle}
                    isEdit={this.state.selectedModel.id > 0}
                    model={this.state.selectedModel}
                    onFormAfterSubmit={this.onFormAfterSubmit.bind(this)}
                />
            </div>
        );
    }

    private renderTable(models: StockReceiveDocketTypeModel[]) {
        
        return (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Mã loại</th>
                        <th>Tên loại</th>
                        <th>Duyệt</th>
                        <th>Cần phiếu chi</th>
                        <th className="th-sm-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        models.length == 0 ?
                            <EmptyTableMessage/> :
                            models.map(m =>
                                <tr key={m.id}>
                                    <td>{m.id}</td>
                                    <td>{m.name}</td>
                                    <td>Duyệt tự động</td>
                                    <td>{m.payslipNeeded ? 'Có': 'Không'}</td>
                                    <td className="text-right">
                                    { m.isSystem ? <IsSystem/> :
                                        <ButtonGroup>
                                            <Button bsStyle="default" className="btn-sm" onClick={() => this.onOpenEdit(m)}>
                                                <Glyphicon glyph="edit" /></Button>
                                                <ConfirmButton
                                                    bsStyle="warning"
                                                    className="btn-sm"
                                                    glyph='remove'
                                                    modalTitle='Xác nhận xóa loại phiếu nhập'
                                                    modalBodyContent={
                                                        <span>Xác nhận xóa loại phiếu nhập <strong>{m.name}</strong>?</span>
                                                    }
                                                    onClickYes={() => this.onDelete(m.id)} />
                                        </ButtonGroup>
                                    }
                                    </td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
        );
    }

    private renderPaging() {
        return (
                <div className="col-xs-12">
                    <Pagination
                        innerClass={'pagination mg-0'}
                        activePage={this.state.pagingModel.currentPage}
                        itemsCountPerPage={this.state.pagingModel.pageSize}
                        totalItemsCount={this.state.pagingModel.totalItems}
                        pageRangeDisplayed={this.state.pagingModel.pageRangeDisplayed}
                        onChange={this.onPageChange.bind(this)}
                    />
                </div>
        );
    }
}

interface StockReceiveDocketTypeState {
    listStockReceiveDocketType: StockReceiveDocketTypeModel[],
    pagingModel: PaginateModel,
    searchKey: string,
    lastedSearchKey: string,
    selectedModel: StockReceiveDocketTypeModel,
    isTableLoading: boolean,
    editModalShow: boolean,
    editModalTitle: string
}
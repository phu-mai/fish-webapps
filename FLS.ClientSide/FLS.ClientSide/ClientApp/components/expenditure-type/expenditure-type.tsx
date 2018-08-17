﻿import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { PaginateModel } from "../../models/shared";
import Pagination from "react-js-pagination";
import { ExpenditureTypeModel } from "../../models/expenditure-type";
import { ButtonGroup, Glyphicon, Button } from "react-bootstrap";
import { ExpenditureTypeEdit } from "./expenditure-type-edit";
import { ExpenditureTypeAPICaller } from "../../api-callers/expenditure-type";
import { Last } from "react-bootstrap/lib/Pagination";
import { StringHandle } from "../../handles/string-handle";

export class ExpenditureTypes extends React.Component<RouteComponentProps<{}>, ExpenditureTypeState> {
    constructor(props: any) {
        super(props)
        this.state = {
            listExpenditureType: [],
            pagingModel: new PaginateModel(),
            searchKey: '',
            lastedSearchKey: undefined,
            selectedModel: new ExpenditureTypeModel(),
            isTableLoading: true,
            editModalShow: false,
            editModalTitle: ''
        };
    }
    async componentWillMount() {
        await this.onPageChange(1, true);
    }
    async loadData(page: number, newSearch: boolean) {
        let keySearch = this.state.lastedSearchKey;
        if (newSearch)
            keySearch = this.state.searchKey;

        let request = await ExpenditureTypeAPICaller.GetList({
            page: page,
            pageSize: this.state.pagingModel.pageSize,
            key: keySearch,
            filters: []
        });
        if (request.ok)
            return (await request.json());
        else {
            //// raise error
            return null;
        }
    }
    async onPageChange(page: any, newSearch: boolean) {
        try {
            this.setState({ isTableLoading: true });
            var result = await this.loadData(page, newSearch);
            if (!result || !result.data) { return; }
            var paging = new PaginateModel();
            paging.currentPage = result.data.currentPage;
            paging.totalItems = result.data.totalItems;
            this.setState({ listExpenditureType: result.data.items, pagingModel: paging });
            if (newSearch)
                this.setState({ lastedSearchKey: this.state.searchKey });
        } finally {
            this.setState({ isTableLoading: false });
        }
    }
    async onDelete(id: number) {
        //// 
    }
    onFormAfterSubmit(isSuccess, model) {
        if (isSuccess)
            this.onPageChange(this.state.pagingModel.currentPage, false)
    }
    onOpenEdit(model: ExpenditureTypeModel) {
        if (model.id > 0) {
            this.setState({ editModalShow: true, editModalTitle: 'Chỉnh sửa loại thu chi', selectedModel: model });
        }
        else
            this.setState({ editModalShow: true, editModalTitle: 'Tạo loại thu chi', selectedModel: new ExpenditureTypeModel()});
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
        let dataTable = this.renderTable(this.state.listExpenditureType);
        let renderPaging = this.state.listExpenditureType.length > 0 ? this.renderPaging() : null;
        let lastedSearchKey = StringHandle.IsNullOrEmpty(this.state.lastedSearchKey) ? "Tất cả" : this.state.lastedSearchKey;
        return (
            <div className="content-wapper">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><NavLink to="/">Trang chủ</NavLink></li>
                                <li className="breadcrumb-item active" aria-current="page">Loại thu chi</li>
                            </ol>
                        </nav>
                    </div>
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
                            <button className="btn btn-default mg-r-15">Import</button>
                            <Button
                                bsStyle="primary"
                                onClick={this.onOpenEdit.bind(this)}
                            >Thêm</Button>
                        </div>
                    </div>
                </div>
                {
                    this.state.lastedSearchKey == undefined ? null :
                        <div className="row">
                            <div className="col-md-12">
                                <div className="alert alert-success text-center">
                                    Có {this.state.pagingModel.totalItems} kết quả cho <strong>{lastedSearchKey}</strong>
                                </div>
                            </div>
                        </div>
                }
                <div className="table-responsive p-relative">
                    {dataTable}
                    {this.state.isTableLoading ? <div className="icon-loading"></div> : null}
                </div>
                <div className="row">
                    {renderPaging}
                </div>
                <ExpenditureTypeEdit
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

    private renderTable(models: ExpenditureTypeModel[]) {
        
        return (
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Mã loại</th>
                        <th>Tên loại</th>
                        <th width="100px"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        models.length == 0 ?
                            <tr><td colSpan={10}>Không có dữ liệu!</td></tr> :
                            models.map(m =>
                                <tr key={m.id}>
                                    <td>{m.id}</td>
                                    <td>{m.name}</td>
                                    <td className="text-right">
                                        <ButtonGroup>
                                            <Button bsStyle="default" className="btn-sm" onClick={() => this.onOpenEdit(m)}>
                                                <Glyphicon glyph="edit" /></Button>
                                            <Button bsStyle="danger" className="btn-sm" onClick={() => this.onDelete(m.id)}>
                                                <Glyphicon glyph="remove" /></Button>
                                        </ButtonGroup>
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

interface ExpenditureTypeState {
    listExpenditureType: ExpenditureTypeModel[],
    pagingModel: PaginateModel,
    searchKey: string,
    lastedSearchKey: string,
    selectedModel: ExpenditureTypeModel,
    isTableLoading: boolean,
    editModalShow: boolean,
    editModalTitle: string
}
﻿import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { ProductGroupEdit } from "./product-group-edit";
import { Button, ButtonGroup, Glyphicon } from "react-bootstrap";
import { Content } from "react-bootstrap/lib/Tab";
import * as ReactDOM from "react-dom";
import Pagination from "react-js-pagination";
import { PaginateModel } from "../../models/shared";
import { ProductGroupModel } from "../../models/product-group";
import { StringHandle } from "../../handles/handles";
import { ProductGroupAPICaller } from "../../api-callers/product-group";

export class ProductGroups extends React.Component<RouteComponentProps<{}>, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            listProductUnit: [],
            pagingModel: new PaginateModel(),
            searchKey: '',
            lastedSearchKey: undefined,
            selectedModel: new ProductGroupModel(),
            isTableLoading: true,
            editModalShow: false,
            editModalTitle: ''
        };
    }
    async componentDidMount() {
        await this.onPageChange(1, true);
    }
    async loadData(page: number, newSearch: boolean) {
        let keySearch = this.state.lastedSearchKey;
        if (newSearch)
            keySearch = this.state.searchKey;

        let request = await ProductGroupAPICaller.GetList({
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
            this.setState({ listProductUnit: result.data.items, pagingModel: paging });
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
    onOpenEdit(id: number) {
        if (id > 0) {
            let list = this.state.listProductUnit as ProductGroupModel[];
            let model = list.find(pu => pu.id == id);
            if (!model) return;
            this.setState({ editModalShow: true, editModalTitle: 'Chỉnh sửa ngành hàng', selectedModel: model });
        }
        else
            this.setState({ editModalShow: true, editModalTitle: 'Tạo nhóm ngành hàng', selectedModel: new ProductGroupModel() });
    }
    onCloseEdit() {
        this.setState({ editModalShow: false });
    }
    onSearchKeyChange(e) {
        this.setState({ searchKey: e.target.value });
    }
    onSearchKeyPress(e) {
        if (e.charCode == 13) {
            this.onPageChange(1, true);
        }
    }

    render() {
        let dataTable = this.renderTable(this.state.listProductUnit);
        let renderPaging = this.state.listProductUnit.length > 0 ? this.renderPaging() : null;
        let lastedSearchKey = StringHandle.IsNullOrEmpty(this.state.lastedSearchKey) ? "Tất cả" : this.state.lastedSearchKey;
        return (
            <div className="content-wapper">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/">Trang chủ</NavLink></li>
                    <li className="breadcrumb-item active" aria-current="page">Ngành hàng</li>
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
                                <button className="btn btn-default mg-r-15">Import</button>
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
                <ProductGroupEdit
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

    private renderTable(groups: ProductGroupModel[]) {
        return (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Tên ngành hàng</th>
                        <th>Ghi chú</th>
                        <th className="th-sm-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        groups.length == 0 ?
                            <tr><td colSpan={4}>Không có dữ liệu!</td></tr>
                            :
                            groups.map(group =>
                                <tr key={group.id}>
                                    <td>{group.id}</td>
                                    <td>{group.name}</td>
                                    <td>{group.description}</td>
                                    <td className="text-right">
                                        <ButtonGroup>
                                            <Button bsStyle="default" className="btn-sm" onClick={() => this.onOpenEdit(group.id)}>
                                                <Glyphicon glyph="edit" /></Button>
                                            <Button bsStyle="warning" className="btn-sm" onClick={() => this.onDelete(group.id)}>
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
            <div>
                <div className="col-xs-8">
                    <Pagination
                        innerClass={'pagination mg-0'}
                        activePage={this.state.pagingModel.currentPage}
                        itemsCountPerPage={this.state.pagingModel.pageSize}
                        totalItemsCount={this.state.pagingModel.totalItems}
                        pageRangeDisplayed={this.state.pagingModel.pageRangeDisplayed}
                        onChange={this.onPageChange.bind(this)}
                    />
                </div>
                <div className="col-xs-4">
                    <div className="text-right">
                        <button className="btn btn-default">Export</button>
                    </div>
                </div>
            </div>
        );
    }
}


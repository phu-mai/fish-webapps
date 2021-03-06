import * as React from 'react';
import { FormatedInput } from './formated-input';

interface LabeledTextProps {
    title?: string,
    value?: any,
    className?: string,
    valueClassName?: string,
}
export class LabeledText extends React.PureComponent<LabeledTextProps> {
    constructor(props) {
        super(props);
    }
    render() {
        let { title, value, className, valueClassName } = this.props;
        className = className ? 'mg-bt-15 ' + className : 'mg-bt-15';
        return (
            <div className={className}>
                <label className="control-label min-w-140 float-left">{title}</label>
                <div className={valueClassName}>{value}</div>
            </div>
        );
    }
}

interface LabeledInputProps {
    name?: string,
    value?: Date | string | number,
    title?: string,
    inputType?: string,
    placeHolder?: string,
    required?: boolean,
    error?: string,
    readOnly?: boolean,
    disabled?: boolean,
    valueChange?: Function
}
interface LabeledInputState {
    name: string,
    value: string | number,
    title: string,
    inputType: string,
    placeHolder: string,
    required: boolean,
    error: string,
    readOnly: boolean,
    disabled?: boolean,
    model: ILabeledInputModel
}
interface ILabeledInputModel {
    name: string,
    value: string | number,
}
export class LabeledInput extends React.PureComponent<LabeledInputProps, LabeledInputState>{
    constructor(props) {
        super(props);
        let model = new Object as ILabeledInputModel;
        model.name = props.name;
        model.value = props.value;
        this.state = {
            name: props.name ? props.name : 'labeled-input',
            value: props.value ? props.value : '',
            title: props.title ? props.title : '',
            inputType: props.inputType ? props.inputType : 'text',
            placeHolder: props.placeHolder ? props.placeHolder : '',
            required: props.required ? props.required : false,
            error: props.error ? props.error : '',
            readOnly: props.readOnly ? props.readOnly : false,
            model: model,
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value ? nextProps.value : '',
            title: nextProps.title ? nextProps.title : '',
            error: nextProps.error ? nextProps.error : '',
            readOnly: nextProps.readOnly ? nextProps.readOnly : false
        });
    }
    formatErrorClass = () => {
        const errorClass = '';
        let error = this.state.error;
        return error && error.length > 0 ?
            errorClass + " has-error" :
            errorClass;
    };
    inputChange(e) {
        let model = this.state.model;
        if (this.state.inputType == 'number' || this.state.inputType == 'currency') {
            if (Number.isNaN(e.target.value))
                return;
            else model.value = Number.parseFloat(e.target.value);
        } else
            model.value = e.target.value;
        this.setState({ value: e.target.value, model: model });
        if (this.props.valueChange) this.props.valueChange(model);
    }
    formatedInputChange(m) {
        let model = this.state.model;
        model.value = m.value;
        this.setState({ value: m.value, model: model });
        if (this.props.valueChange) this.props.valueChange(model);
    }
    render() {
        let { name, inputType, value, required, placeHolder, readOnly } = this.state;
        let wrapClass = {
            className: this.state.title ? 'form-group-custom mg-bt-15' : ''
        };
        return (
            <div {...wrapClass}>
                <label className="control-label min-w-140 float-left">{this.state.title}</label>
                <div className={this.formatErrorClass()}>
                    {
                        inputType == 'number' || inputType == 'currency' ?
                            <FormatedInput
                                className="form-control"
                                type={inputType}
                                name={name}
                                value={value || ''}
                                required={required}
                                placeholder={placeHolder}
                                readOnly={readOnly}
                                onValueChange={(m) => this.formatedInputChange(m)} /> :
                            <input
                                className="form-control"
                                type={this.state.inputType}
                                name={this.state.name}
                                value={this.state.value || ''}
                                required={this.state.required}
                                onChange={this.inputChange.bind(this)}
                                placeholder={this.state.placeHolder}
                                readOnly={this.state.readOnly} />
                    }
                </div>
            </div>
        );
    }
}

interface LabeledTextAreaProps {
    rows: number;
}
interface LabeledTextAreaState {
    rows: number;
}
export class LabeledTextArea extends React.PureComponent<LabeledTextAreaProps & LabeledInputProps, LabeledTextAreaState & LabeledInputState>{
    constructor(props) {
        super(props);
        let model = new Object as ILabeledInputModel;
        model.name = props.name;
        model.value = props.value;
        this.state = {
            name: props.name ? props.name : 'labeled-text-area',
            value: props.value ? props.value : '',
            title: props.title ? props.title : '',
            inputType: props.inputType ? props.inputType : 'text',
            placeHolder: props.placeHolder ? props.placeHolder : '',
            required: props.required ? props.required : false,
            error: props.error ? props.error : '',
            readOnly: props.readOnly ? props.readOnly : false,
            rows: props.rows ? props.rows : 1,
            model: model,
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value ? nextProps.value : '',
            title: nextProps.title ? nextProps.title : '',
            error: nextProps.error ? nextProps.error : '',
            readOnly: nextProps.readOnly ? nextProps.readOnly : false
        });
    }
    formatErrorClass = () => {
        const errorClass = '';
        let error = this.state.error;
        return error && error.length > 0 ?
            errorClass + " has-error" :
            errorClass;
    };
    textChange(e) {
        let model = this.state.model;
        model.value = e.target.value;
        this.setState({ value: e.target.value, model: model });
        if (this.props.valueChange) this.props.valueChange(model);
    }
    render() {
        let wrapClass = {
            className: this.state.title ? 'form-group-custom mg-bt-15' : ''
        };
        return (
            <div {...wrapClass}>
                <label className="control-label min-w-140 float-left">{this.state.title}</label>
                <div className={this.formatErrorClass()}>
                    <textarea
                        className="form-control"
                        name={this.state.name}
                        value={this.state.value}
                        rows={this.state.rows}
                        required={this.state.required}
                        onChange={this.textChange.bind(this)}
                        placeholder={this.state.placeHolder}
                        readOnly={this.state.readOnly} />
                </div>
            </div>
        );
    }
}

interface LabeledSelectOption {
    idKey: string,
    valueKey: string
}
interface LabeledSelectProps {
    valueKey?: string,
    nameKey?: string,
    options?: any[]
}
interface LabeledSelectState {
    valueKey: string,
    nameKey: string,
    options: any[]
}
export class LabeledSelect extends React.PureComponent<LabeledSelectProps & LabeledInputProps, LabeledSelectState & LabeledInputState>{
    constructor(props) {
        super(props);
        let model = new Object as ILabeledInputModel;
        model.name = props.name;
        model.value = props.value;
        this.state = {
            name: props.name ? props.name : 'labeled-text-area',
            value: props.value ? props.value : '',
            title: props.title ? props.title : '',
            inputType: props.inputType ? props.inputType : 'text',
            placeHolder: props.placeHolder ? props.placeHolder : '',
            required: props.required ? props.required : false,
            error: props.error ? props.error : '',
            readOnly: props.readOnly ? props.readOnly : false,
            disabled: props.disabled ? props.disabled : false,
            valueKey: props.valueKey ? props.valueKey : 'id',
            nameKey: props.nameKey ? props.nameKey : 'name',
            options: props.options ? props.options : [],
            model: model,
        };
    }
    componentWillUpdate(nextProps) {
        this.setState({
            value: nextProps.value ? nextProps.value : '',
            title: nextProps.title ? nextProps.title : '',
            error: nextProps.error ? nextProps.error : '',
            disabled: nextProps.disabled ? nextProps.disabled : false,
            readOnly: nextProps.readOnly ? nextProps.readOnly : false
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            disabled: nextProps.disabled,
            value: nextProps.value,
            options: nextProps.options
        });
    }
    formatErrorClass = () => {
        const errorClass = '';
        let error = this.state.error;
        return error && error.length > 0 ?
            errorClass + " has-error" :
            errorClass;
    };
    valueChange(e) {
        let model = this.state.model;
        model.value = e.target.value;
        this.setState({ value: e.target.value, model: model });
        if (this.props.valueChange) this.props.valueChange(model);
    }
    render() {
        let disable = this.state.disabled ? { disabled: this.state.disabled } : null;
        let wrapClass = {
            className: this.state.title ? 'form-group-custom mg-bt-15' : ''
        };
        return (
            <div {...wrapClass}>
                <label className="control-label min-w-140 float-left">{this.state.title}</label>
                <div className={this.formatErrorClass()}>
                    <select
                        className="form-control"
                        name={this.state.name}
                        value={this.state.value}
                        onChange={this.valueChange.bind(this)}
                        placeholder={this.state.placeHolder}
                        readOnly={this.state.readOnly}
                        {...disable}>
                        <option value=''>- {this.state.placeHolder} -</option>
                        {this.state.options != null ?
                            this.state.options.map(opt => {
                                let disabled = opt[this.state.valueKey] == this.state.value ? true : false;
                                return (
                                    <option {...disabled} key={opt[this.state.valueKey]}
                                        value={opt[this.state.valueKey]}>{opt[this.state.nameKey]}
                                    </option>
                                );
                            }) : null
                        }
                    </select>
                </div>
            </div>
        );
    }
}


interface LabeledCheckBoxProps {
    name?: string,
    value?: boolean,
    title?: string,
    text?: string,
    error?: string,
    readOnly?: boolean,
    valueChange?: Function
}
interface LabeledCheckBoxState {
    name: string,
    value: boolean,
    title: string,
    text: string,
    error: string,
    readOnly: boolean,
    model: ILabeledCheckBoxModel
}
interface ILabeledCheckBoxModel {
    name: string,
    value: boolean,
}
export class LabeledCheckBox extends React.PureComponent<LabeledCheckBoxProps, LabeledCheckBoxState>{
    constructor(props) {
        super(props);
        let model = new Object as ILabeledCheckBoxModel;
        model.name = props.name;
        model.value = props.value;
        this.state = {
            name: props.name ? props.name : 'labeled-check',
            value: props.value ? props.value : false,
            title: props.title ? props.title : '',
            text: props.text ? props.text : '',
            error: props.error ? props.error : '',
            readOnly: props.readOnly ? props.readOnly : false,
            model: model,
        };
    }
    componentWillUpdate(nextProps) {
        this.setState({
            value: nextProps.value ? nextProps.value : '',
            title: nextProps.title ? nextProps.title : '',
            text: nextProps.text ? nextProps.text : '',
            error: nextProps.error ? nextProps.error : '',
            readOnly: nextProps.readOnly ? nextProps.readOnly : false
        });
    }
    formatErrorClass = () => {
        const errorClass = '';
        let error = this.state.error;
        return error && error.length > 0 ?
            errorClass + " has-error" :
            errorClass;
    };
    checkChange(e) {
        let model = this.state.model;
        model.value = e.target.checked;

        this.setState({ value: e.target.checked, model: model });
        if (this.props.valueChange) this.props.valueChange(model);
    }
    render() {
        let wrapClass = {
            className: this.state.title ? 'form-group-custom mg-bt-15' : ''
        };
        return (
            <div {...wrapClass}>
                <label className="control-label min-w-140 float-left">{this.state.title}</label>
                <div className={this.formatErrorClass()}>
                    <label>
                        <input
                            type="checkbox"
                            name={this.state.name}
                            onChange={this.checkChange.bind(this)}
                            readOnly={this.state.readOnly}
                            defaultChecked={this.state.value} />&nbsp;
                        {this.state.text}
                    </label>
                </div>
            </div>
        );
    }
}

interface IRadioGroupProps {
    name: string,
    type: string,
    selectedOptions: number,
    className?: string,
    disabled?: boolean,
    options: IOption[],
    handleOnChange: Function
}
interface IOption {
    value: string,
    label: string
}

export class RadioGroups extends React.PureComponent<IRadioGroupProps, {}> {
    constructor(props) {
        super(props)
    }
    onFieldValueChange(e) {
        const fieldName = e.target.name;
        let fieldValue = e.target.value;
        this.props.handleOnChange({ name: fieldName, value: fieldValue });
    }
    public render() {
        return (
            <div className="form-group-custom mg-bt-15">
                <label className="control-label min-w-140 float-left"></label>
                {this.props.options.map(opt => {
                    return (
                        <label className="radio-inline" key={opt.value}>
                            <input type={this.props.type}
                                checked={this.props.selectedOptions.toString() == opt.value ? true : false}
                                name={this.props.name}
                                value={opt.value}
                                onChange={this.onFieldValueChange.bind(this)}
                                id={this.props.name}
                                disabled={this.props.disabled} />
                            {opt.label}
                        </label>
                    );
                })}
            </div>
        );
    }
}
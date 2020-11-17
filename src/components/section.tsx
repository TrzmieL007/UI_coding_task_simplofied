import * as React from 'react';
import {connect} from 'react-redux';
import {setFieldValue} from '../redux/formStoreActions';
import {ConditionType, FieldType, FormInput, SelectOption, Validation, ValidationType, ValueType} from '../app-types';

interface SectionPropsInterface {
    label: string;
    input: Array<FormInput>;
    validation?: Array<Validation>;
}
interface SectionStateInterface {
    validation: { [name: string] : string };
    data : { [name: string] : string | boolean | number };
    options?: { [name:string] : Array<SelectOption> };
}

class SectionComponent extends React.Component<SectionPropsInterface, SectionStateInterface>{
    constructor(props: SectionPropsInterface) {
        super(props);
        let data : { [name: string] : string | boolean | number } = {};
        props.input.forEach((input: FormInput): void => {
            if(input.conditional) this.fieldRefs[props.input[input.conditional.fieldIndex].name] = React.createRef();
            data[input.name] = input.defaultValue || (input.valueType === ValueType.BOOLEAN ? false : input.valueType === ValueType.NUMBER ? 0 : "");
        });
        this.state = {
            data,
            validation : {}
        };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    fieldRefs : { [name:string] : React.RefObject<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement> } = {};
    handleOnChange(e : React.ChangeEvent){
        const target : EventTarget = e.target;
        const name : string = (target as HTMLInputElement).name;
        const value : string | number | boolean = (target as HTMLInputElement).type === 'radio' ? (target as HTMLInputElement).value === 'true' : (target as HTMLInputElement).type === 'number' ? parseInt((target as HTMLInputElement).value) : (target as HTMLInputElement).value;

        let validation : { [key: string]: string } = Object.assign({}, this.state.validation);
        if (this.state.validation[name]) delete validation[name];
        this.setState({
            data: Object.assign({}, this.state.data,{[name]: value}),
            validation
        }, () => {
            this.props.input.forEach((input: FormInput): void => {
                if(input.conditional && input.name === name) {
                    const inputField = this.fieldRefs[this.props.input[input.conditional.fieldIndex].name].current;
                    if (inputField){
                        switch(input.conditional.conditionType){
                            case ConditionType.HIDE_IF:
                                value === input.conditional.valueIs ? inputField.classList.remove("show") : inputField.classList.add("show")
                                break;
                            default:
                                value === input.conditional.valueIs ? inputField.classList.add("show") : inputField.classList.remove("show")
                        }
                    }
                }
            });
        });
    }
    render(): React.ReactElement {
        const defaultName : string = this.props.input[0].name;

        let fields : Array<React.ReactNode> = this.props.input.map((input: FormInput, i : number): React.ReactNode => {
            let field : React.ReactNode;
            let validators : Array<Validation> = this.props.validation ? this.props.validation.filter((v:Validation):boolean => v.inputIndex === i) : [];
            let min : number | string | undefined = ((validators && validators.find((v:Validation):boolean => v.validationType === ValidationType.MIN_VALUE)) || {}).condition;
            let max : number | string | undefined = ((validators && validators.find((v:Validation):boolean => v.validationType === ValidationType.MAX_VALUE)) || {}).condition;
            let maxLength : number | undefined = ((validators && validators.find((v:Validation):boolean => v.validationType === ValidationType.MAX_LENGTH)) || {}).condition as number;
            switch(input.fieldType){
                case FieldType.SELECT:
                    field = <select name={input.name} placeholder={input.placeholder}
                                    value={this.state.data[input.name].toString()} onChange={this.handleOnChange}>
                        {input.options &&
                            (typeof input.options === 'string' ? (this.state.options && this.state.options[input.name]) || [] : input.options).map((o:SelectOption):React.ReactNode =>
                            <option value={o.value.toString()} key={typeof o.id !== 'undefined' ? o.id : o.value.toString()}>{o.textValue}</option>)}
                    </select>;
                    break;
                case FieldType.TEXTAREA:
                    field = <textarea name={input.name} placeholder={input.placeholder}
                                      value={this.state.data[input.name].toString()} onChange={this.handleOnChange}
                                      className={input.className} maxLength={maxLength}
                    />;
                    break;
                default:
                    field = <input type={input.type} name={input.name} placeholder={input.placeholder}
                                   value={this.state.data[input.name].toString()} onChange={this.handleOnChange}
                                   className={input.className} min={min} max={max} maxLength={maxLength}
                    />;
            }
            if(input.prefix || input.sufix)
                return <>
                    {input.prefix}
                    {field}
                    {input.sufix}
                </>;
            return field;
        });

        return <section className={this.state.validation[defaultName] ? "error" : undefined}>
            <label htmlFor={defaultName}>{this.props.label}</label>
            <div>
                {fields}
            </div>
            {this.props.validation ? <span className="error">{this.state.validation[defaultName] || ""}</span> : <span/>}
        </section>;
    }

    componentDidMount() {
        this.props.input.forEach((input : FormInput):void => {
            if(typeof input.options === 'string') this.getTheData(input.options, input.name);
        })
    }
    getTheData(url:string, set: string):void {
        let that : SectionComponent = this;
        let handleEvent = function handleEvent(e:Event): void {
            let res : any;
            let err : any;
            try {
                //@ts-ignore
                res = JSON.parse(this.responseText);
            }catch(e){
                //@ts-ignore
                res = this.response;
            }
            switch(e.type) {
                case "load":
                    //@ts-ignore
                    if (this.status === 200 && !err)
                        that.setState({ data : Object.assign({},that.state.data, {[set] : res }) });
                    break;
                case "error":
                    alert('error getting data');
                    break;
            }
        };
        let xhr : XMLHttpRequest = new XMLHttpRequest();
        xhr.addEventListener("load", handleEvent);
        xhr.addEventListener("error", handleEvent);
        xhr.open('GET',url);
        xhr.send();
    }
}

export default connect(null,{ setFieldValue })(SectionComponent);
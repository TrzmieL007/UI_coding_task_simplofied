import * as React from 'react';
import {connect} from 'react-redux';
import {setFieldValue} from '../redux/formStoreActions';
import {ConditionType, FormInput, Validation} from '../app-types';

interface SectionPropsInterface {
    label: string;
    input: Array<FormInput>;
    validation?: Array<Validation>;
}
interface SectionStateInterface {
    validation: { [name: string] : string };
    data : { [name: string] : string | boolean | number };
}

class SectionComponent extends React.Component<SectionPropsInterface, SectionStateInterface>{
    constructor(props: SectionPropsInterface) {
        super(props);
        props.input.forEach((input: FormInput): void => {
            if(input.conditional) this.fieldRefs[props.input[input.conditional.fieldIndex].name] = React.createRef();
        });
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
            return <>

            </>;
        });

        return <section className={this.state.validation[defaultName] ? "error" : undefined}>
            <label htmlFor={defaultName}>{this.props.label}</label>
            <div>
                {fields}
            </div>
            {this.props.validation ? <span className="error">{this.state.validation[defaultName] || ""}</span> : <span/>}
        </section>;
    }
}

export default connect(null,{ setFieldValue })(SectionComponent);
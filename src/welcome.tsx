import {ChangeEvent, Component, ReactElement} from "react";
import * as React from "react";
import {connect} from "react-redux";
import {addEvent} from "./storeActions";

interface WelcomeState {
    name:string;
    email:string;
    validate:{[key:string]:string};
}
interface WelcomeProps {
    addEvent:(name:string,email:string)=>any;
    history: any;
}

class Welcome extends Component<WelcomeProps, WelcomeState> {
    constructor(props:any) {
        super(props);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.proceed = this.proceed.bind(this);
    }
    state : WelcomeState = { name: "", email: "", validate: {} };

    onChangeHandler(e:ChangeEvent): void {
        let validate : {[key:string]:string} = Object.assign({},this.state.validate);
        if(this.state.validate[(e.target as HTMLInputElement).name]) validate[(e.target as HTMLInputElement).name] = '';
        //@ts-ignore
        this.setState({ [(e.target as HTMLInputElement).name] : (e.target as HTMLInputElement).value, validate });
    }

    proceed(e : React.MouseEvent): void {
        if(!this.validate()) return;
        this.props.addEvent(this.state.name,this.state.email);
        this.props.history.push('add');
    }
    validate(): boolean {
        let validate : { [key:string] : string } = {};
        if(!/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i.test(this.state.email))
            validate.email = 'Wrong email format';
        if(!this.state.name.length)
            validate.name = 'You have to state your name';

        this.setState({ validate });
        return !Object.keys(validate).length;
    }

    render():ReactElement {
        return <div className="App">
            <header className="App-header">
                <div className="Container">Welcome</div>
            </header>
            <div className="Container">
                <article>
                    <header>
                        Your details:
                    </header>
                    <section>
                        <label htmlFor={"name"}>Name<span className="required"/></label>
                        <div>
                            <input name={"name"} type="text" placeholder={"John Doe"} onChange={this.onChangeHandler} value={this.state.name} required={true} />
                        </div>
                        <span className="error">{this.state.validate.name || ""}</span>
                    </section>
                    <section>
                        <label htmlFor={"email"}>Email<span className="required"/></label>
                        <div>
                            <input name={"email"} type="text" placeholder={"em@il.com"} onChange={this.onChangeHandler} value={this.state.email} required={true} />
                        </div>
                        <span className="error">{this.state.validate.email || ""}</span>
                    </section>
                </article>
                <button onClick={this.proceed}>Add event</button>
            </div>
        </div>;
    }
}

export default connect(null,{addEvent})(Welcome);
import * as React from 'react';
import './App.css';
import {Category, Coordinator} from "./data";

interface FormProps {
    Me: Coordinator;
    Coordinators: Array<Coordinator>;
    Categories: Array<Category>;
    history: any;
}
interface FromState {
    title: string,
    description: string,
    category_id: number,
    paid_event: boolean,
    event_fee: number,
    reward: number,
    date: string,
    time: string,
    duration: number,
    coordinator: StateCoordinator,
    validate: { [key:string] : string }
}
interface StateCoordinator {
    email: string,
    id: number,
}

export default class Form extends React.Component<FormProps,FromState> {
    constructor(props: FormProps){
        super(props);
        this.state = {
            title: "",
            description: "",
            category_id: 0,
            paid_event: false,
            event_fee: 0,
            reward: 0,
            date: "",
            time: "",// YYYY-MM-DDTHH:mm (example: 2018-01-19T15:15)
            duration: 0, // in seconds
            coordinator: {    // could be from props
                email: props.Me && props.Me.email,
                id: props.Me && props.Me.id,
            },
            validate: {}
        };
        this.eventFeeField = React.createRef();
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.publishEvent = this.publishEvent.bind(this);
    }
    eventFeeField : React.RefObject<HTMLInputElement>;
    onChangeHandler(e: React.ChangeEvent){
        const target : EventTarget = e.target;
        const name : string = (target as HTMLInputElement).name;
        const value : string | number | boolean = (target as HTMLInputElement).type === 'radio' ? (target as HTMLInputElement).value === 'true' : /(duration)|(fee)|(reward)/.test(name) ? parseInt((target as HTMLInputElement).value) : (target as HTMLInputElement).value;

        if(/^coordinator/.test(name)) {
            let coordinator : StateCoordinator = Object.assign({}, this.state.coordinator, {[name.replace(/^coordinator_/,"")]: value});
            if(name === "coordinator_id") {
                let coord : Coordinator | void = this.props.Coordinators.find((c: Coordinator): boolean => c.id.toString() === value);
                if(coord) coordinator.email = coord.email;
            }
            this.setState({
                coordinator
            });
        }else {
            let validate: { [key: string]: string } = Object.assign({}, this.state.validate);
            if (this.state.validate[name]) validate[name] = '';
            //@ts-ignore
            this.setState({[name]: value, validate}, () => {
                if (/^paid_event/.test(name)) {
                    const eventFeeField = this.eventFeeField.current;
                    if (eventFeeField) this.state.paid_event ? eventFeeField.classList.add("show") : eventFeeField.classList.remove("show")
                }
            });
        }
    }
    componentDidMount() {
        if(!this.props.Me.name || !this.props.Me.email) this.props.history.push('');
    }

    render() {
        return <div className="App">
            <header className="App-header">
                <div className="Container">New event</div>
            </header>
            <form className="Container" id={"codingTaskForm"} onSubmit={this.publishEvent}>
                <article>
                    <header>
                        About
                    </header>
                    <section className={this.state.validate.title ? "error" : undefined}>
                        <label htmlFor={"title"}>Title<span className="required"/></label>
                        <div>
                            <input name={"title"} type="text" placeholder={"Make it short and clear"} onChange={this.onChangeHandler} value={this.state.title} required={true} />
                        </div>
                        <span className="error">{this.state.validate.title || ""}</span>
                    </section>
                    <section className={this.state.validate.description ? "error" : undefined}>
                        <label htmlFor={"description"}>Description<span className="required"/></label>
                        <div>
                            <textarea name={"description"} onChange={this.onChangeHandler} value={this.state.description} placeholder={"Write about your event, be reative"} maxLength={140} required={true} />
                            <span className={"charactersCount"}>{this.state.description.length}/140</span>
                        </div>
                        <span className="error">{this.state.validate.description || ""}</span>
                    </section>
                    <section>
                        <label htmlFor={"category_id"}>Category</label>
                        <div>
                            <select name={"category_id"} onChange={this.onChangeHandler} placeholder={"Select category"} value={this.state.category_id}>
                                {this.props.Categories.map((c:Category):React.ReactElement =>
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                )}
                            </select>
                        </div>
                        <span/>
                    </section>
                    <section className={this.state.validate.event_fee ? "error" : undefined}>
                        <label htmlFor={"event_fee"}>Payment</label>
                        <div>
                            <input type="radio" name={"paid_event"} value={"false"} checked={!this.state.paid_event} onChange={this.onChangeHandler} />
                            <label className={"RadioLabel"} htmlFor={"paid_event"} onClick={function(){
                                let f : HTMLInputElement | null = document.querySelector('[name="paid_event"][value="false"]');
                                if(f) f.click();
                            }}>Free event</label>
                            <input type="radio" name={"paid_event"} value={"true"} checked={this.state.paid_event} onChange={this.onChangeHandler} />
                            <label className={"RadioLabel"} htmlFor={"paid_event"} onClick={function(){
                                let f : HTMLInputElement | null = document.querySelector('[name="paid_event"][value="true"]');
                                if(f) f.click();
                            }}>Paid event</label>
                            <input type={"number"} name={"event_fee"} value={this.state.event_fee} onChange={this.onChangeHandler} placeholder={"Fee"} ref={this.eventFeeField} className={"narrow"} /><span>$</span>
                        </div>
                        <span className="error">{this.state.validate.event_fee || ""}</span>
                    </section>
                    <section>
                        <label htmlFor={"reward"}>Reward</label>
                        <div>
                            <input type="number" name={"reward"} placeholder={"Number"} onChange={this.onChangeHandler} value={this.state.reward} className={"narrow"} /> reward points for attendance
                        </div>
                        <span/>
                    </section>
                </article>
                <article>
                    <header>
                        Coordinator
                    </header>
                    <section>
                        <label htmlFor={"coordinator_id"}>Responsible<span className="required"/></label>
                        <div>
                            <select name={"coordinator_id"} onChange={this.onChangeHandler} placeholder={"Select category"} value={this.state.coordinator.id} required={true}>
                                <option value={this.props.Me.id}>Me - {this.props.Me.name+" "+this.props.Me.lastname}</option>
                                {this.props.Coordinators.map((c:Coordinator):React.ReactElement =>
                                    <option value={c.id} key={c.id}>{c.name+" "+c.lastname}</option>
                                )}
                            </select>
                        </div>
                        <span/>
                    </section>
                    <section className={this.state.validate.email ? "error" : undefined}>
                        <label htmlFor={"coordinator_email"}>Email</label>
                        <div>
                            <input readOnly={true} name={"coordinator_email"} type="text" placeholder={"Email"} value={this.state.coordinator.email} />
                        </div>
                        <span className="error">{this.state.validate.email || ""}</span>
                    </section>
                </article>
                <article>
                    <header>
                        When
                    </header>
                    <section className={this.state.validate.date ? "error" : undefined}>
                        <label htmlFor={"date"}>Starts on<span className="required"/></label>
                        <div>
                            <input type="date" name={"date"} placeholder={"dd/mm/yyyy"} min={new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()} onChange={this.onChangeHandler} value={this.state.date} className={"autoW"} required={true} /> at
                            <input type="time" name={"time"} placeholder={"--:--"} onChange={this.onChangeHandler} value={this.state.time} className={"narrow"} required={true} />
                        </div>
                        <span className="error">{this.state.validate.date || ""}</span>
                    </section>
                    <section>
                        <label htmlFor={"duration"}>Duration</label>
                        <div>
                            <input type="number" name={"duration"} placeholder={"Number"} onChange={this.onChangeHandler} value={this.state.duration} className={"narrow"} /> hour
                        </div>
                        <span className="error">{this.state.validate.duration || ""}</span>
                    </section>
                </article>
                <button onClick={this.publishEvent}>Publish event</button>
            </form>
        </div>;
    }

    publishEvent(e : any): void{
        if(e.preventDefault) e.preventDefault();
        if(!this.validate()) return;
        let data : any = Object.assign({},this.state);
        delete data.validate;
        data.date = data.date+"T"+data.time;
        delete data.time;
        data.duration = data.duration * 3600;
        data.event_fee = data.event_fee || 0;
        data.reward = data.reward || 0;
        console.log(data);
        this.props.history.push('success');
    }
    validate(): boolean {
        let validate : { [key:string] : string } = {};
        if(!/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i.test(this.state.coordinator.email))
            validate.email = 'Wrong email format';
        if(!this.state.title.length)
            validate.title = 'Supply the title';
        if(!this.state.description.length)
            validate.description = 'Give some description';
        if(!this.state.time.length)
            validate.date = 'You have to chose time';
        if(!this.state.date.length)
            validate.date = 'You have to chose date';
        else if(new Date(this.state.date+"T"+this.state.time) < new Date())
            validate.date = "The date has to be future date";
        if(this.state.paid_event && !this.state.event_fee)
            validate.event_fee = 'If event is paid it has to have price';
        if(!this.state.duration)
            validate.duration = "Events has to have duration";

        this.setState({ validate });
        return !Object.keys(validate).length;
    }
}
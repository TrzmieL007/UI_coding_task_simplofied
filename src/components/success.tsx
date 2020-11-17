import * as React from 'react';

const Success = () => {
    return <div className="App">
        <header className="App-header">
            <div className="Container">Creation Summary</div>
        </header>
        <div className="Container">
            <article className={"success"}>
                <header>Success</header>
                <section>Event has been created.</section>
            </article>
        </div>
    </div>;
}

export default Success;
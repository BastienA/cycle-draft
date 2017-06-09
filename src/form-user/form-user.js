/**
 * Created by bastien on 09/06/2017.
 */

import {html} from 'snabbdom-jsx';
import xs from 'xstream';


export const FormUser = (sources) => {


    const submit$ = sources.DOM.select('submit-new-user').events('click');


    const sendDataBack = 4;



    const vTree$ = xs.of(
        <form className="ui form">
            <div className="field">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name"/>
            </div>
            <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email"/>
            </div>
            <div className="field">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password"/>
            </div>
            <div className="field">
                <div className="ui checkbox">
                    <input type="checkbox"
                           name="terms"
                           id="terms"
                           tabIndex="0"
                           className="hidden"/>
                    <label htmlFor="terms">I agree with the terms and condition</label></div>
            </div>
            <button className="ui button submit-new-user" type="submit">Submit</button>
        </form>
    );

    return {
        DOM: vTree$
    };
};
import {html} from 'snabbdom-jsx';
import xs from 'xstream';
import {FormUser} from "./form-user/form-user";

export const Home = (sources) => {

    const form = FormUser(sources);

    const vtree$ = form.DOM.map(formValue => {return (
        <div>
            <span>Hello Other</span>
            {formValue}
        </div>
        )}
    );
    return {
        HTTP:  xs.empty(),
        storage:  xs.empty(),
        router: xs.empty(),
        DOM: vtree$
    }
};
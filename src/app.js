import {html} from 'snabbdom-jsx';
import {NewUser}from './new-user/new-user';
import xs from 'xstream';
import {Collection} from "./collection/collection";
import 'semantic-ui-css/semantic.css';
export function App(sources) {


    const toggle$ = sources.DOM.select('#checked').events('click')
        .map(ev => ev.target.checked)
        .startWith(false);

    const newUser = NewUser(sources);
    const newUserVDOM = newUser.DOM;
    const collection = Collection(sources);

    const merged$ = xs.combine(newUserVDOM, toggle$, collection.DOM);


    const vtree$ =
        merged$
            .map(
                ([user, toggle, collectionVTree]) => {
                    return (
                        <div className="ui container">
                            <span>My Awesome Cycle.js <br/>{toggle ? 'Toggled' : 'Not toggle' }</span>
                            <hr/>
                            <input type="checkbox" name="checked" id="checked"/> <i className="ticket icon"></i>
                            <hr/>
                            {user}
                            {collectionVTree}
                        </div>)
                });

    const http$ = xs.merge(newUser.HTTP, collection.HTTP);

    const sinks = {
        DOM: vtree$,
        HTTP: http$
    };
    return sinks
}

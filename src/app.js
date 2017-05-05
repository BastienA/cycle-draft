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
                        <div className="ui padded container">
                            <div className="ui grid">
                                <div className="sixteen wide column">
                                    <h1 className="ui header">My Awesome Cycle.js
                                        <div className="sub header">How do you like them apples?</div>
                                    </h1>
                                </div>
                                <div className="sixteen wide column">

                                    {user}
                                </div>
                                <div className="sixteen wide column">

                                    {collectionVTree}
                                </div>
                            </div>
                        </div>)
                });

    const http$ = xs.merge(newUser.HTTP, collection.HTTP);
    const storage$ = xs.merge(newUser.storage, collection.storage);
    const sinks = {
        DOM: vtree$,
        storage: storage$,
        HTTP: http$,
        router: collection.router
    };
    return sinks
}

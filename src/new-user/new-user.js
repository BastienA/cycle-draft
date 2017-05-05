/**
 * Created by bastien on 11/04/2017.
 */
import {html} from 'snabbdom-jsx';

export function NewUser(sources) {
    const clicks$ = sources.DOM.select('.get-random').events('click');
    const getRandomUser$ = clicks$.map(() => {
        const randomNumber = Math.round(Math.random() * 9) + 1;
        return {
            url: 'https://jsonplaceholder.typicode.com/users/' + String(randomNumber),
            category: 'users',
            method: 'GET'
        }
    });

    const user$ = sources.HTTP.select('users')
        .flatten()
        .map(res => res.body)
        .startWith(null);

    const vtree$ = user$.map(user => (
            <div>
                <button className="get-random">Get random user</button>
                <br/>
                {user ? (
                    <div><span>Name: {user.name}</span></div>
                ) : ''}
            </div>
        ));


    return {
        DOM: vtree$,
        user: user$,
        HTTP: getRandomUser$
    };
}
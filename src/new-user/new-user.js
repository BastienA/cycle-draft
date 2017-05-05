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

    const userStorage$ = sources.HTTP.select('users')
        .flatten()
        .map(res => res.body)
        .map(user => ({
            key: 'users-local',
            value: JSON.stringify(user)
        }));

    const vtree$ = sources
        .storage.local
        .getItem('users-local')
        .map(JSON.parse)
        .startWith(null)
        .map(user => (
            <div>
                <button className="get-random ui button">Get random user</button>
                <br/>
                {user ? (
                    <div className="ui card">
                        <div className="content">
                            <div className="header">{user.name}</div>
                            <div className="meta">{user.email}</div>
                            <div className="description">{user.company.catchPhrase}</div>
                        </div>
                    </div>
                ) : ''}
            </div>
        ));


    return {
        DOM: vtree$,
        storage: userStorage$,
        HTTP: getRandomUser$
    };
}
/**
 * Created by bastien on 05/05/2017.
 */

import {html} from 'snabbdom-jsx';
import xs from 'xstream'
export const Collection = (sources) => {

    const clickMovies$ = sources.DOM.select('.movies').events('click').map(() => 'movies');
    const clickTV$ = sources.DOM.select('.tvs').events('click').map(() => 'tvs');
    const clickAudio$ = sources.DOM.select('.audios').events('click').map(() => 'audios');
    const getCollection$ = xs.merge(clickMovies$, clickTV$, clickAudio$)
        .map(category => ({
            url: `http://54.72.215.193/api/metadata/${category}`,
            category: 'collection',
            method: 'GET'
        }));


    const collection$ = sources.HTTP.select('collection')
        .flatten()
        .map(res => res.body)
        .startWith([]);

    const vtree$ = collection$.map(collection => (
        <div>
            <div>
                <button className="movies">Movies</button>
                <button className="tvs">TV</button>
                <button className="audios">Audio</button>
            </div>
            <div>
                {collection.map(media => (
                    <span>{media.title}</span>
                ))}
            </div>
        </div>
    ));
    return {
        DOM: vtree$,
        HTTP: getCollection$
    }
};
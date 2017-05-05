/**
 * Created by bastien on 05/05/2017.
 */

import {html} from 'snabbdom-jsx';
import xs from 'xstream'
export const Collection = (sources) => {

    const clickMovies$ = sources.DOM.select('.movies').events('click').map(() => 'movies');
    const clickTV$ = sources.DOM.select('.tvs').events('click').map(() => 'tvs');
    const getCollection$ = xs.merge(clickMovies$, clickTV$)
        .map(category => ({
            url: `http://54.72.215.193/api/metadata/${category}`,
            category: 'collection',
            method: 'GET'
        }));


    const keyLocalStorage = 'metadata-local';
    const collectionStorage$ = sources.HTTP.select('collection')
        .flatten()
        .map(res => res.body)
        .map(collection => ({
            key: keyLocalStorage,
            value: JSON.stringify(collection)
        }));

    const collection$ = sources
        .storage.local
        .getItem(keyLocalStorage)
        .map(JSON.parse)
        .startWith([]);



    const vtree$ = collection$
        .map(collection => (
        <div>
            <div className="ui buttons">
                <button className="ui red button movies">Movies</button>
                <button className="ui orange button tvs">TV</button>
            </div>
            <div className="ui link cards">
                {collection.map(media => (
                    <div className="card">
                        <div className="image">
                            <img src={'http://54.72.215.193/resource/images/'+media.posterImage300x450} alt=""/>
                        </div>
                        <div className="content">
                            <div className="header">{media.title}</div>
                            <div className="meta">{media.category}</div>
                            <div className="description">
                                {media.synopsis[0].text}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    ));
    return {
        DOM: vtree$,
        storage: collectionStorage$,
        HTTP: getCollection$
    }
};
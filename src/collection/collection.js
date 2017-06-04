/**
 * Created by bastien on 05/05/2017.
 */

import {html} from 'snabbdom-jsx';
import xs from 'xstream'
export const Collection = (sources) => {

    const clickMovies$ = sources.DOM.select('.movies').events('click').map(() => 'movies');
    const clickTV$ = sources.DOM.select('.tvs').events('click').map(() => 'tvs');
    const clickList$ = sources.DOM.select('#display-list').events('click').map(() => 'list');
    const clickCard$ = sources.DOM.select('#display-card').events('click').map(() => 'card');


    const getCollection$ = xs.merge(clickMovies$, clickTV$)
        .map(category => ({
            url: `http://54.72.215.193/api/metadata/${category}`,
            category: 'collection',
            method: 'GET'
        }));

    const styleCollection$ = xs.merge(clickList$, clickCard$)
        .startWith('card');

    const mediaLinkClick$ = sources.DOM
        .select('.media-collection')
        .select('.media-item')
        .events('click')
        .map(ev => ev.currentTarget.id);


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

    const data$ = xs.combine(collection$, styleCollection$)

    const vtree$ = data$
        .map(([collection, style]) => (
            <div>
                <div className="ui buttons">
                    <button className="ui red button movies">Movies</button>
                    <button className="ui orange button tvs">TV</button>
                </div>
                <button className={style === 'list' ? 'ui button active' : 'ui button'} id="display-list">List</button>
                <button className={style === 'card' ? 'ui button active' : 'ui button'} id="display-card">Card</button>
                {style === 'card' ?
                    (
                        <div className="media-collection ui link cards">
                            {collection.map(media => (
                                <div className="fluid card media-item" id={media._id}>
                                    <div className="image">
                                        <img src={'http://54.72.215.193/resource/images/' + media.posterImage300x450}
                                             alt=""/>
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
                    ) : (
                        <div className="media-collection ui list">
                            {collection.map(media => (
                                <div className="item media-item" id={media._id}>
                                    <img src={'http://54.72.215.193/resource/images/' + media.posterImage300x450}
                                         className="ui avatar image"
                                         alt=""/>
                                    <div className="content">
                                        <div className="header">{media.title}</div>
                                        <div className="description">
                                            {media.category}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )

                }
            </div>
        ));
    return {
        DOM: vtree$,
        storage: collectionStorage$,
        HTTP: getCollection$,
        router: mediaLinkClick$.map(id => `/detail/${id}`)
    }
};
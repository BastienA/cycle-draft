import {html} from 'snabbdom-jsx';
import xs from 'xstream';

export const Detail = (sources) => {
    const mediaId$ = sources.props$;
    const keyLocalStorage = 'metadata-local';

    const mediaCollection$ = sources
        .storage.local
        .getItem(keyLocalStorage)
        .map(JSON.parse);


    const selectedMedia$ = xs.combine(mediaId$, mediaCollection$)
        .map(([id, collection]) => {
            const find = collection.filter(media => media._id === id);
            if (find.length > 0) {
                return find[0]
            }
            return null
        });

    const vtree$ = selectedMedia$
        .map(media => {
            let source;
            if (media) {
                const strippedName = ['web/movies', media.title.replace(/\W+|_+/g, "").toLowerCase(), media.uuid].join('_');
                source = `http://54.72.215.193/${strippedName}.mp4`;
            }

            return (
                <div>
                    {media ? (
                        <div className="ui container">
                            <img className="ui fluid image"
                                 src={`http://54.72.215.193/resource/images/${media.sliderImage1024x400}`}/>
                            <video width="320" height="240" controls>
                                <source src={source} type="video/mp4"/>
                            </video>
                            <div className="very padded text container segment">
                                <h2 className="ui header">{media.title}</h2>
                            </div>
                        </div>
                    ) : (
                        <h2 className="ui header">No Data</h2>
                    )
                    }
                </div>

            )
        });

    return {
        HTTP: xs.empty(),
        router: xs.empty(),
        storage: xs.empty(),
        DOM: vtree$
    };
};
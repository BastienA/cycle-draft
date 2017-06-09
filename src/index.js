import {run} from '@cycle/run';
import xs from 'xstream';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import storageDriver from '@cycle/storage';
import {App} from './app';
import {Home} from './home'
import {Detail} from './detail/detail';


import {makeRouterDriver} from 'cyclic-router';
import {createHashHistory} from 'history';
import switchPath from 'switch-path';

const main = (sources) => {
    const match$ = sources.router.define({
        '/': App,
        '/detail/:id': id => sources => {
            return Detail(Object.assign(
                {},
                {props$: xs.of(id)},
                sources
            ));
        },
        '/other': Home
    });

    const page$ = match$.map(({path, value}) => {
        return value(Object.assign({}, sources, {
            router: sources.router.path(path)
        }));
    });

    const router$ = xs.merge(page$.map(c => c.router).flatten(), xs.of("/"));

    return {
        DOM: page$.map(c => c.DOM).flatten(),
        HTTP: page$.map(c => c.HTTP).flatten(),
        storage: page$.map(c => c.storage).flatten(),
        router: router$
    }
};

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    storage: storageDriver,
    router: makeRouterDriver(createHashHistory(), switchPath)
};

run(main, drivers);

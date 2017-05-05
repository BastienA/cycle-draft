import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import storageDriver from '@cycle/storage';
import {App} from './app';

const main = App;

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    storage: storageDriver
};

run(main, drivers);

import {html} from 'snabbdom-jsx';
import xs from 'xstream';
export const Home = () => {


    const vtree$ = xs.of(
        <div>
            Hello Other
        </div>
    );
    return {
        DOM: vtree$
    }
}
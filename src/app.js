import { buildDom }  from './dom.js'
import "./normalize.css";
import "./styles.css";


(() => {
    const m = document.getElementById('root');
    m.append(buildDom);
})();



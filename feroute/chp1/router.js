export default class Router {
    constructor(route) {
        if (Array.isArray(route)) {
            this.route = route;
        } else if (typeof route === 'object') {
            this.route = [route];
        } else {
            this.route = [];
        }
    }

    ready() {
        window.onload = () => {
            const pathname = location.pathname
            const href = location.href;
            for (let i=0; i<this.route.length; i++) {
                if (pathname.includes(this.route[i].path)) {
                    console.log('pathmatch', this.route[i].path)
                    break;
                }
            }
        };
        
        window.onpopstate = history.onpushstate = (e) => {
            console.log(e);
        }
        
        (function(history){
            var pushState = history.pushState;
            history.pushState = function(state, title, query) {
                if (typeof history.onpushstate == "function") {
                    history.onpushstate({state, title, query});
                }
                // whatever else you want to do
                // maybe call onhashchange e.handler
                return pushState.apply(history, arguments);
            }
        })(window.history);
    }

    add(route) {
        this.route = route;
    }
}
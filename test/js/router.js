const router = (function(){

    const parser = new DOMParser();
    const mdConverter = new showdown.Converter();

    function init(configs) {

        //console.log('init', window.location.pathname, configs);

        if (!Array.isArray(configs)) {
            console.error('config must be an array, but it ain\'t', typeof configs, configs);
            return;
        }

        const q = [ document.body ];

        while( q.length > 0 ) {

            let element = q.pop();

            for(element of element.children) {
                q.push(element);
            }

            const attRoute = element.getAttribute('route');

            if ( !attRoute ) { continue; }

            for( const entry of configs ) {
                if( attRoute === entry.name ) {
                    element.onclick = (event)=>{
                        window.location = entry.name;
                    };
                    break;
                }
            }
        }

        const path = window.location.pathname.endsWith('/index.html')
            ? '/'
            : window.location.pathname;
        let name = null;
        let target = null;
        let isMarkdown = null;

        for( const entry of configs ) {
            if( path === entry.name ) {
                name = entry.name;
                target = entry.file;
                isMarkdown = target.toLowerCase().endsWith('.md')
                break;
            }
        }

        if (!target) {
            console.error('no \'file\' defined for name \''+ name +'\'')
            return;
        }

        const routerElements = document.getElementsByTagName('route');

        if (routerElements.length === 0) {
            console.error('no <route /> found');
            return;
        }

        fetch( target )
            .then( response=>{

                if (response.status >= 400) {
                    // log message is printed out
                    return;
                }

                response.text().then( text=>{

                    let doc =
                        parser.parseFromString(
                            !isMarkdown
                                ? text
                                : '<div class="markdown">\n'+mdConverter.makeHtml(text)+'\n</div>', 'text/html'
                        );

                    for( routerTag of routerElements ) {
                        routerTag.append( doc.body );
                        loader.init(doc.body);
                    }
                } );
            } )
    };

    return {
        init
    };
}());
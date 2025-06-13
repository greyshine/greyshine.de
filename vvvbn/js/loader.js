window.onload = ()=>{
    //console.log('loader.js window.onload')
    loader.init();
};

let loader = (function(){

    const scannableTags = ['div','article','header','main','footer','aside'];
    const mdConverter = new showdown.Converter();
    const inViewItems = [];
    const plugins = [];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if ( inViewItems.includes(entry.target) ) {
                //console.log('cache', entry.target)
                return;
            } else if (entry.isIntersecting) {

                console.log('lazy loading', entry.target);

                entry.target.setAttribute('lazy', 'loading');

                applyReplacements( entry.target );

                entry.target.setAttribute('lazy', 'loaded');
                inViewItems.push(entry.target);

                // Do something when the element is visible
            } else {
                //console.warn(entry )
            }
        });
    });

    function scanObservables(node) {
        node.querySelectorAll( 'div[load][lazy], article[load][lazy]' )
            .forEach( element => {
                //console.log('observable', element);
                observer.observe(element);
            } );
    }

    function replace(htmlElement) {

        //console.log('replace', htmlElement)

        scanObservables( htmlElement );

        //console.log( 'replace()', htmlElement.nodeType, htmlElement );
        if ( htmlElement.nodeType !== 9 ) {
            //console.warn( 'no replace', htmlElement.nodeType, htmlElement );
            //return;
        }

        scannableTags.forEach( tag=>{
            for( const element of htmlElement.getElementsByTagName(tag) ) {
                //es.push(element);
                applyReplacements(element);
            }
        } );
    };

    function applyReplacements(node) {

        const file = node.getAttribute('load');

        if (!file) { return; }

        //console.log('applyReplacements', node, file);

        const isLazy = node.getAttribute('lazy') === 'lazy'; // attribute with no ="..." part is same as att="att"

        if (isLazy) {
            return;
        } else {

            const isMarkdown = file.toLowerCase().endsWith('.md');
            //console.log('replace element', file, "isMarkdown="+isMarkdown, 'isLazy='+ isLazy);

            fetch(file)
                .then(response => response.text())
                .then(text => {

                    if ( isMarkdown ) {
                        text = '<div class="markdown">\n'+mdConverter.makeHtml(text)+'\n</div>';
                    }

                    const childNodes = new DOMParser().parseFromString(text, 'text/html').body.childNodes;

                    for(let i2=0, l2=childNodes.length; i2<l2; i2++) {

                        if ( !childNodes[i2] ) { continue; }
                        else {
                            //console.log('childnode', file, i2, childNodes[i2])
                            node.removeAttribute('load');
                            node.setAttribute('loaded', file );
                            node.append( childNodes[i2] );

                            plugins.forEach( plugin=>plugin() );
                        }
                    }

                    // recursive call
                    replace( node );
                });
        }
    };

    return {
        addPlugin: (plugin)=>{
            if ( typeof plugin != 'function' ) {
                throw 'no plugin or no function execute available';
            }
            plugins.push(plugin);
            console.debug('added plugin', plugin);
        },
        init: ()=>replace(document)
    };
})();

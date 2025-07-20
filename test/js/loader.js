let debug = true;

/**
 * Scans for elements with attribute 'load' may also have attribute 'lazy'
 *
 * @type {{init: (function(): void), addPlugin: loader.addPlugin}}
 */
let loader = (function(){

    const scannableTags = ['div','article','header','main','footer','aside'];
    const mdConverter = new showdown.Converter();
    const inViewItems = [];
    const plugins = [];

    var order = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if ( inViewItems.includes(entry.target) ) {
                //console.log('cache', entry.target)
                return;
            } else if (entry.isIntersecting) {

                entry.target.setAttribute('lazy', 'loading');

                applyReplacements( entry.target );

                entry.target.setAttribute('lazy', 'loaded');
                inViewItems.push(entry.target);

                // Do something when the element is visible
                if (debug) {
                    console.log('lazy loaded', entry.target);
                }
            } else {
                //console.warn(entry )
            }
        });
    });

    function scanObservables(node) {
        node.querySelectorAll( '*[load][lazy]' )
            .forEach( element => observer.observe(element));
    }

    function replace(htmlElement) {

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

        // attribute with no ="..." part is same as att="att"
        const isLazy = node.getAttribute('lazy') != null
            && node.getAttribute('lazy').trim().toLowerCase() !== 'loading'
            && node.getAttribute('lazy').trim().toLowerCase() !== 'loaded'
            && node.getAttribute('lazy').trim().toLowerCase() !== 'false';

        //console.log('applyReplacements', node, 'lazy='+ isLazy, node.getAttribute('lazy'))

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

                    for(let i=0, l=childNodes.length; i<l; i++) {

                        if ( !childNodes[i] ) { continue; }
                        else {
                            //console.log('childnode', file, i, childNodes[i])
                            node.removeAttribute('load');
                            node.setAttribute('loaded', file );
                            node.append( childNodes[i] );

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
        init: (htmlElement)=>replace(htmlElement || document.body)
    };
})();

const mdConverter = new showdown.Converter();
const inViewItems = [];

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

// Start script
(()=>{
    replace( document );
})();

function applyAdditions() {
    if (images) {
        images.scan();
    }
}

function replace(htmlElement) {

    scanObservables( htmlElement );

    //console.log( 'replace()', htmlElement.nodeType, htmlElement );
    if ( htmlElement.nodeType !== 9 ) {
        //console.warn( 'no replace', htmlElement.nodeType, htmlElement );
        //return;
    }

    let es = [
        ...htmlElement.getElementsByTagName('div'),
        ...htmlElement.getElementsByTagName('article')
    ];

    es = [];
    for( const divElm of htmlElement.getElementsByTagName('div') ) {
        //console.log('div', divElm)
        es.push(divElm);
    }

    for( const articleElm of htmlElement.getElementsByTagName('article') ) {
        //console.log('article', articleElm)
        es.push(articleElm);
    }

    for( const headerElm of htmlElement.getElementsByTagName('header') ) {
        es.push(headerElm);
    }

    for(let i=0, l=es.length; i<l; i++) {
        applyReplacements(es[i]);
    }
}

function applyReplacements(node) {

    //console.log('applyReplacements', node);

    const file = node.getAttribute('load');

    if (!file) { return; }

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

                        applyAdditions( node )
                    }
                }

                // recursive call
                replace( node );
            });
    }
}

function showMenu() {
    document.getElementById('menu').style.display = 'inherit';
}

function toggleMenu(show) {
    document.getElementById('burger').style.display = show ? 'none' : 'inherit';
    document.getElementById('menu').style.display = !show ? 'none' : 'inherit';
}

function clickMenue(id) {

    toggleMenu(false);

    if ( typeof id === 'undefined' ) {
        return;
    }

    const es = document.getElementsByClassName('showable');

    for(var i=0, l=es.length;i<l;i++ ) {
        const e = es.item(i);
        e.style.display = 'none';
    }

    for(var i=0, l=es.length;i<l;i++ ) {
        const e = es.item(i);
        if ( e.id === id ) {
            //e.parentElement.style.display = 'inherit';
            e.style.display = 'inherit';
        }
    }
}
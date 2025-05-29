const mdConverter = new showdown.Converter();

// Start script
(()=>{
    replace(document);
})();

function replace(htmlElement) {

    const es = htmlElement.getElementsByTagName('div');
    for(var i=0, l=es.length; i<l; i++) {

        const e = es.item(i);
        const load = e.getAttribute('load');

        if (!load) {
            continue;
        } else {

            const isMarkdown = load.toLowerCase().endsWith('.md');

            //console.log(e, load)
            fetch(load)
                .then(response => response.text())
                .then(text => {

                    if ( isMarkdown ) {
                        text = '<div>\n'+mdConverter.makeHtml(text)+'\n</div>';
                    }

                    const html = new DOMParser().parseFromString(text, 'text/html').body.childNodes[0];
                    e.replaceWith( html );

                    // recursive call
                    replace(html);

                    //console.log('load >\n', text)
                });
        }
    }
}

function clickMenue(id) {

    const es = document.getElementsByClassName('shower');

    for(var i=0, l=es.length;i<l;i++ ) {
        const e = es.item(i);
        e.style.display = 'none';
    }

    for(var i=0, l=es.length;i<l;i++ ) {
        const e = es.item(i);
        if ( e.id === id ) {
            e.style.display = 'inherit';
        }
    }
}
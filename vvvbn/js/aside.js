const aside = (function() {

    function getAsideElements() {

        const asideElms = document.getElementsByTagName('aside');
        const results = [];

        if ( asideElms.length < 1 ) {
            console.warn('no <aside> found');
            return results;
        } else if (asideElms.length < 1) {
            console.warn('more than 1 <aside> found!', asideElms);
        }

        for(let i=0, l=asideElms.length; i<l; i++) {
            //console.log( asideElms.item(i) );
            results.push(asideElms.item(i));
        }

        return results;
    }

    return {
        show: ()=>{
            getAsideElements().forEach( aside=>aside.style.display = 'inherit' );
        },
        hide() {
            getAsideElements().forEach( aside=>aside.style.display = 'none' );
        },
        link: (id)=>{

            const es = document.getElementsByClassName('showable');

            for(var i=0, l=es.length;i<l;i++ ) {
                es.item(i).style.display = 'none';
            }

            let hitCount = 0;
            for(var i=0, l=es.length;i<l;i++ ) {
                if (es.item(i).id === id) {
                    es.item(i).style.display = 'inherit';
                    hitCount++;
                }
            }

            if (hitCount<1) {
                console.warn('no element with class=showable and id='+id+' found');
            }
        }
    };
}())
loader.addPlugin( ()=>{
    images.scan();
} );

const images = function() {

    const defaultRotateMillis = 6500;

    const arrowStyle =
        'margin-left: .5rem; ' +
        'border: 2px solid black; ' +
        'border-radius: 15px; ' +
        'background-color: white; ' +
        'color: black; ' +
        'padding: .5rem; ' +
        'cursor: pointer; ' +
        'user-select: none;';

    const lArrow = '<span style="'+arrowStyle+'">&#x2B05;</span>';
    const rArrow = '<span style="'+arrowStyle+'">&#x2B95;</span>';
    const play = '<span style="'+arrowStyle+'">&#9654;</span>';
    const pause = '<span style="'+arrowStyle+'">&#9208;</span>';

    const parser = new DOMParser();
    const scannedItems = [];

    function scan() {

        for(const imagesTag of document.body.querySelectorAll('images') ) {

            if ( scannedItems.includes(imagesTag) ) { continue; }

            scannedItems.push(imagesTag);

            const hideMenu = imagesTag.getAttribute('hideMenu') != null;
            let isPlaying = true;

            const btnLeft = parser.parseFromString(lArrow, "text/html").body.firstChild;
            const btnRight = parser.parseFromString(rArrow, "text/html").body.firstChild;
            const btnPlay = parser.parseFromString(play, "text/html").body.firstChild;
            const btnPause = parser.parseFromString(pause, "text/html").body.firstChild;

            const navDiv = parser.parseFromString('<div class="images-menu"/>', "text/html").body.firstChild;
            navDiv.append( btnLeft );
            navDiv.append( btnPlay );
            navDiv.append( btnPause );
            navDiv.append( btnRight );
            if (!hideMenu) {
                imagesTag.appendChild( navDiv );
            }

            btnPlay.addEventListener( 'click', ()=>{
                isPlaying = true;
            } );

            btnPause.addEventListener( 'click', ()=>{
                isPlaying = false;
            } );

            const imageTags = imagesTag.querySelectorAll( 'img' );
            let displayedIndex = 0;

            btnLeft.addEventListener( 'click', ()=>{
                imageTags.forEach( image=> image.style.display = 'none' );
                displayedIndex = displayedIndex === 0 ? imageTags.length : displayedIndex;
                imageTags.item(--displayedIndex).style.display = 'inherit';
            } );
            btnRight.addEventListener( 'click', ()=>{
                imageTags.forEach( image=> image.style.display = 'none' );
                displayedIndex = displayedIndex === imageTags.length-1 ? -1 : displayedIndex;
                imageTags.item(++displayedIndex).style.display = 'inherit';
            } );

            imageTags.forEach( image=> {
                image.style.display = 'none';
                image.onclick = ()=>isPlaying = !isPlaying;
            } );
            imageTags.item(displayedIndex).style.display = 'inherit';

            const rotateInterval = parseInt(imagesTag.getAttribute('rotate'));
            const timeout = isNaN(rotateInterval) || rotateInterval < 1 ? defaultRotateMillis : rotateInterval * 1000;

            setInterval( ()=>{
                if ( !isPlaying ) { return; }
                imageTags.item(displayedIndex).style.display = 'none';
                displayedIndex = displayedIndex === imageTags.length-1 ? -1 : displayedIndex;
                imageTags.item(++displayedIndex).style.display = 'inherit';
            }, timeout );
        }
    }

    return {
        scan
    };
}();
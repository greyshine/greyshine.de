const tracker = (function() {

    let server = '';
    let deviceInfo = buildDeviceInfo();
    const start = new Date().toISOString();

    function init(remoteServer) {

        server = remoteServer;

        let visit1 = localStorage.getItem('visit1');
        if ( !visit1 ) {
            localStorage.setItem('visit1', start );
        }

        let visits = localStorage.getItem('visits');
        localStorage.setItem('visits', !visits || isNaN(parseInt(visits)) ? '1' : ''+(parseInt(visits)+1) );

        fetch(server, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device: deviceInfo,
                visit1,
                visits,
                'prev_start': localStorage.getItem('prev.start'),
                'prev_end': localStorage.getItem('prev.end'),
            })
        })
        .catch( error=>{
            console.error(error);
        });

        window.addEventListener('beforeunload', ()=> {
            localStorage.setItem('prev.start', start );
            localStorage.setItem('prev.end', new Date().toISOString() );
        });
    }

    function buildDeviceInfo() {

        const result = {};

        if (!navigator) {
            return result;
        }

        //console.log(navigator);

        const iter = function(prefix, object, deep=0) {

            if ( !object ) { return; }

            for (let key in object) {

                if ( 'plugins'===key.toLowerCase() || 'mimetypes' === key.toLowerCase() ) { continue; }

                const value = object[key];
                const nPrefix = !prefix ? key : (prefix+'.'+key);

                if ( typeof value == 'string' || typeof value == 'number' ) {
                    result[ nPrefix ] = value;
                } else if ( typeof value == 'object' ) {

                    //console.log('> ', deep, nPrefix);

                    iter( nPrefix, value, deep+1 );
                }
            }
        };

        iter('', navigator);
        return result;
    }

    return {
        init
    };
}());
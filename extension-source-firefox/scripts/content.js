const ready = ( fn ) => {
  if ( document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading' ){
    fn();
  } else {
    document.addEventListener( 'DOMContentLoaded', fn );
  }
}

ready( () => {
  const addLink = ( options ) => {
    let linkWrapper = document.createElement( 'li' );
    linkWrapper.classList.add( 'd-flex' );
    linkWrapper.classList.add( 'js-responsive-underlinenav-item' );

    let link = document.createElement( 'a' );

    link.setAttribute( 'href', options.linkURL );
    link.innerHTML = options.linkHTML;
    link.classList.add( 'UnderlineNav-item' );
    linkWrapper.appendChild( link );
    orgnav.querySelector('ul').appendChild( linkWrapper );

    if (options.dataURL){
      fetch( options.dataURL )
      .then( response => response.json() )
      .then( data => {
        if ( data && data[options.dataValue] ){
          document.getElementById( options.dataID ).innerHTML = formatNumber( data[options.dataValue] );
        }
      } ).catch( ( err ) => {
        console.log( err.message );
      } );
    }
  }

  const formatNumber = (number, decimals, dec_point, thousands_sep) => {
    /* Source:
       https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript/2901136#2901136
    */
      var n = !isFinite(+number) ? 0 : +number, 
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
          dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
          toFixedFix = (n, prec) => {
              // Fix for IE parseFloat(0.55).toFixed(0) = 0;
              var k = Math.pow(10, prec);
              return Math.round(n * k) / k;
          },
          s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
      if (s[0].length > 3) {
          s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
          s[1] = s[1] || '';
          s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
  }

  const getMeta = ( metaName ) => {
    /* Source:
       https://stackoverflow.com/questions/7524585/how-do-i-get-the-information-from-a-meta-tag-with-javascript/7524621#7524621 */
    const metas = document.getElementsByTagName('meta');

    for ( let i = 0; i < metas.length; i++ ) {
      if ( metas[i].getAttribute( 'property' ) === metaName || metas[i].getAttribute( 'name' ) === metaName ) {
        return metas[i].getAttribute( 'content' );
      }
    }
    return '';
  }

  let orgnav = document.getElementsByClassName( 'js-profile-tab-count-container' );

  if ( orgnav && orgnav.length > 0 ){
    orgnav = orgnav[0];
    const orgName = getMeta( 'profile:username' );

    if ( orgName ){
      addLink({
        linkURL: `https://github.com/search?q=org%3A${ orgName }+is%3Aissue&state=open&type=Issues`,
        linkHTML: `Issues <span id="org-issues-counter" class="Counter"></span>`,
        dataURL: `https://api.github.com/search/issues?q=org:${ orgName }+state:open&per_page=100&sort=created&order=asc`,
        dataID: 'org-issues-counter',
        dataValue: 'total_count'
      });
      addLink({
        linkURL: `https://github.com/search?q=user%3A${ orgName }+label%3A%22help+wanted%22&type=Issues&ref=advsearch`,
        linkHTML: `Help wanted`
      });
    }
  }
} );

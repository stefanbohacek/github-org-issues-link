function ready( fn ) {
  if ( document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading' ){
    fn();
  } else {
    document.addEventListener( 'DOMContentLoaded', fn );
  }
}

ready( function(){
  function formatNumber(number, decimals, dec_point, thousands_sep) {
    /* Source:
       https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript/2901136#2901136
    */
      var n = !isFinite(+number) ? 0 : +number, 
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
          dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
          toFixedFix = function (n, prec) {
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

  function getMeta( metaName ) {
    /* Source:
       https://stackoverflow.com/questions/7524585/how-do-i-get-the-information-from-a-meta-tag-with-javascript/7524621#7524621 */
    const metas = document.getElementsByTagName('meta');

    for ( let i = 0; i < metas.length; i++ ) {
      if ( metas[i].getAttribute( 'property' ) === metaName ) {
        return metas[i].getAttribute( 'content' );
      }
    }
    return '';
  }

  let orgnav = document.getElementsByClassName( 'orgnav' );

  if ( orgnav && orgnav.length > 0 ){
    orgnav = orgnav[0];
    const orgName = getMeta( 'profile:username' );

    if ( orgName ){
      const apiCallURL = `https://api.github.com/search/issues?q=org:${ orgName }+state:open&per_page=100&sort=created&order=asc`

      let issuesLink = document.createElement( 'a' );

      issuesLink.setAttribute( 'href', `https://github.com/search?q=org%3A${ orgName }+is%3Aissue&state=open&type=Issues` );
      issuesLink.innerHTML = 'Issues <span id="org-issues-counter" class="Counter"></span>';
      issuesLink.classList.add( 'pagehead-tabs-item' );
      orgnav.appendChild( issuesLink );

      fetch( apiCallURL )
        .then( response => response.json() )
        .then( data => {
          if ( data && data.total_count ){
            document.getElementById( 'org-issues-counter' ).innerHTML = formatNumber( data.total_count );
          }
        } ).catch( function( err ) {
          console.log( err.message );
        } );
    }
  }
} );

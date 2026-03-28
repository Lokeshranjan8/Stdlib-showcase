import erfc from '@stdlib/math-base-special-erfc';
import sqrt from '@stdlib/math-base-special-sqrt';
import isnan from '@stdlib/math-base-assert-is-nan';
import exp from '@stdlib/math-base-special-exp';
import ttest2lib from '@stdlib/stats-ttest2';
import pcorrtesresult from '@stdlib/stats-pcorrtest';

var PI    = Math.PI;
var SQRT2 = sqrt( 2.0 );

export function mean( arr ) {
    var s = 0.0;
    var i;
    for ( i = 0; i < arr.length; i++ ) {
        s += arr[ i ];
    }
    return s / ( arr.length );
}

export function stdev( arr ) {
    var m = mean( arr );
    var s = 0.0;
    var i;
    for ( i = 0; i < arr.length; i++ ) {
        s += ( arr[ i ] - m ) * ( arr[ i ] - m );
    }
    return sqrt( s / ( arr.length - 1 ) );
}

export function normalCDF( x, mu, sigma ) {
    var denom;
    var xc;
    if (
        isnan( x ) ||
        isnan( mu ) ||
        isnan( sigma ) ||
        sigma < 0.0
    ) {
        return NaN;
    }
    if ( sigma === 0.0 ) {
        return ( x < mu ) ? 0.0 : 1.0;
    }
    denom = sigma * SQRT2;
    xc    = x - mu;
    return 0.5 * erfc( -xc / denom );
}

export function normalPDF( x, mu, sigma ) {
    var z;
    if (
        isnan( x ) ||
        isnan( mu ) ||
        isnan( sigma ) ||
        sigma <= 0.0
    ) {
        return NaN;
    }
    z = ( x - mu ) / sigma;
    return exp( -0.5 * z * z ) / ( sigma * sqrt( 2.0 * PI ) );
}

export function zScore( sampleMean, mu0, sigma, n ) {
	return ( sampleMean - mu0 ) / ( sigma / sqrt( n ) );
}
 
export function zPValue( z ) {
    return 1.0 - normalCDF( z, 0.0, 1.0 );
}


export function ttest2(x1, x2) {
  return ttest2lib(x1, x2);
}

export function pcorrtestfn(x,y){
    return pcorrtesresult(x, y, { alternative: 'two-sided' });
}

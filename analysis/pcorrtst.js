import { readFileSync, Stats } from 'fs';
import { resolve,dirname } from 'path';
import { fileURLToPath } from 'url';
import * as stats from './Stats.js';


var pcorrtestfun = stats.pcorrtestfn;


const dir = dirname(fileURLToPath(import.meta.url));

var file = resolve(dir,'../public/data/heart.csv');
var lines   = readFileSync( resolve( file ), 'utf8' ).trim().split( '\n' );
var headers = lines[ 0 ].split( ',' ).map( function( h ) {
	return h.trim().toLowerCase();
});

var data = lines.slice( 1 ).map( function( line ) {
	var vals = line.split(',');
	var row = {};
	headers.forEach(function (h, i) {
		row[h] = parseFloat(vals[i]);
	});
	return row;
}).filter(function (r) {
	return !isNaN(r.age) && !isNaN(r.chol);
});



var age_Arr  = data.map( function( r ) {
	return r.age;
});
var chol_Arr = data.map( function( r ) {
	return r.chol;
});


var result = pcorrtestfun( age_Arr, chol_Arr );

console.log('  **Age vs Cholesterol [Pearson Correlation Test]** \n' );
console.log('  H0 : correlation coefficient = 0  ' );
console.log('  H1 : correlation coefficient ≠ 0\n' );

console.log('  sample size(n) : ' + data.length + ' patients' );
console.log('  pcorr (r)      : ' + result.pcorr.toFixed( 4 ) );
console.log('  t-statistic    : ' + result.statistic.toFixed( 4 ) );
console.log('  p-value        : ' + ( result.pValue < 0.000001 ? '< 0.000001' : result.pValue.toFixed( 4 ) ) );
console.log('  95% CI         : [ ' + result.ci[ 0 ].toFixed( 4 ) + ',  ' + result.ci[ 1 ].toFixed( 4 ) + ' ]' );
console.log('  reject H0?     : ' + ( result.rejected ? 'YES (p < 0.05)' : 'NO' ) + '\n' );


if ( result.rejected ) {
	if ( result.pcorr > 0 ) {
		console.log( '  := statistically significant positive correlation (r = ' + result.pcorr.toFixed( 4 ) +')');
		console.log( '  := older patients tend to have higher cholesterol level ' );
	}
	else {
		console.log( '  := older patients tend to have lower cholesterol in this dataset' );
	}
}
else {
	console.log(" There is no significant linear relationship between age and cholesterol");
}



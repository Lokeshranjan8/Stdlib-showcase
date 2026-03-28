import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as stats from './Stats.js';

var mean = stats.mean;
var ttest2_fun = stats.ttest2;

const dir = dirname(fileURLToPath(import.meta.url));

var file = resolve(dir,'../public/data/heart.csv');
var lines = readFileSync( resolve( file ), 'utf8' ).trim().split( '\n' );
var headers = lines[ 0 ].split( ',' ).map( function( h ) {
	return h.trim().toLowerCase();
});

var data = lines.slice(1).map(function (line) {
	var vals = line.split(',');
	var row = {};
	headers.forEach(function (h, i) {
		row[h] = parseFloat(vals[i]);
	});
	return row;
}).filter(function (r) {
	return !isNaN(r.age) && !isNaN(r.chol) && !isNaN(r.target);
});

var diseaseGroup = data.filter(function (r) {
	return r.target === 1;
});

var healthyGroup = data.filter(function (r) {
	return r.target === 0;
});

var diseaseMean = mean( diseaseGroup.map(function (r) { 
	return r.chol;
}));

var healthyMean = mean( healthyGroup.map(function (r) {
		return r.chol;
}));

var disease_chol = diseaseGroup.map(r => r.chol);

var healthy_chol = healthyGroup.map(r => r.chol);

var result = ttest2_fun(disease_chol, healthy_chol);




console.log('  **  Cholesterol Comparison [Two-Sample T-Test]   **\n');
console.log('  H0: mean chol (disease) = mean chol (healthy)');
console.log('  H1: mean chol (disease) ≠ mean chol (healthy)  (two-sided)\n');

console.log('  group                : disease patients (target=1)  vs  healthy (target=0)');
console.log('\n');
console.log('  disease group size   : ' + diseaseGroup.length + ' patients');
console.log('  healthy group size   : ' + healthyGroup.length + ' patients');
console.log('  disease mean chol    : ' + diseaseMean.toFixed(4) + ' mg/dl');
console.log('  healthy mean chol    : ' + healthyMean.toFixed(4) + ' mg/dl');

console.log('  df                   : ' +(diseaseMean - healthyMean).toFixed(2) +' mg/dl\n');
console.log('  statistic            : ' + result.statistic.toFixed(4));
console.log('  p-value              : ' +(result.pValue < 0.000001 ? '< 0.000001': result.pValue.toFixed(6)));


if (result.ci) {
console.log('  95% CI               : [ ' +result.ci[0].toFixed(2) +',  ' +result.ci[1].toFixed(2) +' ]');
}

console.log('  reject H0?           : ' +(result.rejected ? 'YES (p < 0.05)' : 'NO') +'\n');


if (result.rejected) { console.log('statistically significant difference in cholesterol between groups');
	console.log('disease patients have '
		    +
			(diseaseMean > healthyMean ? 'higher' : 'lower') 
			+
			'mean cholesterol (' + diseaseMean.toFixed(1) + ' vs ' +healthyMean.toFixed(1) +' mg/dl)'
	);
	console.log('  := this supports cholesterol as a relevant factor in heart disease');
}
else {
	console.log('  := no statistically significant difference between the two groups');
}
const arrayUtils = require('./array-utils');

module.exports.mod = function(value, factors, divider, direction){

	var reduceSummationTerms = false,
		cumplimentaryToDivider = false;

	if(arguments.length === 1 && typeof value === 'object') {
		factors = value.factors;
		divider = value.divider;
		direction = value.direction;
		reduceSummationTerms = value.reduceSummationTerms;
		cumplimentaryToDivider = value.cumplimentaryToDivider;
		value = value.value;
	}

	if(divider === undefined) {
		divider = 11;
	}

	if(factors === undefined) {
		factors = arrayUtils.series(2, 9);
	}

	if(direction === undefined) {
		direction = 'rightToLeft';
	}

	var reduceMethod = direction === 'leftToRight' ? 'reduce' : 'reduceRight';

	var i = 0;
	var result = value.split('')[reduceMethod](function(last, current){
		if(i > factors.length - 1) {
			i = 0;
		}

		var total = factors[i++] * parseInt(current, 10);

		const sum = (a, b) => a + b;
        
		if(reduceSummationTerms) {
			total = total.toString().split('').map(Number).reduce(sum, 0);
		}

		return total + last;
	}, 0) % divider;

	if(cumplimentaryToDivider) {
		result = divider - result;
	}

	return result;
};

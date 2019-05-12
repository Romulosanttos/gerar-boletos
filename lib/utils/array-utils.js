module.exports.series = function(from, to){
	var params = [from, to];
	if(from > to) {
		params = [to, from];
	}

	var result = [];
	while(params[0] <= params[1]) {
		result.push(params[0]++);
	}

	return from > to ? result.reverse() : result;
};

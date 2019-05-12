function pad(str, length, padStr, type) {
	/* jshint ignore:start, unused:false */
	str = str == null ? '' : String(str);
	length = ~~length;

	var padlen = 0;

	if (!padStr)
		padStr = ' ';
	else if (padStr.length > 1)
		padStr = padStr.charAt(0);

	switch (type) {
	case 'right':
		padlen = length - str.length;
		return str + strRepeat(padStr, padlen);
	case 'both':
		padlen = length - str.length;
		return strRepeat(padStr, Math.ceil(padlen / 2)) + str +
        strRepeat(padStr, Math.floor(padlen / 2));
	default: // 'left'
		padlen = length - str.length;
		return strRepeat(padStr, padlen) + str;
	}

	function strRepeat(str, qty) {
		if (qty < 1) return '';
		var result = '';
		while (qty > 0) {
			if (qty & 1) result += str;
			qty >>= 1, str += str;
		}

		return result;
	}
	/* jshint ignore:end */
}

module.exports.pad = pad;

function insert(string, index, value) {
	return [
		string.substring(0, index),
		value,
		string.substring(index, string.length)
	].join('');
}
module.exports.insert = insert;

function capitalize(value) {
	if(typeof value !== 'string') {
		return value;
	}

	return value.substr(0, 1).toUpperCase() + value.substr(1);
}
module.exports.capitalize = capitalize;

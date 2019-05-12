function merge(destination, source) {
	if (destination === undefined) destination = {};
	if (source === undefined) source = {};

	return Object.assign(destination, source);
}
module.exports.merge = merge;

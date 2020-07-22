module.exports = (stream) => {
	return new Promise(function(resolve, reject) {
		stream.on('end', ()=> resolve(stream));
		stream.on('error', ()=> reject);
	});
};

module.exports = (stream) => {
	return new Promise(function(resolve, reject) {
		// Para WriteStream, usar 'finish' ou 'close'
		// Para ReadableStream, usar 'end'
		stream.on('finish', () => resolve(stream));
		stream.on('close', () => resolve(stream));
		stream.on('end', () => resolve(stream));
		stream.on('error', (error) => reject(error));
	});
};

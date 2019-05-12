module.exports.isValidDate = function(date) {
	//http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
	if (Object.prototype.toString.call(date) !== '[object Date]') {
		return false;
	}

	return !isNaN(date.getTime());
};

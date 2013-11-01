/**
 * 
 * @param {Object} params is an abstract object from which only necessary fields will be extracted
 */
function Todo(params) {
	Ti.API.info('value of params.start is '+params.start);
	return {
		'start' : new Date(+params.start),
		'end' : new Date(+params.end),
		'description' : params.description,
	};
}

module.exports = Todo;

/**
 * 
 * @param {Object} params is an abstract object from which only necessary fields will be extracted
 */
function Todo(params) {
	return {
		'start' : new Date(+params.start),
		'end' : new Date(+params.end),
		'description' : params.description,
	};
}

module.exports = Todo;

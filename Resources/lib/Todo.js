/**
 * 
 * @param {Object} start the starting time of the todo
 * @param {Object} end the ending time of the todo
 * @param {Object} description the description of the todo
 */
function Todo(start, end, description) {
	return {
		'start' : start,
		'end' : end,
		'description' : description
	};
}

module.exports = Todo;

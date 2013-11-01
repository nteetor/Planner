/*
 * This file contains a number of useful utility functions
 */

exports.DEBUG = function(s) {
	// set this to false to turn off debug output
	if (true) {
		Ti.API.info('DEBUG: ' + s);
	}
};

var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports.prettyDate = function(date) {
	date = new Date(date);
	return dayOfWeek[date.getDay()] + ', ' + monthName[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}; 

/**
 * Given an array of tasks this function returns
 * @param {Object} tasks is an array of task objects retrieved from the database
 * @return this function returns an array of TableViewRow objects
 */
exports.tasksToRows = function(tasks){
	var tasks_rows = new Array();
	for (var i = 0; i < tasks_list.length; i++) {
		tasks_rows[i] = Ti.UI.createTableViewRow(tasks_list[i]);
	}
	return tasks_rows;
};

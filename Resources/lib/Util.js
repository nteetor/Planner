/**
 * This file contains a number of useful utility functions
 */

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

/**
 * Debugging funciton which logs messages at the info level
 */
exports.DEBUG = function(s) {
	// set this to false to turn off debug output
	if (false) {
		Ti.API.info('DEBUG: ' + s);
	}
};

/**
 * used to evenly distribute items on the toolbar
 */ 
exports.flexSpace = Titanium.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Converts a Date object to a pretty string version
 *
 * @param {Object} date a number representation of a date or Date object
 * @return this function returns a "pretty" version of a Date object
 */
exports.prettyDate = function(date) {
	date = new Date(date);
	return dayOfWeek[date.getDay()] + ', ' + monthName[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
};

/**
 * Given an array of tasks this function converts the tasks into TableViewRow
 * objects so that extra parameters are preserved, the array of row
 * objects is returned.
 *
 * @param {Object} tasks is an array of task objects retrieved from the database
 * @return this function returns an array of TableViewRow objects
 */
exports.tasksToRows = function(tasks) {
	var tasks_rows = new Array();
	for (var i = 0; i < tasks.length; i++) {
		next_task = Ti.UI.createTableViewRow(tasks[i]);
		Ti.API.info('task is '+next_task.id);
		next_task.setTitle(tasks[i].description+'\t'+tasks[i].start+' to '+tasks[i].end);
		tasks_rows[i] = next_task;
	}
	return tasks_rows;
};

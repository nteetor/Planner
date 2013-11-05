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
 * Returns time in form XX:XX XM eg 1:45 AM
 */
exports.natesPrettyTime = function(date){
	date = new Date(date);
	var xm = (date.getHours() >= 12) ? "PM" : "AM";
	var newHour = date.getHours()%12;
	var newMin = (date.getMinutes() < 10) ? "0"+date.getMinutes() : date.getMinutes();
	return newHour+":"+newMin+" "+xm;
};

exports.prettyDate = function(date) {
	date = new Date(date);
	return dayOfWeek[date.getDay()] + ', ' + monthName[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
};

exports.prettyTime = function(date) {
	var hours = date.getHours(),
		minutes = date.getMinutes();
	var trailer = 'AM';
	if (hours > 12) {
		trailer = 'PM';
		hours = hours - 12;
	}
	if (hours == 0) {
		hours = 12;
	}
	return hours + ':' + minutes + ' ' + trailer;  
};

exports.tasksToRows = function(tasks) {
	var tasks_rows = new Array();
	for (var i = 0; i < tasks.length; i++) {
		next_task = Ti.UI.createTableViewRow(tasks[i]);
		next_task.setFont({
			fontSize : 14
		});
		next_task.setTitle(tasks[i].description+'\t'+prettyTime(tasks[i].start)+' to '+prettyTime(tasks[i].end));
		tasks_rows[i] = next_task;
	}
	return tasks_rows;
};

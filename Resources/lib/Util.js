/**
 * This file contains a number of useful utility functions
 */

/**
 * Colors
 */
var TasksWindowColor = {
	BACKGROUND_COLOR : '#A7CEEA',
	TINT_COLOR : '#07548B',
	TEXT_COLOR : '#185F92',
	BAR_COLOR : '#63B2EA'
};
exports.TasksWindowColor = TasksWindowColor;

var TaskViewColor = {
	BACKGROUND_COLOR : '#CCA9EC',
	TINT_COLOR : '#500892',
	TEXT_COLOR : '#5D1A99'
};
exports.TaskViewColor = TaskViewColor;

var CalendarWindowColor = {
	BACKGROUND_COLOR : '#FFEDB1',
	TINT_COLOR : '#D9A600',
	TEXT_COLOR : '#E4B418',
	BAR_COLOR : '#FFDA62',
	BORDER_COLOR : '#FFC300',
	CURRENTDATE_COLOR : '#FFC300', //'#FFA240', //orange-ish
	FOCUSDATE_COLOR : '#FF5D40', //red-ish
	OVERLAP_COLOR : '#6D70D4'
};
exports.CalendarWindowColor = CalendarWindowColor;

exports.CalendarViewLandscape = {
	DAY_H : '30dp',
	DAY_W : '60dp',
	CAL_W : 420,
	TOOL_W : 420,
	TOOL_DAYS_W : 420,
	TOOL_DAYS_H : 18,
	TOOL_DAYS_FULL: true,
	TOOL_DAYS_TEXT: 10, 
	DAY_TEXT: 14,
	TOOLBAR_H: 44
};

exports.CalendarViewPortrait = {
	DAY_H : '44dp',
	DAY_W : '46dp',
	CAL_W : 322,
	TOOL_DAYS_H : 22,
	TOOL_DAYS_W : 322,
	TOOL_DAYS_TEXT: 12, 
	DAY_TEXT: 20,
	TOOLBAR_H: 50
};

Array.prototype.move = function(old_index, new_index) {
	if (new_index >= this.length) {
		var k = new_index - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	//return this;
	// for testing purposes
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
if (Ti.Platform.osname == 'android') {
	
} else {
	exports.flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
}


var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Returns time in form XX:XX XM eg 1:45 AM
 * AKA natesPrettyTime
 */
var prettyTime = function(date) {
	date = new Date(date);
	var newHour = date.getHours();
	var xm = 'AM';
	if (newHour > 11) {
		xm = 'PM';
	}
	if (newHour == 0) {
		newHour = 12;
	}
	if (newHour > 12) {
		newHour = newHour - 12;
	}
	var newMin = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
	return newHour + ":" + newMin + " " + xm;
};
exports.prettyTime = prettyTime;

exports.prettyDate = function(date) {
	date = new Date(date);
	return dayOfWeek[date.getDay()] + ', ' + monthName[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
};

exports.jacksNowSuperiorPrettyTime = function(date) {
	var hours = date.getHours(), minutes = date.getMinutes();
	var trailer = 'AM';
	if (hours > 12) {
		trailer = 'PM';
		hours = hours - 12;
	}
	if (hours == 0) {
		hours = 12;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	return hours + ':' + minutes + ' ' + trailer;
};

exports.tasksToRows = function(tasks) {
	var tasks_rows = new Array();
	var descriptionLabel, timesLabel, fontSize = 14;
	for (var i = 0; i < tasks.length; i++) {
		next_task = Ti.UI.createTableViewRow(tasks[i]);
		next_task.height = 40;
		descriptionLabel = Ti.UI.createLabel({
			text : tasks[i].description,
			height : 20,
			left : 10,
			width : 150,
			font : {
				fontSize : fontSize
			},
			color : TasksWindowColor.TEXT_COLOR
		});
		timesLabel = Ti.UI.createLabel({
			text : prettyTime(tasks[i].start) + ' to ' + prettyTime(tasks[i].end),
			right : 5,
			height : 20,
			font : {
				fontSize : fontSize
			},
			color : TasksWindowColor.TEXT_COLOR
		});
		next_task.add(descriptionLabel);
		next_task.add(timesLabel);
		next_task.descriptionForTaskView = tasks[i].description;
		tasks_rows[i] = next_task;
	}
	return tasks_rows;
};

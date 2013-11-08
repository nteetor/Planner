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
 * AKA natesPrettyTime
 */
var prettyTime = function(date){
	date = new Date(date);
	var newHour = date.getHours();
	var xm = 'AM';
	if (newHour == 0) {
		newHour = 12;
	}
	if (newHour > 11) {
		xm = 'PM';
		if (newHour > 12) {
			newHour = newHour - 12;	
		}
	}
	var newMin = (date.getMinutes() < 10) ? "0"+date.getMinutes() : date.getMinutes();
	return newHour+":"+newMin+" "+xm;
};
exports.prettyTime = prettyTime;


exports.prettyDate = function(date) {
	date = new Date(date);
	return dayOfWeek[date.getDay()] + ', ' + monthName[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
};


exports.jacksNowSuperiorPrettyTime = function(date) {
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
	if (minutes < 10){
		minutes = '0'+minutes;
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
			text: tasks[i].description,
			height: 20,
			left: 10,
			width: 150,
			font: {
				fontSize: fontSize
			}
		});
		timesLabel = Ti.UI.createLabel({
			text: prettyTime(tasks[i].start) + ' to ' + prettyTime(tasks[i].end),
			right: 5,
			height: 20,
			font: {
				fontSize: fontSize
			}			
		});
		next_task.add(descriptionLabel);
		next_task.add(timesLabel);
		next_task.descriptionForTaskView = tasks[i].description;
		tasks_rows[i] = next_task;
	}
	return tasks_rows;
};

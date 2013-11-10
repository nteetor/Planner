var CalendarView = require('ui/CalendarView');
var util = require('lib/Util');

/**
 * Create a window to hold the calendar
 */
function CalendarWindow(openTaskDayFunction) {
	var self = Ti.UI.createWindow({
		title : L('calendar'),
		backgroundColor : util.CalendarWindowColor.BACKGROUND_COLOR,
		barColor : util.CalendarWindowColor.BAR_COLOR
	});

	var focus_date = Ti.App.Properties.getObject('focus_date');
	Ti.App.Properties.addEventListener('change', function() {
		focus_date = Ti.App.Properties.getObject('focus_date');
		Ti.API.fireEvent('setCalDate', {
			date : new Date(focus_date)
		});
	});

	var calendarView = new CalendarView(focus_date, focus_date, function(selected_date) {
		Ti.App.Properties.setObject('focus_date', selected_date);
		openTaskDayFunction();
	});

	self.addEventListener('swipe', function(e) {
		if (e.direction == 'left') {
			calendarView.shiftMonth('up');
		} else if (e.direction == 'right') {
			calendarView.shiftMonth('down');
		}
	});
	self.add(calendarView);
	return self;
}

module.exports = CalendarWindow; 
var CalendarView = require('ui/CalendarView');
var util = require('lib/Util');

/**
 * Create a window to hold the calendar
 */
function CalendarWindow(openTaskDayFunction) {
	var self = Ti.UI.createWindow({
		title : L('calendar'),
		backgroundColor : util.CalendarWindowColor.BACKGROUND_COLOR,
		barColor : util.CalendarWindowColor.BAR_COLOR,
		orientationModes: [
        	Ti.UI.LANDSCAPE_LEFT,
	        Ti.UI.LANDSCAPE_RIGHT,
    	    Ti.UI.PORTRAIT
	    ]		
	});
	

	var focus_date = new Date(Ti.App.Properties.getObject('focus_date'));
	Ti.App.Properties.addEventListener('change', function() {
		focus_date = Ti.App.Properties.getObject('focus_date');
		Ti.API.fireEvent('setCalDate', {
			date : new Date(focus_date)
		});
	});

	var calendarView = new CalendarView(focus_date, focus_date, Ti.Gesture.isPortrait(), function(selected_date) {
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
			
	Ti.Gesture.addEventListener('orientationchange', function(e) {
		if (Ti.Gesture.isLandscape(e.orientation)) {
			calendarView.makeLandscape();
		} else {
			calendarView.makePortrait();
		}
	});

	self.add(calendarView);
	return self;
}

module.exports = CalendarWindow; 
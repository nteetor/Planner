var CalendarView = require('ui/CalendarView');

function CalendarWindow(openTaskDayFunction){
	var self = Ti.UI.createWindow({
		title : L('calendar'),
		backgroundColor : 'white'
	});
	
	var focus_date = Ti.App.Properties.getObject('focus_date');
	Ti.App.Properties.addEventListener('change', function() {
		focus_date = Ti.App.Properties.getObject('focus_date');
		Ti.API.fireEvent('setCalDate', {date: new Date(Ti.App.Properties.getObject('focus_date'))});
	});
		
	var calendarView = new CalendarView(focus_date, focus_date, function(selected_date){
		openTaskDayFunction(selected_date);
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
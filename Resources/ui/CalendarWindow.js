var CalendarView = require('ui/CalendarView');

function CalendarWindow(openTaskDayFunction){
	var self = Ti.UI.createWindow({
		title : L('calendar'),
		backgroundColor : 'white'
	});
	
	var focus_date = Ti.App.Properties.getObject('focus_date');
	Ti.App.Properties.addEventListener('change', function() {
		Ti.API.fireEvent('setCalDate', {date: new Date(Ti.App.Properties.getObject('focus_date'))});
	});
		
	var calendarView = new CalendarView(focus_date, focus_date, function(selected_date){
		openTaskDayFunction(selected_date);
	});
	
	self.add(calendarView);
	return self;
}

module.exports = CalendarWindow;
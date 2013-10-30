
function CalendarWindow(){
	var self = Ti.UI.createWindow({
		title : L('calendar'),
		backgroundColor : 'white'
	});
	
	return self;
}

module.exports = CalendarWindow;
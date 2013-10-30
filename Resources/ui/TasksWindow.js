var db = require('lib/db');

var DEBUG = function(s) {
	if (true) {
		Ti.API.info('DEBUG: ' + s);	// set this to false to turn off debug output
	}
};

var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 
				 'July', 'August', 'September', 'October', 'November', 'December'];

function TasksWindow(){
	var self = Ti.UI.createWindow({
		title : L('tasks'),
		backgroundColor : 'white',
		layout : 'vertical'
	});
	
	var prettyDate = function(date){
		date = new Date(date);
		return dayOfWeek[date.getDay()]+', '+monthName[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
	};
	
	var self_title = Ti.UI.createLabel({
		text : prettyDate(Ti.App.Properties.getObject('focus_date')),
		top : 5,
		//height : 20
	});
	self.add(self_title);
	
	self.addEventListener('swipe',function(e){
		// TODO: we need to consider when we decrement or increment into another month
		// THIS IS DONE AUTOMATICALLY, HELL YEAH
		
		// if swipe left then increment the date
		if (e.direction == 'left'){
			var old_focus = new Date(Ti.App.Properties.getObject('focus_date'));
			var new_focus = old_focus.setDate(old_focus.getDate()+1); // increment date
			Ti.App.Properties.setObject('focus_date',new_focus);
			self_title.setText(prettyDate(new_focus));
			
		} // if swipe right then decrement date 
		else if (e.direction == 'right'){
			var old_focus = new Date(Ti.App.Properties.getObject('focus_date'));
			var new_focus = old_focus.setDate(old_focus.getDate()-1); // decrement date
			Ti.App.Properties.setObject('focus_date',new_focus);
			self_title.setText(prettyDate(new_focus));
			
		}
		
	});
	
	// the table view that will hold the tasks
	tasks_list = db.daylist(new Date(Ti.App.Properties.getObject('focus_date')));
	var tasks_table = Ti.UI.createTableView({
		data : tasks_list,
		top : 5
	});
	
	// add the table to our window
	self.add(tasks_table);
	
	/*
	 * The set of buttons for the task window toolbar
	 */
	var add = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.ADD
	});
	
	var edit = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.EDIT,
		enabled : false
	});
	
	var del = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.TRASH,
		enabled : false
	});
	
	var done = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.DONE,
	});
	
	// used to evenly distribute items on the toolbar
	var flexSpace = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	// set the toolbar for our window using the above buttons	
	self.setToolbar([add,flexSpace,edit,flexSpace,del,flexSpace,done]);
	
	return self;	
}

module.exports = TasksWindow;

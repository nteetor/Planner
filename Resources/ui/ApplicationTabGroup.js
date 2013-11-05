var util = require('lib/Util');
var TasksWindow = require('ui/TasksWindow');
var CalendarWindow = require('ui/CalendarWindow');

function ApplicationTabGroup(Window) {
	// set the global focus date to the current date
	Ti.App.Properties.setObject('focus_date', new Date());
	util.DEBUG('focus date is ' + Ti.App.Properties.getObject('focus_date'));

	//create module instance
	var self = Ti.UI.createTabGroup();

	var task_tab = Ti.UI.createTab({
		title : L('tasks'),
		icon: '/images/notepad_icon.png'
	});

	var cal_tab = Ti.UI.createTab({
		title : L('calendar'),
		icon: '/images/calendar_icon.png'
	});
	
	var openTaskFunction = function() {
		self.setActiveTab(task_tab);
	};

	//create app tabs
	var task_win = new TasksWindow(task_tab), 
		cal_win = new CalendarWindow(openTaskFunction);

	task_win.containingTab = task_tab;
	cal_win.containingTab = cal_win;

	// Set windows for each tab
	task_tab.window = task_win;
	cal_tab.window = cal_win;

	self.addTab(task_tab);
	self.addTab(cal_tab);

	return self;
};

module.exports = ApplicationTabGroup;

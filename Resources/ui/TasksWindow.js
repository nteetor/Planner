var db = require('lib/db');
var TasksView = require('ui/TasksView');

var DEBUG = function(s) {
	if (true) {
		Ti.API.info('DEBUG: ' + s);
		// set this to false to turn off debug output
	}
};

var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function TasksWindow(containingTab) {
	var self = Ti.UI.createWindow({
		title : L('tasks'),
		backgroundColor : 'white',
		layout : 'vertical'
	});

	var prettyDate = function(date) {
		date = new Date(date);
		return dayOfWeek[date.getDay()] + ', ' + monthName[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
	};

	var self_title = Ti.UI.createLabel({
		text : prettyDate(Ti.App.Properties.getObject('focus_date')),
		top : 5,
		//height : 20
	});
	self.add(self_title);

	self.addEventListener('swipe', function(e) {
		// TODO: we need to consider when we decrement or increment into another month
		// THIS IS DONE AUTOMATICALLY, HELL YEAH

		// if swipe left then increment the date
		if (e.direction == 'left') {
			var old_focus = new Date(Ti.App.Properties.getObject('focus_date'));
			var new_focus = old_focus.setDate(old_focus.getDate() + 1);
			// increment date
			Ti.App.Properties.setObject('focus_date', new_focus);

		}// if swipe right then decrement date
		else if (e.direction == 'right') {
			var old_focus = new Date(Ti.App.Properties.getObject('focus_date'));
			var new_focus = old_focus.setDate(old_focus.getDate() - 1);
			// decrement date
			Ti.App.Properties.setObject('focus_date', new_focus);

		}

		/*
		 * Update information, this will change nothing if the swipe wasn't left or right
		 */
		up_date = new Date(Ti.App.Properties.getObject('focus_date'));
		// get it?
		self_title.setText(prettyDate(up_date));
		tasks_table.setData(db.daylist(up_date));
	});

	/*
	 * the table view that will hold the tasks
	 */
	tasks_list = db.daylist(new Date(Ti.App.Properties.getObject('focus_date')));

	var tasks_rows = new Array();
	for (var i = 0; i < tasks_list.length; i++) {
		tasks_rows[i] = Ti.UI.createTableViewRow(tasks_list[i]);
	}

	var tasks_table = Ti.UI.createTableView({
		data : tasks_rows,
		top : 0,
		scrollable : (tasks_rows.length > 8)
	});

	Ti.API.addEventListener('databaseUpdated', function(e) {
		tasks_table.setScrollable(tasks_rows.length > 8);
	});

	// add the table to our window
	self.add(tasks_table);

	/*
	* The set of buttons for the task window toolbar
	*/
	// ADD button
	var add = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.ADD
	});
	add.addEventListener('click', function(e) {
		var add_task = new TasksView(null);
		add_task.open({
			modal : true
		});
	});

	// EDIT button
	var edit = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.EDIT,
		enabled : (tasks_rows.length > 0)
	});

	// DELETE button
	var del = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.TRASH,
		enabled : (tasks_rows.length > 0)
	});

	// DONE button
	var done = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.DONE,
		enabled : false
	});

	done.addEventListener('click', function(e) {
		del.setScrollable(false);
		edit.setScrollable(false);
	});

	edit.addEventListener('click', function(e) {
		done.setScrollable(true);
	});

	// used to evenly distribute items on the toolbar
	var flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	// set the toolbar for our window using the above buttons
	self.setToolbar([add, flexSpace, edit, flexSpace, del, flexSpace, done], params={
		animated : false
	});

	return self;
}

module.exports = TasksWindow;

// Class Notes:
// there was some time and point in histroy where God created the Quran
// Is it blasphamas to say the Quran is created? Has it always been with God?
// if God can come up with new ideas then the calliphs can create new ideas. This defiles Allah's omnipotence, I think

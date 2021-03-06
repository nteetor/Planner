var db = require('lib/db');
var TaskView = require('ui/TaskView');
var util = require('lib/Util');

function TasksWindow(containingTab) {
	var self = Ti.UI.createWindow({
		title : L('tasks'),
		layout : 'vertical',
		backgroundColor : util.TasksWindowColor.BACKGROUND_COLOR,
		//statusBarStyle : Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
		tintColor : util.TasksWindowColor.TINT_COLOR,
		barColor : util.TasksWindowColor.BAR_COLOR,
		navTintColor : util.TasksWindowColor.TINT_COLOR,
		orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT, Ti.UI.PORTRAIT]
	});
	
	// var window_title = self.getTitleControl();
	// window_title.shadowColor = TEXT_COLOR;
	// self.setTitleControl(window_title);

	var focus_date = new Date(Ti.App.Properties.getObject('focus_date'));
	Ti.App.Properties.addEventListener('change', function() {
		focus_date = new Date(Ti.App.Properties.getObject('focus_date'));
		self.setDay(focus_date);
	});

	var self_title = Ti.UI.createLabel({
		text : util.prettyDate(focus_date),
		top : 5,
		color : util.TasksWindowColor.TEXT_COLOR
	});
	self.add(self_title);
	
	self.setDay = function(new_date) {
		self_title.setText(util.prettyDate(new_date));
		tasks_table.setData(util.tasksToRows(db.daylist(new_date)));
	};

	var openTask = function(task) {
		var add_task = new TaskView(task);
		add_task.open();
	};

	self.setButtons = function(new_date) {
		var enable_status = (db.daycount(new_date) > 0);
		edit.setEnabled(enable_status);
		del.setEnabled(enable_status);
		done.setEnabled(false);
	};

	self.setScrollable = function(new_date) {
		tasks_table.setScrollable((db.daycount(new_date) > 7));
	};

	var swipeEvent = function(e) {
		// if done is enabled then we are in edit or delete mode and should not allow swiping
		// if swipe left then increment the date
		if (e.direction == 'left') {
			focus_date = new Date(focus_date.setDate(focus_date.getDate() + 1));

			// increment date
			Ti.App.Properties.setObject('focus_date', focus_date);

		}// if swipe right then decrement date
		else if (e.direction == 'right') {
			focus_date = new Date(focus_date.setDate(focus_date.getDate() - 1));

			// decrement date
			Ti.App.Properties.setObject('focus_date', focus_date);
		}

		/*
		 * Update information, this will change nothing if the swipe wasn't left or right
		 */
		self.setDay(focus_date);
		self.setButtons(focus_date);
		self.setScrollable(focus_date);
	};

	self.addEventListener('swipe', swipeEvent);

	var tasks_list = db.daylist(focus_date);

	// TABLE OF TASKS (for a particular day)
	var tasks_table = Ti.UI.createTableView({
		data : util.tasksToRows(tasks_list),
		top : 0,
		scrollable : (tasks_list.length > 8),
		backgroundColor : util.TasksWindowColor.BACKGROUND_COLOR,
		moveable : false,
		allowsSelectionDuringEditing: false,
		editable: false
	});

	var watchTasksForClicks = function(watch) {
		function clickEvent(e) {
			openTask(e.rowData);
		}

		if (watch) {
			tasks_table.addEventListener('click', clickEvent);
		} else {
			tasks_table.removeEventListener('click', clickEvent);
		}

	};

	watchTasksForClicks(true);

	Ti.App.addEventListener('databaseUpdated', function(e) {
		updated_tasks = util.tasksToRows(db.daylist(focus_date));

		tasks_table.setData(updated_tasks);
		tasks_table.setScrollable(updated_tasks.length > 8);

		// on database update we need to enable/disable buttons
		if (!edit.enabled && !del.enabled) {
			enable_status = (updated_tasks.length > 0);
			edit.setEnabled(enable_status);
			del.setEnabled(enable_status);
		}
	});

	// add the table to our window
	self.add(tasks_table);

	/*
	* The set of buttons for the task window toolbar
	*/
	// ADD button
	// DELETE button
	var del, edit, done, add;
	if (Ti.Platform.osname == 'android') {
		done = Ti.UI.createButton({
			text: 'Done',
			enabled : false,
			color : util.TasksWindowColor.TEXT_COLOR
		});
		del = Ti.UI.createButton({
			text: 'Delete',
			enabled : (tasks_list.length > 0),
			color : util.TasksWindowColor.TEXT_COLOR
		});
		add = Ti.UI.createButton({
			text: '+',
			color : util.TasksWindowColor.TEXT_COLOR
		});
		edit = Ti.UI.createButton({
			text: 'Edit',
			enabled : (tasks_list.length > 0),
			color : util.TasksWindowColor.TEXT_COLOR
		});
	} else {
		del = Ti.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.TRASH,
			enabled : (tasks_list.length > 0),
			color : util.TasksWindowColor.TEXT_COLOR
		});
		edit = Ti.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.EDIT,
			enabled : (tasks_list.length > 0),
			color : util.TasksWindowColor.TEXT_COLOR,
			backgroundImage : 'none'
		});
		done = Ti.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.DONE,
			title : '+',
			enabled : false,
			color : util.TasksWindowColor.TEXT_COLOR
		});
		add = Ti.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.ADD,
			color : util.TasksWindowColor.TEXT_COLOR
		});
	}
	
	add.addEventListener('click', function(e) {
		openTask({
			start : focus_date,
			end : focus_date,
			description : ''
		});
	});
	
	edit.addEventListener('click', function(e) {
		done.setEnabled(true);
		del.setEnabled(false);
		tasks_table.setFocusable(false);
		self.removeEventListener('swipe', swipeEvent);

		task_ids = tasks_list.map(function(task) {
			return task.id;
		});

		tasks_table.setMoving(true);
	});

	del.addEventListener('click', function(e) {
		edit.setEnabled(false);
		done.setEnabled(true);
		self.removeEventListener('swipe', swipeEvent);

		tasks_table.setFocusable(false);
		tasks_table.setEditing(true);
	});

	done.addEventListener('click', function(e) {
		enable_status = (db.daylist(focus_date).length > 0);
		del.setEnabled(enable_status);
		edit.setEnabled(enable_status);
		done.setEnabled(false);

		// stop movability of tasks
		tasks_table.setMoving(false);

		// stop editability of tasks
		tasks_table.setEditing(false);
		tasks_table.setFocusable(true);
		tasks_table.addEventListener('delete', function(e) {
			db.del(e.rowData.id);
		});

		// use reorder() to save the order of possibly user adjusted tasks
		if (db.daycount(focus_date) > 1) {
			var reorderedTaskList = tasks_table.data[0];
			var taskIDList = new Array();
			for (var i = 0; i < reorderedTaskList.rowCount; i++) {
				var row = reorderedTaskList.rows[i];
				taskIDList.push(row.id);
			}
			db.reorder(taskIDList);
		}

		// reset swipe event listener
		self.addEventListener('swipe', swipeEvent);
	});

	// set the toolbar for our window using the above buttons
	if (Ti.Platform.osname == 'android') {
		self.add(add);
		self.add(edit);
		self.add(del);
		self.add(done);
	} else {
		self.setToolbar([add, util.flexSpace, edit, util.flexSpace, del, util.flexSpace, done], params = {
			animated : false
		});
	}

	return self;
}

module.exports = TasksWindow;

// Class Notes:
// there was some time and point in histroy where God created the Quran
// Is it blasphamas to say the Quran is created? Has it always been with God?
// if God can come up with new ideas then the calliphs can create new ideas. This defiles Allah's omnipotence, I think

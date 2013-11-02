var db = require('lib/db');
var TasksView = require('ui/TasksView');
var util = require('lib/Util');

function TasksWindow(containingTab) {
	var self = Ti.UI.createWindow({
		title : L('tasks'),
		backgroundColor : 'white',
		layout : 'vertical'
	});

	var self_title = Ti.UI.createLabel({
		text : util.prettyDate(Ti.App.Properties.getObject('focus_date')),
		top : 5,
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
		// get it?
		up_date = new Date(Ti.App.Properties.getObject('focus_date'));

		self_title.setText(util.prettyDate(up_date));
		tasks_table.setData(util.tasksToRows(db.daylist(up_date)));
	});

	/*
	 * the table view that will hold the tasks
	 */
	tasks_list = db.daylist(new Date(Ti.App.Properties.getObject('focus_date')));

	// TABLE OF TASKS (for a particular day)
	var tasks_table = Ti.UI.createTableView({
		data : util.tasksToRows(tasks_list),
		top : 0,
		scrollable : (tasks_list.length > 8),
		moveable : true,
		//editable : true
	});

	Ti.App.addEventListener('databaseUpdated', function(e) {
		Ti.API.info('database updated');
		updated_tasks = util.tasksToRows(db.daylist(new Date(Ti.App.Properties.getObject('focus_date'))));
		
		tasks_table.setData(updated_tasks);
		tasks_table.setScrollable(updated_tasks.length > 8);
		
		// if there are now more than 0 tasks we need to enable to the edit and delete buttons
		enable_status = (updated_tasks.length > 0);
		edit.setEnabled(enable_status);
		del.setEnabled(enable_status);
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
		enabled : (tasks_list.length > 0)
	});
	
	edit.addEventListener('click', function(e) {
		done.setEnabled(true);
		del.setEnabled(false);
		
		// make it so tasks can be rearranged.
		// TODO: we need to change the sort value so the order is preserved. 
		// HOWEVER, db.reorder() will do this for us, thanks Salter ... we'll have to remove these comments
		// the saving of the order will take place in the 'done' event listener, sorry this is such a long comment
		
		tasks_table.setMoving(true);		
	});

	// DELETE button
	var del = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.TRASH,
		enabled : (tasks_list.length > 0)
	});
	
	del.addEventListener('click',function(e){
		edit.setEnabled(false);
		done.setEnabled(true);
	});

	// DONE button
	var done = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.DONE,
		enabled : false
	});

	done.addEventListener('click', function(e) {
		enable_status = (db.daylist(new Date(Ti.App.Properties.getObject('focus_date'))).length > 0);
		del.setEnabled(enable_status);
		edit.setEnabled(enable_status);
		done.setEnabled(false);
		
		// stop movability of tasks
		tasks_table.setMoving(false);
	});


	// used to evenly distribute items on the toolbar
	var flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	// set the toolbar for our window using the above buttons
	self.setToolbar([add, flexSpace, edit, flexSpace, del, flexSpace, done], params = {
		animated : false
	});

	return self;
}

module.exports = TasksWindow;

// Class Notes:
// there was some time and point in histroy where God created the Quran
// Is it blasphamas to say the Quran is created? Has it always been with God?
// if God can come up with new ideas then the calliphs can create new ideas. This defiles Allah's omnipotence, I think

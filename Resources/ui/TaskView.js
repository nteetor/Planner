var db = require('lib/db');
var Todo = require('lib/Todo');
var util = require('lib/Util');
var TaskViewTable = require('ui/TaskViewTable');
var TimePickerWindow = require('ui/timePickerWindow');

/**
 * A function which opens a view to either:
 * 	1) add a new task to the focus_date's list of tasks
 *  2) edit a pre-existing task
 *
 * @param {Object} task, a pre-existing task to update
 *
 * CURRENTLY ONLY ADDS NEW TASKS (instead of both editing and adding)
 */
function TaskView(task) {
	task.start = new Date(task.start);
	task.end = new Date(task.end);
	task.descriptionForTaskView = task.descriptionForTaskView || '';

	var self = Ti.UI.createWindow({
		title : task.id ? L('edit_task') : L('add_task'),
		backgroundColor : util.TaskViewColor.BACKGROUND_COLOR,
		navBarHidden : true,
		statusBarStyle : Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT
	});

	self.setLeftNavButton(Ti.UI.createView({}));

	/*
	 * Add task title label
	 */
	var tasks_label = Ti.UI.createLabel({
		text : task.id ? L('edit_task') : L('add_task'),
		top : 40,
		font : {
			fontSize : 24
		},
		color : util.TaskViewColor.TEXT_COLOR
	});

	/*
	 *  OK BUTTON
	 */
	var ok = Ti.UI.createButton({
		title : L('ok'),
		color : util.TaskViewColor.TEXT_COLOR,
		right : 30
	});
	ok.addEventListener('click', function(e) {
		task.start = fields_table.getStartTime();
		task.end = fields_table.getEndTime(); 
		
		if (task.start > task.end) {
			alert('End time comes before start time');
		} else {
			var new_task = new Todo({
				'start' : task.start,
				'end' : task.end,
				'description' : fields_table.getMFDescription() //descriptionContent.text
			});

			if (task.id) {
				new_task.id = task.id;
				db.update(new_task);
			} else {
				// TODO: I'm not entirely sure what the sort argument should be
				db.add(new_task, db.daylist(new Date(Ti.App.Properties.getObject('focus_date'))).length);
			}

			self.close();
		}
	});

	/*
	 *  CANCEL BUTTON
	 */
	var cancel = Ti.UI.createButton({
		title : L('cancel'),
		color : util.TaskViewColor.TEXT_COLOR,
		left : 20
	});
	cancel.addEventListener('click', function(e) {
		self.close();
	});
	
	var cancelOKRow = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		height : 30
	});
	
	cancelOKRow.add(cancel);
	cancelOKRow.add(ok);

	var fields_table = new TaskViewTable(task);
	fields_table.addCancelOKRow(cancelOKRow);
	
	self.add(tasks_label);
	self.add(fields_table);

	return self;
}

module.exports = TaskView;

// The thoughts of scientists are more important than the blood of martys
// awesomeness

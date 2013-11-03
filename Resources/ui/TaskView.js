var db = require('lib/db');
var Todo = require('lib/Todo');
var util = require('lib/Util');
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
	var self = Ti.UI.createWindow({
		title : L('add_task'),
		backgroundColor : 'white',
		navBarHidden : true
	});
	

	self.setLeftNavButton(Ti.UI.createView({}));

	/*
	 * Add task title label
	 */
	var tasks_label = Ti.UI.createLabel({
		text : L('add_task'),
		top : 40,
		font : {
			fontSize : 24
		}
	});

	/*
	* Button bar section
	* includes OKAY and CANCEL buttons and the button bar itself
	*/
	// OK BUTTON
	var ok = Ti.UI.createButton({
		title : L('ok'),
	});
	ok.addEventListener('click', function(e) {
		var new_task = new Todo({
			'start' : task.start,
			'end' : task.end,
			'description' : description_field.value
		});
		Ti.API.info('new_task.start value is ' + new_task.start);
		
		// I'm not entirely sure what the sort argument should be
		db.add(new_task, db.daylist(new Date(Ti.App.Properties.getObject('focus_date'))).length);
		self.close();
	});

	// CANCEL BUTTON
	var cancel = Ti.UI.createButton({
		title : L('cancel'),
	});
	cancel.addEventListener('click', function(e) {
		self.close();
	});

	var fixedSpace = Ti.UI.createButton({
		width : 10,
		systemButton : Ti.UI.iPhone.SystemButton.FIXED_SPACE
	});

	var button_bar = Titanium.UI.iOS.createToolbar({
		items : [fixedSpace, ok, util.flexSpace, cancel, fixedSpace],
		bottom : 10,
		barColor : 'white'
	});

	/*
	* Task fields section, includes a tableview to hold the label-textfield pairs
	* also event listeners
	*/
	// some constants because I got sick of chaning variables
	var LABEL_WIDTH = 130;
	var LABEL_HEIGHT = 50;
	var FIELD_LEFT_POS = LABEL_WIDTH + 20;

	var row1 = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	var description_label = Ti.UI.createLabel({
		text : L('description'),
		left : 10,
		width : LABEL_WIDTH,
		height : LABEL_HEIGHT,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : 24
		}
	});

	var description_field = Ti.UI.createTextField({
		left : FIELD_LEFT_POS,
		right : 10,
	});

	row1.add(description_label);
	row1.add(description_field);

	var startLabel = Ti.UI.createLabel({
		text : L('start_time'),
		left : 10,
		width : LABEL_WIDTH,
		height : LABEL_HEIGHT,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : 24
		}
	});
	
	var startValue = Ti.UI.createLabel({
		text : task.start.toTimeString(),
		left : FIELD_LEFT_POS,
		right: 10,
		font : {
			fontSize : 24
		}
	});

	var startRow = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	startRow.add(startLabel);
	startRow.add(startValue);
	
	startRow.addEventListener('click', function() {
		var timePicker = new TimePickerWindow(task.start, function(time) {
			task.start = time;
		});
		timePicker.open();
		timePicker.addEventListener('close', function() {
			startValue.text = task.start.toTimeString();
		});
	});

	var endLabel = Ti.UI.createLabel({
		text : L('end_time'),
		left : 10,
		width : LABEL_WIDTH,
		height : LABEL_HEIGHT,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : 24
		}
	});

	var endValue = Ti.UI.createLabel({
		text : task.end.toTimeString(),
		left : FIELD_LEFT_POS,
		right: 10,
		font : {
			fontSize : 24
		}
	});

	var endRow = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});
	
	endRow.addEventListener('click', function() {
		var timePicker = new TimePickerWindow(task.end, function(time) {
			task.end = time;
		});
		timePicker.open();
		timePicker.addEventListener('close', function() {
			endValue.text = task.end.toTimeString();
		});
	});

	endRow.add(endLabel);
	endRow.add(endValue);

	var data = [row1, startRow, endRow];

	// using a table we can achieve the label text-area look we want for this page
	var fields_table = Ti.UI.createTableView({
		data : data,
		top : 80,
		backgroundColor : 'white',
		style : Ti.UI.iPhone.TableViewStyle.GROUPED,
		scrollable : false
	});

	self.add(tasks_label);
	self.add(fields_table);
	self.add(button_bar);

	return self;
}

module.exports = TaskView;

// The thoughts of sciencetists are more important than the blood of martys
// awesomeness

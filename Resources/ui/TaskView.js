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
	task.start = new Date(task.start);
	task.end = new Date(task.end);
	Ti.API.info('task desc is '+db.getDesc(task.id));
	task.description = db.getDesc(task.id);

	var self = Ti.UI.createWindow({
		title : task.id ? L('edit_task') : L('add_task'),
		backgroundColor : 'white',
		navBarHidden : true
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
		if (task.start > task.end) {
			alert('End time comes before start time');
		} else {
			Ti.API.info('line 50 in TaskView.js, description is '+task.description);
			var new_task = new Todo({
				'start' : task.start,
				'end' : task.end,
				'description' : descriptionContent.text
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

	// CANCEL BUTTON
	var cancel = Ti.UI.createButton({
		title : L('cancel')
	});
	cancel.addEventListener('click', function(e) {
		self.close();
	});

	var fixedSpace = Ti.UI.createButton({
		width : 10,
		systemButton : Ti.UI.iPhone.SystemButton.FIXED_SPACE
	});

	var button_bar = Titanium.UI.iOS.createToolbar({
		items : [fixedSpace, cancel, util.flexSpace, ok, fixedSpace],
		bottom : 10,
		barColor : '#AAAAAA'
	});

	/*
	* Task fields section, includes a tableview to hold the label-textfield pairs
	* also event listeners
	*/
	// some constants because I got sick of chaning variables
	var LABEL_WIDTH = 110;
	var FIELD_WIDTH = 160;
	var LABELFONTSIZE = 18;
	var VALUEFONTSIZE = 18;
	var ROW_HEIGHT = 40;
	var FIELD_LEFT = LABEL_WIDTH + 20;

	var descriptionRow = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	var description_label = Ti.UI.createLabel({
		text : L('description'),
		left : 10,
		width : LABEL_WIDTH,
		height : ROW_HEIGHT,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : LABELFONTSIZE
		}
	});

	var descriptionContent = Ti.UI.createLabel({
		left : FIELD_LEFT,
		width : FIELD_WIDTH,
		height : 30,
		text : db.getDesc(task.id),
		font : {
			fontSize : VALUEFONTSIZE
		}
	});

	descriptionRow.addEventListener('click', function() {
		var textWin = Ti.UI.createWindow({
			navBarHidden : true,
			backgroundColor : 'black'
		});
		var textArea = Ti.UI.createTextArea({
			value : descriptionContent.text,
			height : 150,
			width : 300,
			top : 50,
			returnKeyType : Ti.UI.RETURNKEY_DONE
		});

		var cancelButton = Ti.UI.createButton({
			title : L('cancel'),
			top : 10,
			height : 30,
			width : 80,
			color : 'black',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		});

		cancelButton.addEventListener('click', function() {
			textWin.close();
		});

		textArea.addEventListener('blur', function() {
			descriptionContent.text = textArea.value;
			textWin.close();
		});

		textWin.add(textArea);
		textWin.add(cancelButton);
		textWin.open();
		textArea.focus();
	});

	descriptionRow.add(description_label);
	descriptionRow.add(descriptionContent);

	var startLabel = Ti.UI.createLabel({
		text : L('start_time'),
		left : 10,
		width : LABEL_WIDTH,
		height : ROW_HEIGHT,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : LABELFONTSIZE
		}
	});

	//Ti.API.info(task.start);
	var startValue = Ti.UI.createLabel({
		text : util.prettyTime(task.start),
		left : FIELD_LEFT,
		width : FIELD_WIDTH,
		height : ROW_HEIGHT,
		right : 10,
		font : {
			fontSize : VALUEFONTSIZE
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
			startValue.text = util.prettyTime(task.start);
		});
	});

	var endLabel = Ti.UI.createLabel({
		text : L('end_time'),
		left : 10,
		width : LABEL_WIDTH,
		height : ROW_HEIGHT,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : LABELFONTSIZE
		}
	});

	var endValue = Ti.UI.createLabel({
		text : util.prettyTime(task.end),
		left : FIELD_LEFT,
		width : FIELD_WIDTH,
		height : ROW_HEIGHT,
		right : 10,
		font : {
			fontSize : VALUEFONTSIZE
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
			endValue.text = util.prettyTime(task.end);
		});
	});

	endRow.add(endLabel);
	endRow.add(endValue);

	var data = [descriptionRow, startRow, endRow];

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

// The thoughts of scientists are more important than the blood of martys
// awesomeness

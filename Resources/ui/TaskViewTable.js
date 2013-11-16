/**
 * An overhaul of the TableView which makes up the majority of TaskView.js
 */
var util = require('lib/Util');

var LABEL_WIDTH = 110;
var FIELD_WIDTH = 160;
var LABELFONTSIZE = 18;
var VALUEFONTSIZE = 18;
var ROW_HEIGHT = 40;
var FIELD_LEFT = LABEL_WIDTH + 20;
var TEXTAREA_HEIGHT = 150;
var BASE_FIELDS = 6;

function TaskViewTable(task) {
	// using a table we can achieve the label text-area look we want for this page
	var self = Ti.UI.createTableView({
		top : 30,
		backgroundColor : util.TaskViewColor.BACKGROUND_COLOR,
		style : Ti.UI.iPhone.TableViewStyle.GROUPED,
		scrollable : false,
		separatorColor : util.TaskViewColor.BACKGROUND_COLOR
	});

	/*
	 * PRIVATE METHODS
	 */
	var removeRowAt = function(index) {
		data.splice(index, 1);
		self.setData(data);
	};

	var insertRowAfter = function(index, row) {
		data.splice(index + 1, 0, row);
		self.setData(data);
	};

	/*
	* IMPORTANT PUBLIC METHODS
	*/
	/**
	 * on orientation change
	 */
	self.reorientTable = function(orientation) {
		var allFields = [description_label, descriptionContent, startLabel, startValue, endLabel, endValue];
		var LEFT_ADJUST = 150;
		var ROWHEIGHT_ADJUST = 15;
		var WIDTH_FACTOR = 1.5;
		var OKCANCEL_FACTOR = 12;

		if (orientation == Ti.UI.PORTRAIT) {
			allFields.map(function(field) {
				field.setLeft(field.left - LEFT_ADJUST);
				field.setHeight(field.height + ROWHEIGHT_ADJUST);
			});
			textArea.setWidth(textArea.width / WIDTH_FACTOR);

			startPickerCancel.setLeft(startPickerCancel.left / OKCANCEL_FACTOR);
			startPickerOK.setRight(startPickerOK.right / OKCANCEL_FACTOR);

			endPickerCancel.setLeft(endPickerCancel.left / OKCANCEL_FACTOR);
			endPickerOK.setRight(endPickerOK.right / OKCANCEL_FACTOR);
			
		} else {
			allFields.map(function(field) {
				field.setLeft(field.left + LEFT_ADJUST);
				field.setHeight(field.height - ROWHEIGHT_ADJUST);
			});
			textArea.setWidth(textArea.width * WIDTH_FACTOR);

			startPickerCancel.setLeft(startPickerCancel.left * OKCANCEL_FACTOR);
			startPickerOK.setRight(startPickerOK.right * OKCANCEL_FACTOR);

			endPickerCancel.setLeft(endPickerCancel.left * OKCANCEL_FACTOR);
			endPickerOK.setRight(endPickerOK.right * OKCANCEL_FACTOR);
		}
	};

	/**
	 * getDescription, this should pull the description from 'descriptionContent' (text of descriptionContent)
	 */
	self.getMFDescription = function() {
		return descriptionContent.text;
	};

	/**
	 * getStartTime
	 */
	self.getStartTime = function() {
		return new Date(task.start);
	};

	/**
	 * getEndTime
	 */
	self.getEndTime = function() {
		return new Date(task.end);
	};

	/**
	 * addRow
	 */
	self.addCancelOKRow = function(row) {
		data.push(row);
		self.setData(data);
	};

	/*
	 * DESCRIPTION ROW
	 */
	var descriptionRow = Ti.UI.createTableViewRow({
		height : ROW_HEIGHT,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	var description_label = Ti.UI.createLabel({
		text : L('description'),
		color : util.TaskViewColor.TEXT_COLOR,
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
		height : ROW_HEIGHT,
		color : util.TaskViewColor.TEXT_COLOR,
		text : task.descriptionForTaskView,
		font : {
			fontSize : VALUEFONTSIZE
		}
	});

	descriptionRow.addEventListener('click', function() {
		if (data.length <= 5) {
			insertRowAfter(0, textAreaRow);
			textArea.focus();
		}
	});

	descriptionRow.add(description_label);
	descriptionRow.add(descriptionContent);

	/*
	 * TEXT AREA ROW FOR DESCRIPTION
	 */
	var textArea = Ti.UI.createTextArea({
		value : task.descriptionForTaskView,
		height : 150,
		width : 300,
		returnKeyType : Ti.UI.RETURNKEY_DONE
	});

	textArea.addEventListener('blur', function(e) {
		removeRowAt(1);
		descriptionContent.text = textArea.value;
		//textArea.blur();
	});

	var textAreaRow = Ti.UI.createTableViewRow({
		height : 150,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});

	textAreaRow.add(textArea);

	/*
	 * START TIME ROW
	 */
	var startLabel = Ti.UI.createLabel({
		text : L('start_time'),
		left : 10,
		width : LABEL_WIDTH,
		height : ROW_HEIGHT,
		color : util.TaskViewColor.TEXT_COLOR,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font : {
			fontSize : LABELFONTSIZE
		}
	});

	var startValue = Ti.UI.createLabel({
		text : util.prettyTime(task.start),
		date : task.start,
		left : FIELD_LEFT,
		width : FIELD_WIDTH,
		height : ROW_HEIGHT,
		color : util.TaskViewColor.TEXT_COLOR,
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
		if (data.length <= 5) {
			insertRowAfter(1, startPickerRow);
		}
	});

	/*
	 * START TIME PICKER AND ROW
	 */
	var startPicker = Ti.UI.createPicker({
		type : Titanium.UI.PICKER_TYPE_TIME,
		selectionIndicator : true,
		value : task.start,
		top : 30,
	});

	var startPickerOK = Ti.UI.createButton({
		title : L('ok'),
		top : 5,
		right : 10,
		color : util.TaskViewColor.TEXT_COLOR,
		font : {
			fontSize : 10
		}
	});

	startPickerOK.addEventListener('click', function(e) {
		removeRowAt(2);
		startValue.setText(util.prettyTime(startPicker.getValue()));
		task.start = startPicker.getValue();
	});

	var startPickerCancel = Ti.UI.createButton({
		title : L('cancel'),
		color : util.TaskViewColor.TEXT_COLOR,
		top : 5,
		left : 10,
		font : {
			fontSize : 10
		}
	});

	startPickerCancel.addEventListener('click', function() {
		removeRowAt(2);
	});

	var startPickerRow = Ti.UI.createTableViewRow({
		height : 250,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	startPickerRow.add(startPickerCancel);
	startPickerRow.add(startPickerOK);
	startPickerRow.add(startPicker);

	/*
	 * END TIME ROW
	 */
	var endLabel = Ti.UI.createLabel({
		text : L('end_time'),
		left : 10,
		width : LABEL_WIDTH,
		height : ROW_HEIGHT,
		color : util.TaskViewColor.TEXT_COLOR,
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
		color : util.TaskViewColor.TEXT_COLOR,
		font : {
			fontSize : VALUEFONTSIZE
		}
	});

	var endRow = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	endRow.addEventListener('click', function() {
		if (data.length <= 5) {
			insertRowAfter(2, endPickerRow);
		}
	});

	endRow.add(endLabel);
	endRow.add(endValue);

	/*
	 * END TIME PICKER
	 */
	var endPicker = Ti.UI.createPicker({
		type : Titanium.UI.PICKER_TYPE_TIME,
		selectionIndicator : true,
		value : task.start,
		top : 30,
	});

	var endPickerOK = Ti.UI.createButton({
		title : L('ok'),
		top : 5,
		right : 10,
		color : util.TaskViewColor.TEXT_COLOR,
		font : {
			fontSize : 10
		}
	});

	endPickerOK.addEventListener('click', function(e) {
		removeRowAt(3);
		endValue.setText(util.prettyTime(endPicker.getValue()));
		task.end = endPicker.getValue();
	});

	var endPickerCancel = Ti.UI.createButton({
		title : L('cancel'),
		color : util.TaskViewColor.TEXT_COLOR,
		top : 5,
		left : 10,
		font : {
			fontSize : 10
		}
	});

	endPickerCancel.addEventListener('click', function() {
		removeRowAt(3);
	});

	var endPickerRow = Ti.UI.createTableViewRow({
		height : 250,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	endPickerRow.add(endPickerCancel);
	endPickerRow.add(endPickerOK);
	endPickerRow.add(endPicker);

	var blankRow = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	var data = [descriptionRow, startRow, endRow, blankRow];
	self.setData(data);

	return self;
};

module.exports = TaskViewTable;

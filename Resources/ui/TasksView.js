/**
 * A function which opens a view to either:
 * 	1) add a new task to the focus_date's list of tasks
 *  2) edit a pre-existing task
 *
 * @param {Object} task, a pre-existing task to update
 */
function TasksView(task) {
	var self = Ti.UI.createWindow({
		title : L('add_task'),
		layout : 'vertical'
	});

	/*
	 * Bottom button bar section, includes OKAY and CANCEL buttons
	 */
	var ok = Ti.UI.createButton({
		title : L('ok')
	});
	ok.addEventListener('click', function(e) {
		self.close();
	});

	var cancel = Ti.UI.createButton({
		title : L('cancel')
	});
	cancel.addEventListener('click', function(e) {
		self.close();
	});

	var bottom_bar = Ti.UI.createButtonBar({
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		bottom : 0
	});

	self.add(bottom_bar);

	/*
	 * Task fields section, includes a tableview to hold the label-textfield pairs
	 * also event listeners
	 */
	var description_row = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	var description_label = Ti.UI.createLabel({
		text : 'Description',
		left : 10
	});

	var description_field = Ti.UI.createTextField({
		left : 100,
		right : 10,
	});

	description_row.add(description_label);
	description_row.add(description_field);

	var data = [description_row];

	// using a table we can achieve the label text-area look we want for this page
	var fields_table = Ti.UI.createTableView({
		data : data,
		style : Ti.UI.iPhone.TableViewStyle.GROUPED
	});

	self.add(fields_table);

	return self;
}

module.exports = TasksView;

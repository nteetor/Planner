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
		backgroundColor : 'white',
		//modal : 'true',
		layout : 'vertical'
	});
	
	self.setLeftNavButton(Ti.UI.createView({}));

	/*
	 * Bottom button bar section, includes OKAY and CANCEL buttons
	 */
	var ok = Ti.UI.createButton({
		title : L('ok'),
		bottom : 300,
		left : 10
	});
	ok.addEventListener('click', function(e) {
		self.close();
	});
	
	self.add(ok);

	var cancel = Ti.UI.createButton({
		title : L('cancel'),
		bottom : 300,
		right : 10
	});
	cancel.addEventListener('click', function(e) {
		self.close();
	});

	self.add(cancel);
	
	/*
	 * Task fields section, includes a tableview to hold the label-textfield pairs
	 * also event listeners
	 */
	var row1 = Ti.UI.createTableViewRow({
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

	row1.add(description_label);
	row1.add(description_field);

	var data = [row1];

	// using a table we can achieve the label text-area look we want for this page
	var fields_table = Ti.UI.createTableView({
		data : data,
		top : 100,
		backgroundColor : 'white',
		style : Ti.UI.iPhone.TableViewStyle.GROUPED
	});

	//self.add(fields_table);

	return self;
}

module.exports = TasksView;

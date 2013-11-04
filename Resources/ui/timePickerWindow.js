/**
 * Creates a window with a time picker
 * 
 * @param Date time
 * @param function: setTime
 */
var util = require('lib/Util');

function TimePickerWindow(time, setTime) {
	var self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor: 'black'
	});
	
	var picker = Ti.UI.createPicker({
		type: Titanium.UI.PICKER_TYPE_TIME,
		selectionIndicator: true,
		value: time
	});

	var ok = Ti.UI.createButton({
		title : L('ok'),
	});
	
	ok.addEventListener('click', function(e) {
		setTime(picker.value);
		self.close();
	});
	
	var cancel = Ti.UI.createButton({
		title : L('cancel')
	});
	
	cancel.addEventListener('click', function() {
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
	
	self.add(button_bar);
	
	self.add(picker);
	
	return self;
}

module.exports = TimePickerWindow;

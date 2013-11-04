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
	
	picker.addEventListener('change', function(e) {
		setTime(e.value);
	});
	
	var done = Ti.UI.createButton({
		text: L('ok'),
		bottom: 50,
		width: 80,
		height: 30
	});
	
	done.addEventListener('click', function(e) {
		self.close();
	});
	
	self.add(picker);
	self.add(done);
	
	return self;
}

module.exports = TimePickerWindow;

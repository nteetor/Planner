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
		bottom: 50,
		text: L('ok')
	});
	
	done.addEventListener('click', function(e) {
		self.close();
	});
	
	self.add(picker);
	self.add(done);
	
	return self;
}

module.exports = TimePickerWindow;

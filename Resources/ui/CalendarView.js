// CalendarView
// Author:  R. M. Salter
var db = require('lib/db');
var screenWidth = Ti.Platform.displayCaps.platformWidth;
var util = require('lib/Util');

// exported function CalendarView returns a new monthly view
// dis_date is the date whose year and month are to be displayed; sel_date is currently selected JS date
// _cb is a callback function that is invoked on the new selected JS date when one is selected

function CalendarView(dis_date, sel_date, _cb) {
	// break down display date -- only need month and year
	var dyr = dis_date.getFullYear(), dmo = dis_date.getMonth();
	// break down selected date
	var syr = sel_date.getFullYear(), smo = sel_date.getMonth(), sda = sel_date.getDate();
	// what's today's date?
	today = new Date();
	// break down today
	var tyr = today.getFullYear(), tmo = today.getMonth(), tda = today.getDate();
	var toolBar = makeToolBar(dyr, dmo);
	var cal = calendar(dyr, dmo, syr, smo, sda, tyr, tmo, tda, _cb);
	// Main View of the Month View.
	var self = Ti.UI.createView({
		layout : 'vertical'
	});
	self.add(toolBar);
	self.add(cal);

	// if 'up' increment month, 'down' decrement
	self.shiftMonth = function(direction) {
		if (direction == 'up') {
			if (dmo == 11) {
				dyr++;
				dmo = 0;
			} else {
				dmo++;
			}
		} else if (direction == 'down') {
			if (dmo == 0) {
				dyr--;
				dmo = 11;
			} else {
				dmo--;
			}
		}
		toolBar = makeToolBar(dyr, dmo);
		cal = calendar(dyr, dmo, syr, smo, sda, tyr, tmo, tda, _cb);
		self.removeAllChildren();
		self.add(toolBar);
		self.add(cal);
	};

	Ti.API.addEventListener('setCalDate', function(e) {
		if (sameDate(dis_date, e.date) && sameDate(sel_date, e.date))
			return;
		sel_date = e.date;
		dis_date = e.date;
		// break down selected date
		var syr = sel_date.getFullYear(), smo = sel_date.getMonth(), sda = sel_date.getDate();
		toolBar = makeToolBar(syr, smo);
		cal = calendar(syr, smo, syr, smo, sda, tyr, tmo, tda, _cb);
		self.removeAllChildren();
		self.add(toolBar);
		self.add(cal);
	});
	return self;
}

// Help function to identify to JS dates that represent the same real date

function sameDate(d0, d1) {
	return d0.getFullYear() == d1.getFullYear() && d0.getMonth() == d1.getMonth() && d0.getDate() == d1.getDate();
}

// Builds the toolbar for a give year and month

function makeToolBar(yr, mo) {
	// Tool Bar
	var toolBar = Ti.UI.createView({
		width : screenWidth,
		height : 50,
		backgroundColor : util.CalendarWindowColor.BACKGROUND_COLOR,
		layout : 'vertical'
	});
	// Tool Bar Title
	var toolBarTitle = Ti.UI.createView({
		top : '3dp',
		width : '322dp',
		height : '24dp'
	});
	// Month Title - Tool Bar
	var monthTitle = Ti.UI.createLabel({
		width : 200,
		height : 24,
		text : monthName[mo] + ' ' + yr,
		textAlign : 'center',
		color : util.CalendarWindowColor.TEXT_COLOR,
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		}
	});
	toolBarTitle.add(monthTitle);
	// Tool Bar Day
	var toolBarDays = Ti.UI.createView({
		top : 2,
		width : 322,
		height : 22,
		layout : 'horizontal',
		left : 0
	});
	var dayLabel = function(daytxt) {
		return Ti.UI.createLabel({
			left : '0dp',
			height : '20dp',
			text : daytxt,
			width : '46dp',
			textAlign : 'center',
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			color : util.CalendarWindowColor.TEXT_COLOR
		});
	};
	for (var i in dayOfWeek)
	toolBarDays.add(dayLabel(dayOfWeek[i]));
	// Adding Tool Bar Title View & Tool Bar Days View
	toolBar.add(toolBarTitle);
	toolBar.add(toolBarDays);
	return toolBar;
}

// Builds the calendar for a given year and month (yr and mo)
// syr, smo and sda are the selected year, month and day
// tyr, tmo and tda are today
// _cb is the callback applied to the new selected date when one is selected

var calendar = function(yr, mo, syr, smo, sda, tyr, tmo, tda, _cb) {
	// yr,mo,da are selected day; tyr,tmo,tda are today
	//create main calendar view
	var mainView = Ti.UI.createView({
		layout : 'horizontal',
		width : 322,
		height : 'auto',
		cb : _cb
	});

	// determine the cal data
	var isCurrentMonth = (yr == tyr && mo == tmo);
	var isSelectedMonth = (yr == syr && mo == smo);
	var daysInMonth = 32 - new Date(yr, mo, 32).getDate();
	var dayOfMonthToday = tda;
	var dayOfWeek = new Date(yr, mo, 1).getDay();
	var daysInLastMonth = 32 - new Date(yr, mo - 1, 32).getDate();
	var daysInNextMonth = (new Date(yr, mo, daysInMonth).getDay()) - 6;
	//set initial day of week number
	var dayNumber = daysInLastMonth - dayOfWeek + 1;
	//get last month's days
	for ( i = 0; i < dayOfWeek; i++) {
		mainView.add(new dayView({
			day : dayNumber,
			taskcount : db.daycount(new Date(yr, mo, dayNumber)),
			color : '#8e959f',
			current : 'no',
		}));
		dayNumber++;
	};
	// reset day number for current month
	dayNumber = 1;
	//get this month's days
	var oldDay = {};
	for ( i = 0; i < daysInMonth; i++) {
		var newDay = new dayView({
			day : dayNumber,
			taskcount : db.daycount(new Date(yr, mo, dayNumber)),
			color : util.CalendarWindowColor.CURRENTDATE_COLOR, //'#3a4756',
			current : 'yes',
		});
		mainView.add(newDay);
		// if this day is today, show it
		if (isCurrentMonth && tda == dayNumber) {
			newDay.color = 'white';
			newDay.backgroundColor = util.CalendarWindowColor.CURRENTDATE_COLOR; //'#FFFFF000';
			oldDay = newDay;
		}
		// if this day is the chosen day, select it
		if (isSelectedMonth && dayNumber == sda)
			select(newDay);
		dayNumber++;
	}
	// reset day number for next month
	dayNumber = 1;
	//get remaining month's days
	for ( i = 0; i > daysInNextMonth; i--) {
		mainView.add(new dayView({
			day : dayNumber,
			taskcount : db.daycount(new Date(yr, mo, dayNumber)),
			color : '#8e959f',
			current : 'no',
		}));
		dayNumber++;
	}
	// day selection event listener
	mainView.addEventListener('click', function(e) {
		if (e.source.current == 'yes') {
			select(e.source);
			if (mainView.cb != null)
				mainView.cb(new Date(yr, mo, e.source.text));
		}
	});
	return mainView;

	// function to highlight selected day
	function select(dayView) {
		if (isCurrentMonth && oldDay.text == dayOfMonthToday) {
			oldDay.color = 'white';
			oldDay.backgroundColor = util.CalendarWindowColor.CURRENTDATE_COLOR;			//'#FFFFF000';
			oldDay.borderColor = util.CalendarWindowColor.CURRENTDATE_COLOR;
		} else {
			oldDay.color = '#3a4756';
			oldDay.backgroundColor = util.CalendarWindowColor.FOCUSDATE_COLOR;			//'#FFDCDCDF';
			oldDay.borderColor = util.CalendarWindowColor.FOCUSDATE_COLOR;
		}
		oldDay.backgroundPaddingLeft = 0;
		oldDay.backgroundPaddingBottom = 0;
		if (isCurrentMonth && dayView.text == dayOfMonthToday) {
			dayView.backgroundColor = util.CalendarWindowColor.OVERLAP_COLOR;			//'#FFFF00FF';
			dayView.borderColor = util.CalendarWindowColor.OVERLAP_COLOR;
		} else {
			dayView.backgroundColor = util.CalendarWindowColor.FOCUSDATE_COLOR;			//'#FFFF0000';
			dayView.borderColor = util.CalendarWindowColor.FOCUSDATE_COLOR;
		}
		dayView.backgroundPaddingLeft = 1;
		dayView.backgroundPaddingBottom = 1;
		dayView.color = 'white';
		oldDay = dayView;
	};
};

// creates a label for a day given an object containing date
// of month and color

function dayView(e) {
	var self = Ti.UI.createView({
		width : '46dp',
		height : '44dp',
		current : e.current,
		color : e.color,
		backgroundColor : util.CalendarWindowColor.BACKGROUND_COLOR,
		borderColor : util.CalendarWindowColor.BORDER_COLOR,
		borderWidth : '1dp'
	});

	var dayLabel = Ti.UI.createLabel({
		text : e.day,
		textAlign : 'center',
		color : e.current == 'yes' ? 'black' : '#888888',
		current : e.current,
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		}
	});

	if (e.taskcount) {
		var taskNotifier = Ti.UI.createLabel({
			text : e.taskcount,
			textAlign : 'center',
			right : '2dp',
			top : '2dp',
			//backgroundColor : util.CalendarWindowColor.BACKGROUND_COLOR,
			color : 'black',
			font : {
				fontSize : 9,
				fontWeight : 'bold'
			}
		});
		self.add(taskNotifier);
	}

	self.text = dayLabel.text;

	self.add(dayLabel);

	return self;
};

var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports = CalendarView;

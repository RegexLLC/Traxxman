var domain = "https://Traxxman.com/api/";
//var domain = "http://192.168.78.1/Traxxman/api/";

$.mobile.phonegapNavigationEnabled = true

function check() {

	var un = document.getElementById('username').value;
	var action = 'check';
	$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&action=' + action, function (res) {
					alertify.success('The username ' + un + res.status + '!');
	});

}

function login() {

	var un = document.getElementById("username").value;
	var pw = document.getElementById("password").value;

	var action = 'login';

	$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&action=' + action, function (res) {
		if (res.status == "success") {
			api = res.api;
			window.localStorage.setItem("api", res.api);
			if (api != 'undefined') {
				window.location = "dashboard.html";
			} else {
				alertify.error("Error logging in!");
			}
		} else {
			alertify.success(res.status)
		}
	});
}

function forgot() {

	var em = document.getElementById("email").value;

	var action = 'forgot';

	$.getJSON(domain + 'proxy.php?callback=?', 'em=' + em + '&action=' + action, function (res) {
		alertify.success(res.status);
	});
}

function signup() {
	var un = document.getElementById('username').value;
	var em = document.getElementById('email').value;
	var pw = document.getElementById('password').value;
	var pw2 = document.getElementById('password2').value;
	var action = 'reg';
	if (document.getElementById('email').value == '' || document.getElementById('username').value == '' || document.getElementById('password').value == '' || document.getElementById('password2').value == '') {
		alertify.error("All fields must be completed");
	} else {
		if (pw == pw2) {
			$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&em=' + em + '&action=' + action, function (res) {


				if (res.status == 'That does not appear to be a valid email address') {
					alert.error(res.status);
				} else {
					alertify.success(res.status);
					document.getElementById('email').value = '';
					document.getElementById('username').value = '';
					document.getElementById('password').value = '';
					document.getElementById('password2').value = '';
				}
				if (res.status == 'That email address is already registed with Traxxman') {
					alerify.error(res.status);
				} else {
					alertify.success(res.status);
					document.getElementById('email').value = '';
					document.getElementById('username').value = '';
					document.getElementById('password').value = '';
					document.getElementById('password2').value = '';
				}

			});
		} else {
			alertify.error("Your passwords do not match");
		}
	}


}

function logOutReady() {
	window.localStorage.removeItem("api");
	window.location = "index.html";
}

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

function loadworkorderslist() {
	$('#workOrdersList li').remove();

	$.getJSON(domain + "workorders/" + window.localStorage.getItem("api"), function (data) {

		var splitme = data.workorderids;
		var workorders = splitme.split(', ');

		$.each(workorders, function (index, value) {
			$.getJSON(domain + "workorders/" + value + "/" + window.localStorage.getItem("api"), function (data) {
				$.getJSON(domain + "workorderaddress/" + value + "/" + window.localStorage.getItem("api"), function (addressdata) {
					$.getJSON(domain + "workordertitle/" + value + "/" + window.localStorage.getItem("api"), function (titledata) {
						var ordernumber = value.replace('x',' ');
						$.getJSON(domain + "tools/createmap/" + addressdata[0].eventdata, function (addressdata) {
	$('#workOrdersList').append('<li><a href="javascript:void(0)" onclick="createWorkOrderPage(' + "'" + value + "'" + ')"><img src="' + addressdata + '"></img><h2>'+ titledata[0].eventdata + '</h2><p>Work Order #' + ordernumber + '</p></a></li>');
								
								
							$('#workOrdersList').listview().listview('refresh');
						
						});
					});
				});
			});
		});
	});
};




function addWorkOrders() {
	var ordernumber = $('#ordernumber').val();
	var ordertitle = $('#ordertitle').val();
	var orderlocation = $('#orderlocation').val()
	function formToJSONWOADD() {
	return JSON.stringify({
		"ordernumber": ordernumber,
		"api": window.localStorage.getItem("api"),
		"ordertitle": ordertitle,
		"orderlocation": orderlocation
	});
	}
	document.getElementById('ordernumber').value = '';
	document.getElementById('ordertitle').value = '';
	document.getElementById('orderlocation').value = '';
	window.location = "dashboard.html#workorders";
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: domain + 'workorders',
		dataType: 'json',
		data: formToJSONWOADD(),
		success: function (data, textStatus, jqXHR) {
			$(function () {
				alertify.success('<b>Work Order #' + ordernumber + ' Created</b>');
			});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$(function () {
				alertify.error('<b>Work Order Error: ' + textStatus + '</b>');
			});
		}
	});
};

function loadnavbar() {
	$.getJSON(domain + "fullname/" + window.localStorage.getItem("api"), function (data) {
		document.getElementById('username').innerHTML = "<p>" + data[0].fullname + "</p>";
	});
	$.getJSON(domain + "workordercount/" + window.localStorage.getItem("api"), function (data) {
		document.getElementById('workordercount').innerHTML = "<p>" + data[0].workordercount + " Work Orders</p>";
	});
	$.getJSON(domain + "messagescount/" + window.localStorage.getItem("api"), function (data) {
		document.getElementById('messagescount').innerHTML = "<p>" + data[0].unreadmessages + " Messages</p>";
	});
};

function loadinbox() {
	$('#messageslist li').remove();
	$.getJSON(domain + "inbox/lastten/" + window.localStorage.getItem("api"), function (data) {
		for (var i = 0, l = data.messages.length; i < l; i++) {
			var obj = data.messages[i];
			$('#messageslist').append('<li data-icon="mail"><a href="javascript:void(0)" id="popUpReply" data-rel="popup"><img src="https://traxxman.com/app/ljsmall.png"><h3>' + obj.friendlyfrom + '</h3><p>' + obj.subject + '</p></a></li>');
			$('#messageslist').listview('refresh');
		}
	});
};



function loademployees() {
	$.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function (employees) {
		var splitme = employees.employeeids;
		var employees = splitme.split(', ');
		$.each(employees, function (index, value) {
		$('#employeelist').append('<li><a href="#employeeprofile"><img src="ljsmall.png"><h2>' + value + '</h2><p>Last seen in XX</p></a></li>')
		$('#employeelist').listview().listview('refresh');
	})
})
}


function loadinboxemployees() {
	$.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function (employees) {
		var splitme = employees.employeeids;
		var employees = splitme.split(', ');
		$.each(employees, function (index, value) {
			$.getJSON(domain + "employeefullname/" + value, function (namedata) {
				$('#employeeinboxlist').append('<option value="'+value+'">'+namedata[0].fullname+'</option>');
			$('#employeeinboxlist').selectmenu();
					$('#employeeinboxlist').selectmenu('refresh');
	});

		})							

	})
}

function apicheck() {
	var api = window.localStorage.getItem("api");
		$.getJSON(domain + "tools/apicheck/" + api, function (validation) {
	if (api == null || api == false || api == "" || validation !== "valid")
	{
		window.location = "index.html";
	}
	});
}


function loadtasks() {
$('#tasks').controlgroup("container").append('<label for="chk"><input type="checkbox" name="clock-place" id="chk" value="bar" />Checkbox</label>').append('<label for="chk"><input type="checkbox" name="clock-place" id="chk" value="bar" />Checkbox</label>').append('<label for="chk"><input type="checkbox" name="clock-place" id="chk" value="bar" />Checkbox</label>').append('<label for="chk"><input type="checkbox" name="clock-place" id="chk" value="bar" />Checkbox</label>');
$("#tasks").enhanceWithin().controlgroup("refresh");

}

function addTask() {
	
}

function addDetail() {

}
function addNote() {

}
function addEmployee() {

}
$(document).on("pageshow", "#workorderpage", function (event) {
		$('#workordermap').gmap().bind('init', function(evt, map) {
	$('#workordermap').gmap('getCurrentPosition', function(position, status) {
		if ( status === 'OK' ) {
			var image = 'ryansmall.png';
			var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$('#workordermap').gmap('addMarker', {'position': clientPosition, 'bounds': true, 'icon': image});
			$('#workordermap').gmap('addShape', 'Circle', { 
				'strokeWeight': 0, 
				'fillColor': "#008595", 
				'fillOpacity': 0.25, 
				'center': clientPosition, 
				'radius': 35, 
				'clickable': false,
			});
		}
	});   
});
});


$(document).on("pageshow", "#sendMessage", function (event) {
	loadinboxemployees();
});

$(document).on("pageshow", "#home", function (event) {

});

$(document).on("pageinit", "#home", function (event) {
		apicheck();
	loadnavbar();
});

$(document).on("pageshow", "#workorders", function (event) {
			alertify.success("Loading work orders...");
	loadworkorderslist();
});



$(document).on("pageshow", "#inbox", function (event) {
	alertify.success("Loading inbox...");
	loadinbox();
});

$(document).on("pageshow", "#myaccount", function (event) {
					alertify.success("Loading your account...");
	myaccount();
});

$(document).on("pageinit", "#employees", function (event) {
						alertify.success("Loading your employees...");
	loademployees();
});

function myaccount(){
$.getJSON(domain + "fullname/" + window.localStorage.getItem("api"), function (data) {
		document.getElementById('myaccountusername').innerHTML = "<h1>" + data[0].fullname + "</h1>";
	});
}

function messagereply(id) {
	function MessageReplyData() {
		return JSON.stringify({
			"api": window.localStorage.getItem("api"),
			"to": id,
			"subject": $('#subject').val(),
			"contents": $('#contents').val(),
		})}
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: domain + 'inbox',
		dataType: 'json',
		data: MessageReplyData(),
		success: function (data, textStatus, jqXHR) {
			$(function () {
				location.reload();
				alertify.success("Message sent");
			});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$(function () {
					alertify.error(textStatus);
			});
		}
	});
}




function newMessage() {
	var contents = $('#newcontents').val();
    var subject = $('#newsubject').val();
	var sendtoid = $("#sendmessageid").val();
	window.location = "dashboard.html#inbox";
	function newMessageData() {
	return JSON.stringify({
		"api": window.localStorage.getItem("api"),
		"to": sendtoid,
		"subject": subject,
		"contents": contents,
	});
		document.getElementById('newcontents').value = '';
		document.getElementById('newsubject').value = '';
		document.getElementById('sendmessageid').value = '';

};
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: domain + 'inbox',
		dataType: 'json',
		data: newMessageData(),
		success: function (data, textStatus, jqXHR) {
			$(function () {
				alertify.success("Message sent");
			});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$(function () {
				alertify.error(textStatus);
			});
		}
	});
};




function createWorkOrderPage(id) {
				$.getJSON(domain + "workorderaddress/" + id + "/" + window.localStorage.getItem("api"), function (addressdata) {
					$.getJSON(domain + "workordertitle/" + id + "/" + window.localStorage.getItem("api"), function (titledata) { 
	var ordernumber = id.replace('x','');
	var pagedata = $('<div id="workorderpage" data-role="page" align="center" data-transition="slide">' +
		'<div data-role="header" data-theme="a">' +
		'<img border="0" src="header.png" alt="Traxxman" style="position: center"/>' +
		'<a href="#home" data-role="button" data-icon="back">Back</a>' +
		'</div>' +
		'<div data-role="content" data-theme="a">' +
		'<h3>' + titledata[0].eventdata + '</h3>' +
		'<p>Work Order #' + ordernumber + '</p>' +
		'<p>9/13/2014 - 8:00am - 2:00pm</p>' +
		'<div id="workordermap" style="width: 100%; height: 300px;"></div>' +
					 
		'<div data-role="collapsibleset">' +
		'<div data-role="collapsible">' +
		'<h3>Details</h3>' +
		'<ul data-role="listview" id="details">' +
		'<li data-icon="calendar"><a href="#"><img src="https://traxxman.com/app/ryan.jpg"><h1>Detail Title</h1><p>Detail information</p></a></li>' +
		'</ul>' +
		'<div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addDetail();">Add Detail</a></div>' +
		'</div>' +
		'</div>' +
		'<div data-role="collapsibleset">' +
		'<div data-role="collapsible" id="tasksdiv">' +
		'<h3>Tasks</h3>' +
		'<div data-role="controlgroup" id="tasks">' +
		'</div>' +
				'<div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addTask();">Add Task</a></div>' +
		'</div>' +
		'</div>' +
		'<div data-role="collapsibleset">' +
		'<div data-role="collapsible">' +
		'<h3>Notes</h3>' +
		'<ul data-role="listview" id="notes">' +
		'<li data-icon="edit"><a href="#"><img src="https://traxxman.com/app/ryan.jpg"><h1>Note Title</h1><p>Note information</p></a></li></ul>' +
				'<div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addNote();">Add Note</a></div></div></div>'+
		'<div data-role="collapsibleset">' +
		'<div data-role="collapsible">' +
		'<h3>Employees</h3>' +
		'<ul data-role="listview" id="woemployees">' +
		'<li data-icon="user"><a href="#"><img src="https://traxxman.com/app/ljsmall.png"><h1>Employee</h1><p>Employee Info</p></a></li></ul>' +
				'<div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addEmployee();">Add Employee</a></div>' +
					 '</div><div data-role="footer" data-theme="a">&nbsp;</div></div>');
	pagedata.appendTo($.mobile.pageContainer);
	$.mobile.changePage(pagedata);
						loadtasks();
					}); });
}

function createEmployeeProfile(id) {
	var empagedata = $('<div id="employeeprofile" data-role="page" align="center" data-transition="slide"><div data-role="header" data-theme="a"><img border="0" src="header.png" alt="Traxxman" style="position: center" /><a href="#home" data-role="button" data-icon="back">Back</a></div><h2>'+id+'s Profile</h2><div data-role="content" data-theme="a"><img src="https://traxxman.com/app/ljsmall.png"></div><div data-role="footer" data-theme="a">&nbsp;</div></div>');
	empagedata.appendTo($.mobile.pageContainer);
	$.mobile.changePage(empagedata);
}

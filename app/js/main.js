//var domain = "../api/";
var domain = "https://Traxxman.com/api/";

$body = $("body");

var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

if (app) {
	document.addEventListener("deviceready", onDeviceReady, false);

	function getCurrentPosition() {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}

	mylocation = position.coords.latitude + "," + position.coords.longitude;
	if (window.localStorage.getItem("mylocation") !== mylocation) {
		window.localStorage.setItem("mylocation", mylocation);
		var newlocation = mylocation.replace(/,/g, "x");
		$.getJSON(domain + "mylocation/" + newlocation + "/" + window.localStorage.getItem("api"), function (returnval) {});
										alertify.success('Location Updated');
	}

	function onError(error) {
		mylocation = "0,0";
		alertify.alert('code: ' + error.code + '\n');
		alertify.alert('message: ' + error.message + '\n');
	}
} else {
	function locationUpdate() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {

			alertify.alert("Geolocation is not supported by this browser");
			mylocation = "0,0";

		}

		function showPosition(position) {

			var mylocation = position.coords.latitude + "," + position.coords.longitude;
			if (window.localStorage.getItem("mylocation") !== mylocation) {
				window.localStorage.setItem("mylocation", mylocation);
				newlocation = mylocation.replace(/,/g, "x");
				$.getJSON(domain + "mylocation/" + newlocation + "/" + window.localStorage.getItem("api"), function (returnval) {});
								alertify.success('Location Updated');
			}

		}
	}
}

function setlocation() {
	if (app) {
		getCurrentPosition();
	} else {
		locationUpdate();
	}
}


$(document).on("pagebeforeshow", "#sendMessage", function (event) {
	loadinboxemployees();
});

$(document).on("pagebeforeshow", "#home", function (event) {
	loadnavbar();
});

$(document).on("pagebeforeshow", "#workorders", function (event) {
	loadworkorderslist();
});

$(document).on("pagebeforeshow", "#inbox", function (event) {
	loadinbox();
});

$(document).on("pagebeforeshow", "#employees", function (event) {
	loademployees();
});

$(document).on('pagehide', '#myaccount', function () {
	$(this).remove();
});
$(document).on('pagehide', '#workorderpage', function () {
	$(this).remove();
	window.localStorage.removeItem("activeWO");
});

function check() {
	var un = document.getElementById('username').value;
	var action = 'check';
	$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&action=' + action, function (res) {
		alertify.success('The username ' + un + res.status + '!');
	}).fail(function (d, textStatus, error) {
		alertify.error("Could not connect to Traxxman Cloud");
	});
}


function login() {
	var un = document.getElementById("username").value;
	var pw = document.getElementById("password").value;
	var action = 'login';

	$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&action=' + action, function (res) {
		if (res.status == "success") {
			api = res.api;
			window.localStorage.setItem("api", api);
			if (api != 'undefined') {
				window.location = "dashboard.html";
			} else {
				alertify.error("Error logging in!");
			}
		} else {
			alertify.success(res.status);
		}
	})
		.fail(function (d, textStatus, error) {
			alertify.error("Could not connect to Traxxman Cloud");
		})
}

function forgot() {

	var em = document.getElementById("email").value;

	var action = 'forgot';

	$.getJSON(domain + 'proxy.php?callback=?', 'em=' + em + '&action=' + action, function (res) {
		alertify.success(res.status);
	});
}

function signup() {
	$("register").prop('disabled', true);
	var un = document.getElementById('username').value;
	var em = document.getElementById('email').value;
	var pw = document.getElementById('password').value;
	var pw2 = document.getElementById('password2').value;
	var action = 'reg';
	if (document.getElementById('email').value === '' || document.getElementById('username').value === '' || document.getElementById('password').value === '' || document.getElementById('password2').value === '') {
		alertify.error("All fields must be completed");
		$("register").prop('disabled', false);
	} else {
		if (pw == pw2) {
			$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&em=' + em + '&action=' + action, function (res) {
				if (res.status == 'That does not appear to be a valid email address') {
					$("register").prop('disabled', false);
					alertify.error(res.status);
				} else {
					alertify.success(res.status);
					document.getElementById('email').value = '';
					document.getElementById('username').value = '';
					document.getElementById('password').value = '';
					document.getElementById('password2').value = '';
					$("register").prop('disabled', false);
				}
				if (res.status == 'That email address is already registed with Traxxman') {
					alerify.error(res.status);
				} else {
					alertify.success(res.status);
					document.getElementById('email').value = '';
					document.getElementById('username').value = '';
					document.getElementById('password').value = '';
					document.getElementById('password2').value = '';
					$("register").prop('disabled', false);
				}
			}).fail(function (d, textStatus, error) {
				alertify.error("Could not connect to Traxxman Cloud");
				$("register").prop('disabled', false);
			});
		} else {
			alertify.error("Your passwords do not match");
			$("register").prop('disabled', false);
		}
	}
}

function logOutReady() {
	window.localStorage.removeItem("api");
	window.localStorage.removeItem("mylocation");
	window.location = "index.html";
}


$(document).on({
	ajaxStart: function () {
		$body.addClass("loading");

	},
	ajaxStop: function () {
		$body.removeClass("loading");
	}
});

function loadworkorderslist() {
	$('#workOrdersList li').remove();
	var api = window.localStorage.getItem("api");
	$.getJSON(domain + "workorders/" + api, function (data) {
		var splitme = data.workorderids;
		var workorders = splitme.split(', ');
		$.each(workorders, function (index, value) {
			$.getJSON(domain + "workorderaddress/" + value + "/" + api, function (workorderaddy) {
				$.getJSON(domain + "workordertitle/" + value + "/" + api, function (titledata) {
					var WOaddress = workorderaddy[0].eventdata;
					var ordernumber = value.replace('x', '');
					$.getJSON(domain + "tools/createmap/" + WOaddress + "/" + ordernumber, function (addressdata) {
						$('#workOrdersList').append('<li><a href="javascript:void(0)" onclick="createWorkOrderPage(' + "'" + value + "'" + ')"><img src="' + addressdata + '"></img><h2>' + titledata[0].eventdata + '</h2><p>' + WOaddress + '</p></a></li>');
						$('#workOrdersList').listview().listview('refresh');
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
	window.location = "dashboard.html#home";
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: domain + 'workorders',
		dataType: 'json',
		data: formToJSONWOADD(),
		success: function (data, textStatus, jqXHR) {
			$(function () {
				alertify.success('Work Order #' + ordernumber + ' created');
			});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$(function () {
				alertify.error('Error adding work order');
			});
		}
	});
};

function loadnavbar() {
	var api = window.localStorage.getItem("api");
	$.getJSON(domain + "fullname/" + api, function (data) {
		document.getElementById('myaccountusername').innerHTML = "<p>" + data[0].fullname + "</p>";
	});
	$.getJSON(domain + "workordercount/" + api, function (data) {
		document.getElementById('workordercount').innerHTML = "<p>" + data[0].workordercount + " Work Orders</p>";
	});
	$.getJSON(domain + "messagescount/" + api, function (data) {
		document.getElementById('messagescount').innerHTML = "<p>" + data[0].unreadmessages + " Unread</p>";
	});
};

function loadinbox() {
	$.getJSON(domain + "markasread/" + window.localStorage.getItem("api"), function (data) {});

	$('#messageslist li').remove();

	$.getJSON(domain + "inbox/lastten/" + window.localStorage.getItem("api"), function (data) {


		for (var i = 0, l = data.messages.length; i < l; i++) {
			obj = data.messages[i];
			messagetoid = obj.id;
			friendlyfromid = obj.friendlyfrom;
			timestamp = obj.timestamp
			
			$.ajax({
				url: domain + "avatarbyID/" + obj.from + "/" + window.localStorage.getItem("api"),
				async: false,
				dataType: 'json',
				success: function (data) {
					window.usersavatar = data[0].avatarurl;
				}
			});
			$('#messageslist').append('<li data-icon="mail"><a href="javascript:void(0)" onclick="createReply(' + messagetoid + ');"><img src="images/avatars/' + window.usersavatar + '"><h3>' + friendlyfromid + '</h3><p>' + timestamp + '</p></a></li>');

			$('#messageslist').listview('refresh');
		}

	});
}

function createReply(msgid) {
	$.getJSON(domain + "inbox/" + msgid + "/" + window.localStorage.getItem("api"), function (data) {
	alertify.prompt("<h1>" + data[0].subject + "</h1><p> " + data[0].contents + "</p>", function (e, str) {
		if (e) {
			alertify.success(str);
		} else {
			alertify.error("Reply cancelled");
		}
	}, "Your reply...");
	return false;
});
	}


function loadinboxemployees() {
	$('#employeeinboxlist li').remove();
	$.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function (employees) {
		var splitme = employees.employeeids;
		var employees = splitme.split(', ');
		$.each(employees, function (index, value) {
			$.getJSON(domain + "employeefullname/" + value, function (namedata) {
				$('#employeeinboxlist').append('<option value="' + value + '">' + namedata[0].fullname + '</option>');
				$('#employeeinboxlist').selectmenu();
				$('#employeeinboxlist').selectmenu('refresh');
			});
		})
	})
}


function isloggedin() {
	var api = window.localStorage.getItem("api");
	if (api === null || api === false || api === "") {
		window.location = "index.html";
	} else {
		alertify.success("Logging you in...");
		$.getJSON(domain + "tools/apicheck/" + api, function (validation) {
			if (validation == "valid") {
				window.location = "dashboard.html";
			} else {
				alertify.error("Please re-login");
			}
		}).fail(function (d, textStatus, error) {
			alertify.error("Could not connect to Traxxman Cloud");

		});
	}
}


function apicheck() {
	var api = window.localStorage.getItem("api");
	if (api === null || api === false || api === "") {
		window.location = "index.html";
	} else {
		$.getJSON(domain + "tools/apicheck/" + api, function (validation) {
			if (validation !== "valid") {
				window.location = "index.html";
			}
		}).fail(function (d, textStatus, error) {
			alertify.error("Could not connect to Traxxman Cloud");

		});
	}
}


function addEmployee() {
	var addemployeedata =
		$('<div id="addemployee" data-role="page" align="center" data-transition="slide">' +
			'<div data-role="header" data-theme="a">' +
			'<a href="#home" data-role="button" data-icon="back">Back</a></div>' +
			'<h2>Add an Employee</h2><div data-role="content" data-theme="a">' +
			'<div data-role="footer" data-theme="a">&nbsp;</div></div>');
	addemployeedata.appendTo($.mobile.pageContainer);
	$.mobile.changePage(addemployeedata);
}


function messagereply(id) {
	function MessageReplyData() {
		return JSON.stringify({
			"api": window.localStorage.getItem("api"),
			"to": id,
			"subject": $('#subject').val(),
			"contents": $('#contents').val()
		})
	}
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: domain + 'inbox',
		dataType: 'json',
		data: MessageReplyData(),
		success: function (data, textStatus, jqXHR) {
			$(function () {
				alertify.success("Message sent");
				document.getElementById('contents').value = '';
				document.getElementById('subject').value = '';
				location.reload();
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
	var sendtoid = $('#employeeinboxlist').selectmenu().val();
	window.location = "dashboard.html#inbox";
	alertify.success("Sending message...");

	function newMessageData() {
		return JSON.stringify({
			"api": window.localStorage.getItem("api"),
			"to": sendtoid,
			"subject": subject,
			"contents": contents
		});
		document.getElementById('newcontents').value = '';
		document.getElementById('newsubject').value = '';

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
	$.getJSON(domain + "workorders/" + id + "/" + window.localStorage.getItem("api"), function (jobdata) {
		var workorder = id;
		window.localStorage.setItem("activeWO", id);
		var user = jobdata[0].user;
		var title = jobdata[1].eventdata;
		var location = jobdata[2].eventdata;
		var jobsite = jobdata[3].eventdata;
		var jobstart = jobdata[4].eventdata;
		var jobend = jobdata[5].eventdata;

		var readablestart = moment.unix(jobstart).format('MMMM Do YYYY, h:mm a');
		var readableend = moment.unix(jobend).format('MMMM Do YYYY, h:mm a');

		var coordinates = jobsite.split(',');
		var ordernumber = id.replace('x', '');
		var pagedata = $('<div id="workorderpage" data-role="page" align="center">' +
			'<div data-role="header" data-theme="a" style="min-height: 50px;">' +
			'<a href="#home" data-role="button" data-icon="back">Back</a>' +
			'</div>' +
			'<div data-role="content" data-theme="a">' +
			'<h1>' + location + '</h1>' +
			'<h2>Created by ' + user + '</h2>' +
			'<p>Work Order #' + ordernumber + '</p>' +
			'<p>' + title + '</p>' +
			'<p>Work Begins: ' + readablestart + "</p>" +
			'<p>Work Ends: ' + readableend + '</p>' +
			'<div id="workordermap"></div>' +
			'<div data-role="collapsibleset">' +
			'<div data-role="collapsible">' +
			'<h3>Details</h3>' +
			'<ul data-role="listview" id="details">' +
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
			'</ul><div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addNote();">Add Note</a></div></div></div>' +
			'<div data-role="collapsibleset">' +
			'<div data-role="collapsible">' +
			'<h3>Employees</h3>' +
			'<ul data-role="listview" id="woemployees">' +
			'</ul><div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addEmployeetoWO();">Add Employee</a></div>' +
			'</div><div data-role="footer" data-theme="a">&nbsp;</div></div>');

		loadNotes();
		loadDetails();
		loadEmployees();

		pagedata.appendTo($.mobile.pageContainer);
		$.mobile.changePage(pagedata);

		$('#workordermap').css('height', '300px');
		var minZoomLevel = 1;
		var myLatlng = new google.maps.LatLng(coordinates[0], coordinates[1]);
		var strictBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(28.70, -127.50),
			new google.maps.LatLng(48.85, -55.90)
		);
		var map = new google.maps.Map(document.getElementById('workordermap'), {
			zoom: 11,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		google.maps.event.addListener(map, 'dragend', function () {
			if (strictBounds.contains(map.getCenter())) return;


			var c = map.getCenter(),
				x = c.lng(),
				y = c.lat(),
				maxX = strictBounds.getNorthEast().lng(),
				maxY = strictBounds.getNorthEast().lat(),
				minX = strictBounds.getSouthWest().lng(),
				minY = strictBounds.getSouthWest().lat();

			if (x < minX) x = minX;
			if (x > maxX) x = maxX;
			if (y < minY) y = minY;
			if (y > maxY) y = maxY;

			map.setCenter(new google.maps.LatLng(y, x));
		});

		new google.maps.Circle({
			center: myLatlng,
			strokeWeight: 0,
			fillColor: "#008595",
			fillOpacity: 0.25,
			radius: 2000,
			clickable: false,
			map: map
		});

		google.maps.event.addListener(map, 'zoom_changed', function () {
			if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
		});
		
			var marker, i;
			var markertitle = "<div style='padding: 10px;'>" + title + "</div>";
		
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(coordinates[0], coordinates[1]),
				map: map,
				icon: 'images/electric.png',
				title: markertitle
			});
		
			var $infoWindowContent = $("<div class='infowin-content'>" + markertitle + "</div>");
			var infoWindow = new google.maps.InfoWindow();
			infoWindow.setContent($infoWindowContent[0]);
		
			google.maps.event.addListener(marker, 'click', function () {
			infoWindow.open(map, marker);
			});
		
			var markersArray = [];
			$.getJSON(domain + "workorders/" + id + "/employee/" + window.localStorage.getItem("api"), function (employees) {
			$.each(employees.employee, function (index, value) {
			$.ajax({
					url: domain + "avatar/" + value.eventdata + "/" + window.localStorage.getItem("api"),
					async: false,
					dataType: 'json',
					success: function (data) {
					mapavatar = data[0].avatarurl;
					}
				});
			$.ajax({
					url: domain + "locations/" + id + "/" + value.eventdata + "/" + window.localStorage.getItem("api"),
					async: false,
					dataType: 'json',
					success: function (data) {
						locdata = data;
					}
				});
			
			$.each(locdata, function (index, value) {
							infowindowz = new google.maps.InfoWindow({
				content: "test"
			});
			timestamp = moment.unix(value.timestamp).format("MMM Mo, h:mmA");
			var markertitle = timestamp;
			var splitme = value.eventdata;
		    var mycoords = splitme.split(',');
			myLatLng = new google.maps.LatLng(mycoords[0], mycoords[1]);
				
			var icon = {
			url: 'images/avatars/' + mapavatar,
			scaledSize: new google.maps.Size(25, 25),
    		origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0, 0)
			};
				
			var themarkers = new google.maps.Marker({
				position: myLatLng,
				map: map,
				icon: icon,
				title: markertitle
			});
				
				

    			google.maps.event.addListener(themarkers, 'click', function(){
					alertify.success(markertitle);
    });
			});
				  
							});
				
		});

		google.maps.event.addListenerOnce(map, 'idle', function () {
			google.maps.event.trigger(map, 'resize');
		});
		

		function loadDetails() {
			$.getJSON(domain + "workorders/" + id + "/detail/" + window.localStorage.getItem("api"), function (detaildata) {
				if (detaildata.detail.length === 0 || detaildata.detail.length === undefined) {
					$('#details li').remove();
					$('#details').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/boots.png"><h1>There are no details yet.</h1></a></li>');
					$('#details').listview().listview('refresh');
				} else {
					$('#details li').remove();
					$.each(detaildata.detail, function (index, value) {
						detailtimestamp = moment.unix(value.timestamp).format('LLL');
						$('#details').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/boots.png"><h1>' + value.eventdata + '</h1><p>' + detailtimestamp + '</p></a></li>');
					});
					var details = document.getElementById("details");
					var i = details.childNodes.length;
					while (i--)
						details.appendChild(details.childNodes[i]);
					$('#details').listview().listview('refresh');
				}

			});

		}


		function loadNotes() {
			$.getJSON(domain + "workorders/" + id + "/notes/" + window.localStorage.getItem("api"), function (notedata) {
				if (notedata[0] === undefined || notedata.note.length === 0) {
					$('#notes li').remove();
					$('#notes').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/boots.png"><h1>There are no notes yet.</h1></a></li>');
					$('#notes').listview().listview('refresh');
				} else {
					$('#notes li').remove();

					$.each(notedata.note[0], function (index, value) {
						$('#notes').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/boots.png"><h1>' + index + '</h1><p>' + value + '</p></a></li>');

						$('#notes').listview().listview('refresh');
					})
				}
			});
		}
	});
}

function loadEmployees() {
	$.getJSON(domain + "workorders/" + window.localStorage.getItem("activeWO") + "/employee/" + window.localStorage.getItem("api"), function (empldata) {
		if (empldata.employee.length === 0) {
			$('#woemployees li').remove();
			$('#woemployees').append('<li data-icon="user"><a href="javascript:void(0)"><img src="images/avatars/boots.png"><h1>There are no employees yet.</h1></a></li>');
			$('#woemployees').listview().listview('refresh');
		} else {
			$('#woemployees li').remove();
			$.each(empldata.employee, function (index, value) {
				$.ajax({
					url: domain + "avatar/" + value.eventdata + "/" + window.localStorage.getItem("api"),
					async: false,
					dataType: 'json',
					success: function (data) {
						window.usersavatar = data[0].avatarurl;
					}
				});
				employeetimestamp = moment.unix(value.timestamp).format('L');
				if (value.user === "owner") {
					parentcreator = "</h1><p>Work Order Contractor";
				} else {
					parentcreator = "</h1><p>added by " + value.user + " on " + employeetimestamp;
				}

				$('#woemployees').append('<li data-icon="user"><a href="javascript:void(0)"><img src="images/avatars/' + window.usersavatar + '"><h1>' + value.eventdata + parentcreator + '</p></a></li>');
				$('#woemployees').listview().listview('refresh');

			});
		}
	});

}

function addEmployeetoWO() {
	$('#woemployees').append('<li id="EmployeeList"><select name="WOemployeelist" id="WOemployeelist"></select></li>');
	loadWOemployees();
	$('#woemployees').listview().listview('refresh');

	$("#WOemployeelist").change(function () {
		var selectedtext = $("#WOemployeelist option:selected").text();
		var employeeid = $('#WOemployeelist').selectmenu().val();
		var elem = document.getElementById('EmployeeList');
		elem.parentNode.removeChild(elem);
		var addingemployee = $.getJSON(domain + "addemployeetoWO/" + employeeid + "/" + window.localStorage.getItem("activeWO") + "/" + window.localStorage.getItem("api"), function (employees) {});
		addingemployee.complete(function () {
			loadEmployees();
			alertify.success("Added " + selectedtext + " to work order");
		});
	});
}

function loadWOemployees() {
	$('#WOemployeelist li').remove();
	$.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function (employees) {
		var splitme = employees.employeeids;
		var employees = splitme.split(', ');
		$('#WOemployeelist').append('<option value="#">Select Employee</option>');
		$.each(employees, function (index, value) {
			$.getJSON(domain + "employeefullname/" + value, function (namedata) {
				$('#WOemployeelist').append('<option value="' + value + '">' + namedata[0].fullname + '</option>');
				$('#WOemployeelist').selectmenu();
				$('#WOemployeelist').selectmenu('refresh');
			});
		})
	})
}


function addTask() {
	$('#tasks').controlgroup("container")
		.append('<label for="chk"><input type="checkbox" name="clock-place" id="chk" value="bar" />Close Work Order</label>')
	$("#tasks").enhanceWithin().controlgroup("refresh");
}

function addDetail() {
	alertify.success("Add detail function");
}

function addNote() {
	alertify.success("Add note function");

}


function loademployees() {
	$('#employeelist li').remove();
	$.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function (employees) {
		var splitme = employees.employeeids;
		var employees = splitme.split(', ');
		$.each(employees, function (index, value) {
			$.getJSON(domain + "profile/" + value, function (profiledata) {
				$('#employeelist').append("<li><a href='javascript:void(0)' onclick='createEmployeeProfile(" + value + ")'><img src='images/avatars/" + profiledata[0].avatarurl + "'><h2>" + profiledata[0].fullname + "</h2><p>Last seen in " + profiledata[0].lastseen + "</p></a></li>");
				$('#employeelist').listview().listview('refresh');
			});
		});
	});
}

function createEmployeeProfile(id) {
	$.getJSON(domain + "profile/" + id, function (profiledata) {
		var pagedatas = $('<div id="employeeprofile" data-role="page" align="center" data-transition="slide"><div data-role="header" data-theme="a"><a href="#home" data-role="button" data-icon="back">Back</a></div><h2>' + profiledata[0].fullname + 's Profile</h2><div data-role="content" data-theme="a"><img src="images/avatars/boots.png"></div><div data-role="footer" data-theme="a">&nbsp;</div></div>');
		pagedatas.appendTo($.mobile.pageContainer);
		$.mobile.changePage(pagedatas);
	});

}

function loadCalendar() {
	var pagedats = $(
		'<div data-role="page" id="view-calendar" data-theme="a">' +
		'<div data-role="content">' +
		'<div id="calendar"></div>' +
		'</div>' +
		'</div>');
	//pagedats.appendTo($.mobile.pageContainer);
	//$.mobile.changePage(pagedats);
}

function myAccount() {
	$.getJSON(domain + "myaccount/" + window.localStorage.getItem("api"), function (account) {
		var epdata = $('<div id="myaccount" data-role="page" align="center" data-theme="a">' +
			'<div data-role="header" style="min-height: 50px;">&nbsp;' +
			'<a href="#home" data-role="button" data-icon="back">Back</a>' +
			'</div>' +
			'<div role="main" class="ui-content">' +
			'<div class="ui-grid-a">' +
			'<div class="ui-block-a" style="height:100%">' +
			'<img style="height: 100px; width: 100px;" src="images/avatars/' + account[0].avatarurl + '" is="image">' +
			'</div>' +
			'<div class="ui-block-b" style="height:100%">' +
			'<div id="info">' + account[0].fullname + '</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div id="myaccountmap"></div>' +
			'<div data-role="footer" data-theme="a">&nbsp;' +
			'</div>' +
			'</div>');
		epdata.appendTo($.mobile.pageContainer);
		$.mobile.changePage(epdata);

		$('#myaccountmap').css('height', '350px');

		var mylocation = window.localStorage.getItem("mylocation");
		var minZoomLevel = 5;
		coordinates = mylocation.split(',');

		var myLatlng = new google.maps.LatLng(coordinates[0], coordinates[1]);

		var map = new google.maps.Map(document.getElementById('myaccountmap'), {
			zoom: 11,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		
		google.maps.event.addListener(map, 'zoom_changed', function () {
			if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
		});

		var markertitle = "<div style='padding: 10px;'>You</div>";

		marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			icon: 'images/electric.png',
			title: markertitle

		});
		var $infoWindowContent = $("<div class='infowin-content'>" + markertitle + "</div>");
		var infoWindow = new google.maps.InfoWindow();
		infoWindow.setContent($infoWindowContent[0]);

		google.maps.event.addListener(marker, 'click', function () {
			infoWindow.open(map, marker);
		});
		google.maps.event.addListenerOnce(map, 'idle', function () {
			google.maps.event.trigger(map, 'resize');
		});
	});
}
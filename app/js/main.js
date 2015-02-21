//var domain = "../api/";
var domain = "http://Traxxman.com/api/";

function pullLocation(){
	
	navigator.geolocation.watchPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
	
	function onSuccess(position) {
	mylocation = position.coords.latitude + "," + position.coords.longitude;
	if (window.localStorage.getItem("mylocation") !== mylocation) {
		window.localStorage.setItem("mylocation", mylocation);
		var newlocation = mylocation.replace(/,/g, "x");
		$.getJSON(domain + "mylocation/" + newlocation + "/" + window.localStorage.getItem("api"), function (returnval) {});
	}
		}

	function onError(error) {
		mylocation = "0,0";
		alertify.alert('code: ' + error.code + '\n');
		alertify.alert('message: ' + error.message + '\n');
	}
}

function onDeviceReady() {
	pullLocation();
	APNService();
	}
	
function init() {
    $.mobile.allowCrossDomainPages = true;
    $.mobile.page.prototype.options.domCache = true;
    isloggedin();
	document.addEventListener("deviceready", onDeviceReady, false);
}


function APNService() {
	var pushNotification = window.plugins.pushNotification;
    pushNotification.register(
    successHandler,
    errorHandler,
    {
        "senderID":"883479072537",
        "ecb":"onNotification"
    });
    
    function successHandler (result) {
    alertify.success('GCM Registered: = ' + result);
}

function errorHandler (error) {
    alertify.alert('error = ' + error);
}
}

function onNotification(e) {
    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
          console.log(e.regid);
        }
    break;


    case 'message':
        if ( e.foreground )
        {
            $.mobile.changePage("dashboard.html#inbox",{allowSamePageTransition:true,reloadPage:false,changeHash:true,transition:"slide"});
            var soundfile = e.soundname;
            var my_media = new Media("/android_asset/www/"+ soundfile);
            my_media.play();
        }
        else
        {  
            if ( e.coldstart )
            {
                $.mobile.changePage("dashboard.html#inbox",{allowSamePageTransition:true,reloadPage:false,changeHash:true,transition:"slide"});
            }
            else
            {
                $.mobile.changePage("dashboard.html#inbox",{allowSamePageTransition:true,reloadPage:false,changeHash:true,transition:"slide"});
            }
        }
       alertify.success(e.payload.type);
       alertify.success(e.payload.message);
    break;

    case 'error':
        alertify.success('ERROR -> MSG:' + e.msg);
    break;

    default:
        alertify.success('EVENT -> Unknown, an event was received and we do not know what it is');
    break;
  }
}

$(document).on("pagebeforeshow", "#sendMessage", function (event) {
	loadinboxemployees();
});

$(document).on("pagebeforeshow", "#home", function (event) {
    apicheck();
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
	$("login").prop('disabled', true);
	var un = document.getElementById("username").value;
	var pw = document.getElementById("password").value;
	var action = 'login';
	alertify.success("Logging you in...");
	$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&action=' + action, function (res) {
		if (res.status == "success") {
			api = res.api;
			window.localStorage.setItem("api", api);
			if (api != 'undefined') {
				window.location = "dashboard.html";
			} else {
				alertify.error("Error logging in!");
				$("login").prop('disabled', false);
			}
		} else {
			alertify.error(res.status);
			$("login").prop('disabled', false);
		}
	})
		.fail(function (d, textStatus, error) {
			alertify.error("Could not connect to Traxxman Cloud");
			$("login").prop('disabled', false);
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
						$('#workOrdersList').append('<li><a href="javascript:void(0)" onclick="createWorkOrderPage(' + "'" + value + "'" + ')"><img src="'+ domain + addressdata + '"></img><h2>' + titledata[0].eventdata + '</h2><p>' + WOaddress + '</p></a></li>');
						$('#workOrdersList').listview().listview('refresh');
                        $("#workOrderStatus").text("Work Orders");
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
	var indate = $('#indate').val();
	var intime = $('#intime').val();
	var outdate = $('#outdate').val();
	var outtime = $('#outtime').val();
	var jobstart = moment(indate + " " + intime).format('X');
	var jobend = moment(outdate + " " + outtime).format('X');

	function formToJSONWOADD() {
		return JSON.stringify({
			"ordernumber": ordernumber,
			"api": window.localStorage.getItem("api"),
			"ordertitle": ordertitle,
			"orderlocation": orderlocation,
			"jobstart": jobstart,
			"jobend": jobend

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
			timestamp = moment.unix(obj.timestamp).format('llll');

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
		console.log(data);
		alertify.prompt("<h1>" + data[0].subject + "</h1><p> " + data[0].contents + "</p>", function (e, str) {
			if (e) {
				toid = data[0].from;
				if (data[0].subject.substr(0, 3) === "Re:") {
					subject = data[0].subject;
				} else {
					subject = "Re: " + data[0].subject;
				}
				messagereply(subject, toid, str);
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
	if (api === null || api === false || api === "" || api === "null") {} else {
		$.getJSON(domain + "tools/apicheck/" + api, function (validation) {
			if (validation == "valid") {
				alertify.success("Logging you in...");
				window.location = "dashboard.html";
			} else {
				window.localStorage.setItem("api", "");
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
		$('<div id="addemployee" data-role="page" align="center" data-theme="a">' +
		'<div data-role="header" align="center" style="background:url("images/headerbg.png") 0 0 #fff; height: 100px;">' +
        '<div style="background:url("images/logo.png") no-repeat 0 0; height: 100px; width: 300px; margin: 15px;"></div>' +
        '<a href="#employees" data-role="button" data-icon="back">Back</a>' +
		'</div>' +

		'<h2>Add an employee</h2>' +
		'<div data-role="content">' +
		'</div>' +
		'<div data-role="footer">&nbsp;' +
		'</div>' +
	'</div>');
	addemployeedata.appendTo($.mobile.pageContainer);
	$.mobile.changePage(addemployeedata);
}

function messagereply(subject, toid, contents) {
	function MessageReplyData() {
		return JSON.stringify({
			"api": window.localStorage.getItem("api"),
			"to": toid,
			"subject": subject,
			"contents": contents
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
		window.workorder = id;
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

		var now = moment(Date.now()).format('X');
		if (now > jobstart && now < jobend) {
			OrderStatus = '<p>Work Order Status: <font color="green">Active</font></p>'
		} else {
			if (now < jobstart) {
				OrderStatus = '<p>Work Order Status: <font color="orange">Pending</font></p>'
			} else {
				OrderStatus = '<p>Work Order Status: <font color="red">Closed</font></p>'
			}
		}

		var pagedata = $('<div id="workorderpage" data-role="page" align="center">' +
        '<div data-role="header" data-theme="a" align="center" style="background:url("images/headerbg.png") 0 0 #fff; height: 100px;">' +
        '<div style="background:url("images/logo.png") no-repeat 0 0; height: 100px; width: 300px; margin: 15px;"></div>' +
        '<a href="#workorders" data-role="button" data-icon="back">Back</a>' +
		'</div>' +
			'<div data-role="content" data-theme="a">' +
			'<h1>' + location + '</h1>' +
			'<h2>Created by ' + user + '</h2>' +
			'<p>Work Order #' + ordernumber + '</p>' +
			'<p>' + title + '</p>' +
			'<p>Work Begins: ' + readablestart + "</p>" +
			'<p>Work Ends: ' + readableend + '</p>' +
			OrderStatus +
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
		LoadTasks();

		pagedata.appendTo($.mobile.pageContainer);
		$.mobile.changePage(pagedata);
		window.localStorage.setItem("LastLocation", "0");
		$('#workordermap').css('height', '300px');
		var myLatlng = new google.maps.LatLng(coordinates[0], coordinates[1]);

		var map = new google.maps.Map(document.getElementById('workordermap'), {
			zoom: 11,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
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


		var marker, i;
		var markertitle = "<div style='padding: 10px;'>" + title + "</div>";
						var WOicon = {
						url: 'images/electric.png',
						scaledSize: new google.maps.Size(10, 10),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(0, 0)
					};
        var WOLocation = coordinates[0] + "," + coordinates[1];
        window.localStorage.setItem("WorkOrder", WOLocation);
       
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(coordinates[0], coordinates[1]),
			map: map,
			icon: WOicon,
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
				locdata.reverse();
				$.each(locdata, function (index, value) {
					
				if (index > 0) {
				
				var icon = {
						url: 'images/avatars/dot.png',
						scaledSize: new google.maps.Size(7, 7),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(0, 0)
					};
				
				} else {
				var icon = {
						url: 'images/avatars/' + mapavatar,
						scaledSize: new google.maps.Size(20, 20),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(0, 0)
					};
				};
											
					var timestamp = moment.unix(value.timestamp).format("MMM Do, h:mmA");
					var splitme = value.eventdata;
					var mycoords = splitme.split(',');
					var myLatLng = new google.maps.LatLng(mycoords[0], mycoords[1]);
				
					
						var themarkers = new google.maps.Marker({
						position: myLatLng,
						map: map,
						icon: icon,
						title: timestamp
					});
						google.maps.event.addListener(themarkers, 'click', function () {
						
                            	$.getJSON(domain + "tools/calcdistance/" + mycoords[0]+ "," + mycoords[1] + "/" +  window.localStorage.getItem("WorkOrder") +  "&mode=driving&language=en,EN&units=imperial", function (distance) {
                            alertify.success(timestamp);
                            alertify.success(distance.rows[0].elements[0].distance.text + " / " + distance.rows[0].elements[0].duration.text);
                             alertify.success(moment.unix(value.timestamp).add(distance.rows[0].elements[0].duration.value, 'seconds').format("h:mmA") + " arrival");
                                });
                            
					});
					
					var LastLocationB = window.localStorage.getItem("LastLocation");
					var thecoords = LastLocationB.split(',');
					var LastLocation = new google.maps.LatLng(thecoords[0], thecoords[1]);
					
					var lineCoordinates = [
    				myLatLng, LastLocation
  					];
					
  					if (LastLocation != "0") {
					var line = new google.maps.Polyline({
    				path: lineCoordinates,
    				geodesic: true,
    				strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
  });

					line.setMap(map);
					} 
					window.localStorage.setItem("LastLocation", mycoords[0] + "," + mycoords[1]);

				});
                
		window.localStorage.setItem("LastLocation", "0");
                
				google.maps.event.addListenerOnce(map, 'idle', function () {
			google.maps.event.trigger(map, 'resize');
		});
				});

			});
		});

		
	
}

function clearmap(){
	var map = null };

function loadNotes() {
	$.getJSON(domain + "workorders/notes/" + window.workorder + "/" + window.localStorage.getItem("api"), function (notedata) {
		if (notedata[0] === undefined) {
			$('#notes li').remove();
			$('#notes').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/boots.png"><h1>There are no notes yet.</h1></a></li>');
			$('#notes').listview().listview('refresh');
		} else {
			$('#notes li').remove();
			$.each(notedata, function (index, value) {
			notetimestamp = moment.unix(value.timestamp).format('LLL');
				$.ajax({
					url: domain + "avatar/" + value.user + "/" + window.localStorage.getItem("api"),
					async: false,
					dataType: 'json',
					success: function (data) {
						window.usersavatar = data[0].avatarurl;
					}
				});
				$('#notes').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/'+window.usersavatar+'"><h1>' + value.eventdata + '</h1><p>' + notetimestamp + '</p></a></li>');
			var notes = document.getElementById("notes");
			var i = notes.childNodes.length;
			while (i--)
				notes.appendChild(notes.childNodes[i]);
				$('#notes').listview().listview('refresh');
			})
		}
	});
}

function loadEmployees() {
	$.getJSON(domain + "workorders/" + window.workorder + "/employee/" + window.localStorage.getItem("api"), function (empldata) {
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
		var addingemployee = $.getJSON(domain + "addemployeetoWO/" + employeeid + "/" + window.workorder + "/" + window.localStorage.getItem("api"), function (employees) {});
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

function loadDetails() {
	$.getJSON(domain + "workorders/" + window.workorder + "/detail/" + window.localStorage.getItem("api"), function (detaildata) {
		if (detaildata.detail.length === 0 || detaildata.detail.length === undefined) {
			$('#details li').remove();
			$('#details').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/boots.png"><h1>There are no details yet.</h1></a></li>');
			$('#details').listview().listview('refresh');
		} else {
			$('#details li').remove();
			$.each(detaildata.detail, function (index, value) {

				$.ajax({
					url: domain + "avatar/" + value.user + "/" + window.localStorage.getItem("api"),
					async: false,
					dataType: 'json',
					success: function (data) {
						window.usersavatar = data[0].avatarurl;
					}
				});

				detailtimestamp = moment.unix(value.timestamp).format('LLL');
				
				$('#details').append('<li data-icon="calendar"><a href="javascript:void(0)"><img src="images/avatars/' + window.usersavatar + '"><h1>' + value.eventdata + '</h1><p>' + detailtimestamp + '</p></a></li>');
			});
			var details = document.getElementById("details");
			var i = details.childNodes.length;
			while (i--)
				details.appendChild(details.childNodes[i]);
			$('#details').listview().listview('refresh');
		}

	});

}


function addTask() {
		var api = window.localStorage.getItem("api");

		alertify.prompt("Enter Task Name", function (e, str) {
		if (e) {
			var input = str;

			function addTaskString() {
				return JSON.stringify({
					"eventtype": "task",
					"eventdata": input
				});
			}
			$.ajax({
				type: 'POST',
				contentType: 'application/json',
				url: domain + 'events/' + window.workorder + "/" + api,
				dataType: 'json',
				data: addTaskString(),
				success: function (data, textStatus, jqXHR) {
					$(function () {
						LoadTasks(input);
						alertify.success('Task Added');
					});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$(function () {
						alertify.error('Error adding Task');
					});
				}
			});
		} else {
			alertify.error("Input cancelled");
		}
	}, "Task...");
}

function LoadTasks(checkboxname) {
			//each
			$('#tasks').controlgroup("container").append('<label for="chk"><input type="checkbox" id="'+checkboxname+'"  value="bar" />' + checkboxname + '</label>');
			$("#tasks").enhanceWithin().controlgroup("refresh");	
	
	$('input[type=checkbox]').change(
    function(){
        if (this.checked) {
			this.disabled = true;
			console.log(this);
            alertify.success('Completed task ' + this.id);
        }
    });
}

function addDetail() {
	var api = window.localStorage.getItem("api");
	alertify.prompt("Enter Detail", function (e, str) {
		if (e) {
			var input = str;

			function addDetailsString() {
				return JSON.stringify({
					"eventtype": "detail",
					"eventdata": input
				});
			}
			$.ajax({
				type: 'POST',
				contentType: 'application/json',
				url: domain + 'events/' + window.workorder + "/" + api,
				dataType: 'json',
				data: addDetailsString(),
				success: function (data, textStatus, jqXHR) {
					$(function () {
						loadDetails();
						alertify.success('Detail Added');
					});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$(function () {
						alertify.error('Error adding Detail');
					});
				}
			});
		} else {
			alertify.error("Input cancelled");
		}
	}, "Detail...");


}

function addNote() {
		var api = window.localStorage.getItem("api");
	alertify.prompt("Enter Note", function (e, str) {
		if (e) {
			var input = str;
			function addNoteString() {
				return JSON.stringify({
					"eventtype": "note",
					"eventdata": input
				});
			}
			$.ajax({
				type: 'POST',
				contentType: 'application/json',
				url: domain + 'events/' + window.workorder + "/" + api,
				dataType: 'json',
				data: addNoteString(),
				success: function (data, textStatus, jqXHR) {
					$(function () {
						loadNotes();
						alertify.success('Note Added');
					});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$(function () {
						alertify.error('Error adding Note');
					});
				}
			});
		} else {
			alertify.error("Input cancelled");
		}
	}, "Note...");

}


function loademployees() {
	$('#employeelist li').remove();
	$.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function (employees) {
		var splitme = employees.employeeids;
		var employees = splitme.split(', ');
		$.each(employees, function (index, value) {
			$.getJSON(domain + "profile/" + value, function (profiledata) {
				$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + profiledata[0].lastseen, function (lastseendata) {
					lastseen = lastseendata.results[2].formatted_address;
					$('#employeelist').append("<li><a href='javascript:void(0)' onclick='createEmployeeProfile(" + value + ")'><img src='images/avatars/" + profiledata[0].avatarurl + "'><h2>" + profiledata[0].fullname + "</h2><p>Last seen in " + lastseen + "</p></a></li>");
					$('#employeelist').listview().listview('refresh');
				});

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
	var events_array = new Array(
		{
			startDate: new Date(2011,07, 20),
			endDate: new Date(2012,00, 10),
			title: "Event 1",
			description: "",
			allDay: true,
			priority: 3, // 1 = Low, 2 = Medium, 3 = Urgent
			frecuency: 1 // 1 = Daily, 2 = Weekly, 3 = Monthly, 4 = Yearly
		},
		{
			startDate: new Date(2011,07, 20, 17, 50),
			endDate: new Date(2012,00, 20, 18, 00),
			title: "Event 2",
			description: "Description 2",
			priority: 1,
			frecuency:1
		},
		{
			startDate: new Date(2011,07, 20, 18, 0),
			endDate: new Date(2012,00, 20, 21, 30),
			title: "Event 3",
			description: "Description 3",
			priority: 3,
			frecuency:1
		}
	);	
	$("#calendar").dp_calendar({
		events_array: events_array
	});
	

	var pagedats = $(
		'<div data-role="page" id="view-calendar" data-theme="a">' +
		'<div data-role="content">' +
		'<div id="calendar"></div>' +
		'</div>' +
		'</div>');
	pagedats.appendTo($.mobile.pageContainer);
    $.mobile.changePage(pagedats);
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
			+ account[0].fullname + '</div>' +
			'<div class="ui-block-b" style="width:100%">' +
			'<div>block b</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div id="myaccountmap"></div>' +
			'<div data-role="footer" data-theme="a">&nbsp;' +
			'</div>' +
			'</div>');
		epdata.appendTo($.mobile.pageContainer);
		$.mobile.changePage(epdata);
		loadMap();

	});
}
	
function loadMap() {
		$('#myaccountmap').css('height', '350px');
		var mylocation = window.localStorage.getItem("mylocation");
		var coordinates = mylocation.split(',');
            $.ajax(
            {
                type : "GET",
                url: "http://maps.google.com/maps/api/geocode/json",
                dataType: "json",
                data: {
                    address: mylocation,
                    sensor: "true"
                },
                success: function(data) {
                    set = data;
					window.you = (set.results[0].address_components[1].short_name + ", " + set.results[0].address_components[2].short_name + ", " + set.results[0].address_components[4].short_name);
					console.log(window.you);
                },
                error : function() {
                    alertify.error("Error.");
                }
				
            });
		var myLatlng = new google.maps.LatLng(coordinates[0], coordinates[1]);
		var map = new google.maps.Map(document.getElementById('myaccountmap'), {
			zoom: 11,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		var markertitle = "<div style='padding: 10px;'>"+window.you+"</div>";
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
	}
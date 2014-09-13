var domain = "https://Traxxman.com/api/";
var domain = "http://192.168.78.1/Traxxman/api/";

$body = $("body");


$(document).on("pagebeforeshow", "#sendMessage", function (event) {
	loadinboxemployees();
});

$(document).on("pageinit", "#home", function (event) {
});

$(document).on("pagebeforeshow", "#home", function (event) {
	apicheck();
	loadnavbar();
});

$(document).on("pagebeforeshow", "#workorders", function (event) {
	alertify.success("Loading work orders...");
	loadworkorderslist();
});



$(document).on("pagebeforeshow", "#inbox", function (event) {
	alertify.success("Loading inbox...");
	loadinbox();
});

$(document).on("beforepageshow", "#employees", function (event) {
	alertify.success("Loading your employees...");
	loademployees();
});


function check() {
	var un = document.getElementById('username').value;
	var action = 'check';
	$.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&action=' + action, function (res) {
		alertify.success('The username ' + un + res.status + '!');
	}).fail( function(d, textStatus, error) {
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
			window.localStorage.setItem("api", res.api);
			if (api != 'undefined') {
				window.location = "dashboard.html";
			} else {
				alertify.error("Error logging in!");
			}
		} else {
			alertify.success(res.status);
		}})
		.fail( function(d, textStatus, error) {
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
			}
					 ).fail( function(d, textStatus, error) {
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
	window.location = "index.html";
}


$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

function loadworkorderslist() {
	$('#workOrdersList li').remove();
	var api = window.localStorage.getItem("api");
	$.getJSON(domain + "workorders/" + api, function (data) {
		var splitme = data.workorderids;
		var workorders = splitme.split(', ');
		$.each(workorders, function (index, value) {
		$.getJSON(domain + "workorderaddress/" + value + "/" + api, function (addressdata) {
		$.getJSON(domain + "workordertitle/" + value + "/" + api, function (titledata) {
		var ordernumber = value.replace('x','');
		$.getJSON(domain + "tools/createmap/" + addressdata[0].eventdata, function (addressdata) {
	$('#workOrdersList').append('<li><a href="javascript:void(0)" onclick="createWorkOrderPage(' + "'" + value + "'" + ')"><img src="' + addressdata + '"></img><h2>'+ titledata[0].eventdata + '</h2><p>Work Order #' + ordernumber + '</p></a></li>');			
	$('#workOrdersList').listview().listview('refresh');
						}); }); }); }); }); };


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
		document.getElementById('messagescount').innerHTML = "<p>" + data[0].unreadmessages + " Messages</p>";
	});
};

function loadinbox() {
	$('#messageslist li').remove();
	$.getJSON(domain + "inbox/lastten/" + window.localStorage.getItem("api"), function (data) {
		for (var i = 0, l = data.messages.length; i < l; i++) {
			var obj = data.messages[i];
			$.getJSON(domain + "avatar/" + obj.from + "/" + window.localStorage.getItem("api"), function (zedata) {
				avatarurl = zedata[0].avatarurl;
	$('#messageslist').append('<li data-icon="mail"><a href="javascript:void(0)" onclick="createReply('+ obj.id +');"><img src="images/avatars/' + avatarurl + '"><h3>' + obj.friendlyfrom + '</h3><p>' + obj.subject + '</p></a></li>');
			$('#messageslist').listview('refresh');	
				});
		}
		});
};

function createReply (msgid) {
alertify.prompt("This is a prompt dialog " + msgid, function (e, str) {
				if (e) {
					alertify.success("Sending your message to " + str);
				} else {
					alertify.error("Reply cancelled");
				}
			}, "Your reply...");
			return false;
}


function loadinboxemployees() {
			$('#employeeinboxlist li').remove();
	$.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function (employees) {
		var splitme = employees.employeeids;
		var employees = splitme.split(', ');
		$.each(employees, function (index, value) {
			$.getJSON(domain + "employeefullname/" + value, function (namedata) {
				$('#employeeinboxlist').append('<option value="' + value + '">'+ namedata[0].fullname + '</option>');
			$('#employeeinboxlist').selectmenu();
					$('#employeeinboxlist').selectmenu('refresh');
	});

		})							

	})
}

function isloggedin() {
	var api = window.localStorage.getItem("api");
	if (api == null || api == false || api == "") {
		} else {
		alertify.success("Logging you in...");
		$.getJSON(domain + "tools/apicheck/" + api, function (validation) {
	if (validation == "valid")
	{
		window.location = "dashboard.html";
	} else {
	alertify.error("Please re-login");	
	}
	}).fail( function(d, textStatus, error) {
					alertify.error("Could not connect to Traxxman Cloud");

    });
}}


function apicheck() {
	var api = window.localStorage.getItem("api");
	if (api === null || api === false || api === "") {
		window.location = "index.html";
		} else {
		$.getJSON(domain + "tools/apicheck/" + api, function (validation) {
	if (validation !== "valid")
	{
		window.location = "index.html";
	}
	}).fail( function(d, textStatus, error) {
		window.localStorage.removeItem("api");
					alertify.error("Could not connect to Traxxman Cloud");

    });
}}


function addEmployee() {
	var addemployeedata = 
	$('<div id="addemployee" data-role="page" align="center" data-transition="slide">' +
	  '<div data-role="header" data-theme="a">'+
	  '<img border="0" src="header.png" alt="Traxxman" style="position: center" />' +
	  '<a href="#home" data-role="button" data-icon="back">Back</a></div>'+
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
		})}
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


$(document).on('pageshow', '#workorderpage',function(e,data){   
    $('#workordermap').css('height',getRealContentHeight());
    var minZoomLevel = 5;
	var coordinates = jobsite.split(',');
	var myLatlng = new google.maps.LatLng(coordinates[0], coordinates[1]);
    var map = new google.maps.Map(document.getElementById('workordermap'), {
      zoom: 11,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   });

   var strictBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(28.70, -127.50), 
     new google.maps.LatLng(48.85, -55.90)
   );
	
   google.maps.event.addListener(map, 'dragend', function() {
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
		
   // Limit the zoom level
   google.maps.event.addListener(map, 'zoom_changed', function() {
     if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
   });  
	
        var locations = [
            [title, coordinates[0], coordinates[1], 'images/electric.png'],
        ];
			var marker, i;
        for (i = 0; i < locations.length; i++) {
			
			var markertitle = '<p>' + locations[i][0]; + '</p>';
			
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                icon: locations[i][3],
				title: markertitle
				
			});
			var $infoWindowContent = $("<div class='infowin-content'>"+ locations[i][0] +"</div>");
			var infoWindow = new google.maps.InfoWindow();
			infoWindow.setContent($infoWindowContent[0]);
			
			
			google.maps.event.addListener(marker, 'click', function() {
    		infoWindow.open(map,marker);
});

		};
	
});

function getRealContentHeight() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    } 
    return content_height;
}

function createWorkOrderPage(id) {
	$.getJSON(domain + "workorders/" + id + "/" + window.localStorage.getItem("api"), function (jobdata) {
	workorder = id;
	jobsite = jobdata[3].eventdata;
	title = jobdata[1].eventdata;
	var ordernumber = id.replace('x','');
	var pagedata = $('<div id="workorderpage" data-role="page" align="center">' +
		'<div data-role="header" data-theme="a" style="min-height: 50px;">' +
		'<a href="#home" data-role="button" data-icon="back">Back</a>' +
		'</div>' +
		'<img border="0" src="header.png" alt="Traxxman" style="position: center"/>' +
		'<div data-role="content" data-theme="a">' +
		'<h1>' + jobdata[2].eventdata + '</h1>' +
		'<h2>Created by ' + jobdata[0].user + '</h2>' +
		'<p>Work Order #'+ ordernumber +'</p>' +
		'<p>2:30pm EST - 9/10/14</p>' +
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
		'</ul><div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addNote();">Add Note</a></div></div></div>'+
		'<div data-role="collapsibleset">' +
		'<div data-role="collapsible">' +
		'<h3>Employees</h3>' +
		'<ul data-role="listview" id="woemployees">' +
		'</ul><div data-role="content" data-theme="a"><a href="javascript:void(0)" data-role="button" onclick="addEmployeetoWO();">Add Employee</a></div>' +
					 '</div><div data-role="footer" data-theme="a">&nbsp;</div></div>');
	pagedata.appendTo($.mobile.pageContainer);
	$.mobile.changePage(pagedata);
		
function loadtasks() {
	
$('#tasks').controlgroup("container")
.append('<label for="chk"><input type="checkbox" name="clock-place" id="chk" value="bar" />Complete Task 1</label>')
.append('<label for="chk"><input type="checkbox" name="clock-place" id="chk" value="bar" />Close Work Order</label>')
$("#tasks").enhanceWithin().controlgroup("refresh");

}

function loadDetails() {
$.getJSON(domain + "/workorders/" + id + "/jobsite/" + window.localStorage.getItem("api"), function (jobdata) {
		$('#details li').remove();
		$.each(jobdata[0], function (index, value) {
			console.log(index + value);
			
			$('#details').append('<li data-icon="calendar"><a href="#"><img src="https://traxxman.com/app/ryan.jpg"><h1>'+index+'</h1><p>'+value+'</p></a></li>');
			
			
				$('#details').listview().listview('refresh');

	});
});
}

function loadEvents() {
console.log('loading events...');

}
		
function loadNotes() {
	$.getJSON(domain + "workorders/" + workorder + "/note/" + window.localStorage.getItem("api"), function (notedata) {
		$('#notes li').remove();
		for (var i = 0, l = notedata.note.length; i < l; i++) {
			var obj = notedata.note[i];
			console.log(obj);
			url = 'https://traxxman.com/app/ryan.jpg';
			$('#notes').append('<li data-icon="edit"><a href="javascript:void(0)"><img src="'+url+'"><h1>Note Title</h1><p>Note information</p><+/a></li>');
				$('#notes').listview().listview('refresh');

	};
});
}

function loadEmployees() {
		$.getJSON(domain + "/workorders/" + id + "/jobsite/" + window.localStorage.getItem("api"), function (jobdata) {
		$('#woemployees li').remove();
		$.each(jobdata[0], function (index, value) {
			console.log(index + value);
			
			$('#woemployees').append('<li data-icon="user"><a href="javascript:void(0)"><img src="https://traxxman.com/app/ljsmall.png"><h1>Employee</h1><p>Employee Info</p></a></li>');
			
				$('#woemployees').listview().listview('refresh');

	});
});
}
		
function addTask() {
	
}

function addDetail() {
			$('#details').append('<li data-icon="calendar"><a href="#"><img src="https://traxxman.com/app/ryan.jpg"><h1>Detail Title</h1><p>Detail information</p></a></li>');
			
			
				$('#details').listview().listview('refresh');

}
function addNote() {

}
		
function addEmployeetoWO() {

}
	loadtasks();
	loadDetails();
	loadEmployees();
	loadNotes();
});
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
	var pagedatas = $('<div id="employeeprofile" data-role="page" align="center" data-transition="slide"><div data-role="header" data-theme="a"><img border="0" src="header.png" alt="Traxxman" style="position: center" /><a href="#home" data-role="button" data-icon="back">Back</a></div><h2>'+ profiledata[0].fullname +'s Profile</h2><div data-role="content" data-theme="a"><img src="images/avatars/"></div><div data-role="footer" data-theme="a">&nbsp;</div></div>');
	});
	pagedatas.appendTo($.mobile.pageContainer);
	$.mobile.changePage(pagedatas);
}

function myAccount() {
	$.getJSON(domain + "myaccount/" + window.localStorage.getItem("api"), function (account) {
	var epdata = $('<div id="myaccount" data-role="page" align="center" >' +
		'<div data-role="header" data-theme="a" style="min-height: 50px;">&nbsp;' + 
			'<a href="#home" data-role="button" data-icon="back">Back</a>' +
		'</div>' +
				'<div id="header"><img src="header.png"></div>' +
		'<div role="main" class="ui-content">' +
			'<div class="ui-grid-a">' + 
				'<div class="ui-block-a" style="height:100%">' + 
				'<img style="height: 150px; width: 150px;" src="images/avatars/' + account[0].avatarurl + '" is="image">' + 
				'</div>' + 
				'<div class="ui-block-b" style="height:100%">' + 
				'<div id="info">' + account[0].fullname + '</div>' + 
			'</div>' + 
			'</div>' + 
			'</div>' + 
		'<div data-role="footer" data-theme="a">&nbsp;' + 
		'</div>' + 
	'</div>');
		epdata.appendTo($.mobile.pageContainer);
	$.mobile.changePage(epdata);
		});
}
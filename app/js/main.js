
var domain = "http://192.168.1.79/Traxxman/api/";

function check() {

    var un = document.getElementById('username').value;
    var action = 'check';
    $.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&action=' + action, function(res) {
	                setTimeout(function() {
                    $.bootstrapGrowl('The username "' + un + '" is ' + res.status + '!', { type: 'success' });
                }, 1000);
    });

}

function login() {

    var un = document.getElementById("username").value;
    var pw = document.getElementById("password").value;

    var action = 'login';

    $.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&action=' + action, function(res) {
        if (res.status == "success") {
			api = res.api;
            window.localStorage.setItem("api", res.api);
            if (api != 'undefined') {
                            window.location = "dashboard.html";
            } else {
                document.getElementById('loginmessage').innerHTML = "Error logging in!";
            }
        } else {
            document.getElementById('loginmessage').innerHTML = res.status;
        }
    });
}

function forgot() {

    var em = document.getElementById("email").value;

    var action = 'forgot';

    $.getJSON(domain + 'proxy.php?callback=?', 'em=' + em + '&action=' + action, function(res) {

        document.write(res.status);

    });
}

function signup() {
    var un = document.getElementById('username').value;
    var em = document.getElementById('email').value;
    var pw = document.getElementById('password').value;
    var pw2 = document.getElementById('password2').value;
    var action = 'reg';
    if (document.getElementById('email').value == '' || document.getElementById('username').value == '' || document.getElementById('password').value == '' || document.getElementById('password2').value == '') {
        document.getElementById('message').innerHTML = '<b>All fields must be completed</b>';
    } else {
        if (pw == pw2) {
            $.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&em=' + em + '&action=' + action, function(res) {


                if (res.status == 'That does not appear to be a valid email address') {
                    document.getElementById('message').innerHTML = '<b>' + res.status + '</b>';
                } else {
                    document.getElementById('message').innerHTML = '<b>' + res.status + '</b>';
                    document.getElementById('email').value = '';
                    document.getElementById('username').value = '';
                    document.getElementById('password').value = '';
                    document.getElementById('password2').value = '';
                    document.getElementById('result').innerHTML = '';
                }
                if (res.status == 'That email address is already registed with Traxxman') {
                    document.getElementById('message').innerHTML = '<b>' + res.status + '</b>';
                } else {
                    document.getElementById('message').innerHTML = '<b>' + res.status + '</b>';
                    document.getElementById('email').value = '';
                    document.getElementById('username').value = '';
                    document.getElementById('password').value = '';
                    document.getElementById('password2').value = '';
                    document.getElementById('result').innerHTML = '';
                }

            });
        } else {
            document.getElementById('passw').innerHTML = '<b>Your passwords must match</b>';
            document.getElementById('message').innerHTML = '';
            document.getElementById('result').innerHTML = '';
        }
    }


}

function logOutReady() {
    window.localStorage.removeItem("api");
    window.location = "index.html";
}

function formToJSONWOADD() {
    return JSON.stringify({
        "ordernumber": $('#ordernumber').val(),
        "api": window.localStorage.getItem("api"),
		"ordertitle": $('#ordertitle').val(),
		"orderlocation": $('#orderlocation').val()
    });
}

function loadworkorderslist() {
		    	$('#workOrdersList li').remove();

	    $.getJSON(domain + "workorders/" + window.localStorage.getItem("api"), function(data) {
				
        var splitme = data.workorderids;
        var workorders = splitme.split(', ');

        $.each(workorders, function(index, value) {

            $.getJSON(domain + "workorders/" + value + "/" + window.localStorage.getItem("api"), function(data) {
                $.getJSON(domain + "workorderaddress/" + value + "/" + window.localStorage.getItem("api"), function(addressdata) {
                        $.getJSON(domain + "workordertitle/" + value + "/" + window.localStorage.getItem("api"), function(titledata) {
                            $('#workOrdersList').append('<li><a href="#workorderpage"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + addressdata[0].eventdata + '&zoom=7&size=150x150&markers=color:red%7Clabel:A%7C' + addressdata[0].eventdata + '"></img><h2>' + titledata[0].eventdata + '</h2><p>Work Order #' + value + '</p></a><a href="#map-page">' + addressdata[0].eventdata + '</a></li>');
							
                            $('#workOrdersList').listview().listview('refresh');
                    });
                });
            });
        });
    });
};




function addWorkOrders() {
    var ordernumber = $('#ordernumber').val();
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: domain + 'workorders',
        dataType: 'json',
        data: formToJSONWOADD(),
        success: function(data, textStatus, jqXHR) {
			$(function() {
                setTimeout(function() {
                    $.bootstrapGrowl('<b>Work Order #' + ordernumber + ' Created</b>', { type: 'success' });
                }, 1000);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
						$(function() {
                setTimeout(function() {
                    $.bootstrapGrowl('<b>Work Order Error: ' + textStatus + '</b>', { type: 'success' });
                }, 1000);
            });
        }
    });
}

	function loadnavbar() {
    $.getJSON(domain + "fullname/" + window.localStorage.getItem("api"), function(data) {
        document.getElementById('username').innerHTML = data[0].fullname;
    }); 
    $.getJSON(domain + "workordercount/" + window.localStorage.getItem("api"), function(data) {
        document.getElementById('workordercount').innerHTML = data[0].workordercount + " Work Orders";
    });
    $.getJSON(domain + "messagescount/" + window.localStorage.getItem("api"), function(data) {
        document.getElementById('messagescount').innerHTML = data[0].unreadmessages + " Messages";
    });
	};

	function loadinbox() {
    	$('#messageslist li').remove();
    $.getJSON(domain + "inbox/lastten/" + window.localStorage.getItem("api"), function(data) {
        for (var i = 0, l = data.messages.length; i < l; i++) {
            var obj = data.messages[i];
            $('#messageslist').append('<li data-icon="mail"><a href="#popupReply' + i + '" data-rel="popup"><h3>' + obj.friendlyfrom + '</h3><p>' + obj.subject + '</p><p>' + obj.contents + '</p><p class="ui-li-aside">' + obj.timestamp + '</p></a></li>');
            $('#popupReply' + i).append('<h3 style="padding top: 10px 10px;">' + obj.contents + '</h3><div style="padding:10px 10px;"><label for="reply" class="ui-hidden-accessible"></label><input type="text" placeholder="Message subject" name="subject" id="subject" data-theme="a"></input><textarea placeholder="Write your message..." name="contents" id="contents" data-theme="a"></textarea><br><button type="submit" data-theme="a" onclick="messagereply(' + obj.from + ')">Reply to ' + obj.friendlyfrom + '</button></div>');
			$('#popupReply' + i).trigger("create");
			$('#popupReply' + i).listview();
            $('#messageslist').listview().listview('refresh');
        }
    });
};

function loadinboxemployees() {
    $.getJSON(domain + "employees/" + window.localStorage.getItem("api"), function(employees) {
        console.log();
		
		        var splitme = employees.employeeids;
        var employees = splitme.split(', ');

        $.each(employees, function(index, value) {
			console.log(index + value);
    }); 
})};

function apicheck() {
var api = window.localStorage.getItem("api");
		if(api == null || api == false || api == "")
							{
					window.location = "index.html";
				}
// Next run apikey across the database /isvalid/api {status: "active", "inactive"}
}





$(document).on("pageinit", "#map-page", function(event) {
$('#map_canvas').gmap().bind('init', function(evt, map) {
	$('#map_canvas').gmap('getCurrentPosition', function(position, status) {
		if ( status === 'OK' ) {
			var image = '../ryan.jpg';
			var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$('#map_canvas').gmap('addMarker', {'position': clientPosition, 'bounds': true, 'icon': image});
			$('#map_canvas').gmap('addShape', 'Circle', { 
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

$(document).on("pageshow", "#map-page", function(event) {
	 $('#map_canvas').gmap('refresh');
});

$(document).on("pageshow", "#home", function(event) {
loadnavbar();
apicheck();
});

$(document).on("pageinit", "#workorders", function(event) {
});

$(document).on("pageshow", "#workorders", function(event) {
		                setTimeout(function() {
                    $.bootstrapGrowl("Loading your Work Orders...", { type: 'success' });
                }, 1000);
	loadworkorderslist();
});



$(document).on("pageinit", "#inbox", function(event) {
	loadinboxemployees();

});

$(document).on("pageshow", "#inbox", function(event) {
		                setTimeout(function() {
                    $.bootstrapGrowl("Loading new messages...", { type: 'success' });
                }, 1000);
	loadinbox();
});

$(document).on("pageshow", "#sendMessage", function(event) {
});


function messagereply(id) {
    var to = id;
    function MessageReplyData() {
        return JSON.stringify({
            "api": window.localStorage.getItem("api"),
            "to": to,
            "subject": $('#subject').val(),
            "contents": $('#contents').val(),
        })

    }
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: domain + 'inbox',
        dataType: 'json',
        data: MessageReplyData(),
        success: function(data, textStatus, jqXHR) {
$(function() {
                setTimeout(function() {
                    $.bootstrapGrowl("Message sent.", { type: 'success' });
                }, 1000);
            });        },
        error: function(jqXHR, textStatus, errorThrown) {
$(function() {
                setTimeout(function() {
                    $.bootstrapGrowl(textStatus, { type: 'danger' });
                }, 1000);
            });        }
    });
}


function newMessageData() {
        return JSON.stringify({
            "api": window.localStorage.getItem("api"),
            "to": $("#sendmessageid").val(),
            "subject": $('#newsubject').val(),
            "contents": $('#newcontents').val(),
        });
};

function newMessage() {
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: domain + 'inbox',
        dataType: 'json',
        data: newMessageData(),
        success: function(data, textStatus, jqXHR) {
$(function() {
                setTimeout(function() {
                    $.bootstrapGrowl("Message sent.", { type: 'success' });
                }, 1000);
            });        
		},
        error: function(jqXHR, textStatus, errorThrown) {
            $(function() {
                setTimeout(function() {
                    $.bootstrapGrowl(textStatus, { type: 'danger' });
                }, 1000);
            });;
        }
    });
};

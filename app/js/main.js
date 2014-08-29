var domain = "http://127.0.0.1/Traxxman/api/";


function check() {

    var un = document.getElementById('username').value;
    var action = 'check';
    $.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&action=' + action, function(res) {

        document.getElementById('result').innerHTML = '<b>' + res.status + '</b>';

    });

}

function login() {

    var un = document.getElementById("username").value;
    var pw = document.getElementById("password").value;

    var action = 'login';

    $.getJSON(domain + 'proxy.php?callback=?', 'un=' + un + '&pw=' + pw + '&action=' + action, function(res) {

        if (res.status == "success") {

            window.localStorage.setItem("api", res.api);
            window.location = "dashboard.html";

            if (id != 'undefined') {
                document.getElementById('message').innerHTML = res.api;
            } else {
                document.getElementById('message').innerHTML = "Error logging in!";
            }
        } else {
            document.getElementById('message').innerHTML = '<b>' + res.status + '</b>';
        }
    });
}

function forgot() {

    var em = document.getElementById("email").value;

    var action = 'forgot';

    $.getJSON(domain + 'proxy.php?callback=?', 'em=' + em + '&action=' + action, function(res) {

        document.write('<b>' + res.status + '</b><br>');

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
        "ordernumber": "X" + $('#ordernumber').val(),
        "user": window.localStorage.getItem("api"),
    });
}

function addWorkorders() {
    var ordernumber = $('#ordernumber').val();
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: domain + 'workorders',
        dataType: 'json',
        data: formToJSONWOADD(),
        success: function(data, textStatus, jqXHR) {
            document.getElementById('status').innerHTML = '<b>Work Order #' + ordernumber + ' Created</b>';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            document.getElementById('status').innerHTML = '<b>Work Order Error: ' + textStatus + '</b>';
        }
    });
}
$(document).on("pageinit", "#home", function(event) {
    $.getJSON(domain + "fullname/" + window.localStorage.getItem("api"), function(data) {
        document.getElementById('username').innerHTML = data[0].fullname;
    });
    $.getJSON(domain + "workordercount/" + window.localStorage.getItem("api"), function(data) {
        document.getElementById('workordercount').innerHTML = data[0].workordercount + " Work Orders";
    });
    $.getJSON(domain + "messagescount/" + window.localStorage.getItem("api"), function(data) {
        document.getElementById('messagescount').innerHTML = data[0].unreadmessages + " Messages";
    });
});
$(document).on("pageinit", "#workorders", function(event) {
    $.getJSON(domain + "workorders/" + window.localStorage.getItem("api"), function(data) {

        var splitme = data.workorderids;
        var workorders = splitme.split(', ');

        $.each(workorders, function(index, value) {

            $.getJSON(domain + "workorders/" + value + "/" + window.localStorage.getItem("api"), function(data) {
                $.getJSON(domain + "workorderaddress/" + value + "/" + window.localStorage.getItem("api"), function(addressdata) {
                    $.getJSON(domain + "workorderaddress/" + value + "/" + window.localStorage.getItem("api"), function(addressdata) {
                        $.getJSON(domain + "workordertitle/" + value + "/" + window.localStorage.getItem("api"), function(titledata) {

                            $('#workorderslist').append('<li><a href="#workorderpage"><img src="http://maps.googleapis.com/maps/api/staticmap?center=' + addressdata[0].eventdata + '&zoom=12&size=150x150&markers=color:red%7Clabel:A%7C' + addressdata[0].eventdata + '"></img><h2>' + value + '</h2><p>' + titledata[0].eventdata + '</p></a><a href="#mappage">' + addressdata[0].eventdata + '</a></li>');

                            $('#workorderslist').listview().listview('refresh');
                        });
                    });
                });
            });
        });
    });
});

$(document).on("pageinit", "#inbox", function(event) {
    $.mobile.loading('show');
    $.getJSON(domain + "inbox/lastten/" + window.localStorage.getItem("api"), function(data) {
        for (var i = 0, l = data.messages.length; i < l; i++) {
            var obj = data.messages[i];
            $('#messageslist').append('<li><a href="#popupReply' + i + '" data-rel="popup"><h3>' + obj.friendlyfrom + '</h3><p><strong>' + obj.subject + '</strong></p><p>' + obj.contents + '</p><p class="ui-li-aside"><strong>' + obj.timestamp + '</strong></p></a></li>');
            $('#popupReply' + i).append('<h3 style="padding-top: 10px;">' + obj.contents + '</h3><form><div style="padding:10px 10px;"><label for="reply" class="ui-hidden-accessible"></label><input type="text" placeholder="Message subject" name="subject" id="subject" data-theme="a""></input><br><textarea placeholder="Write your message..." name="contents" id="contents" data-theme="a""></textarea><br><button type="submit" data-theme="a" onclick="messagereply(' + obj.from + ')">Reply to ' + obj.friendlyfrom + '</button></div></form>');
            $('#messageslist').listview().listview('refresh');
        }

    });
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
            alert('Message sent!');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function newMessage() {
    function MessageReplyData() {
        return JSON.stringify({
            "api": window.localStorage.getItem("api"),
            "to": $("#sendmessageid").val(),
            "subject": $('#subject').val(),
            "contents": $('#contents').val(),
        });

    }
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: domain + 'inbox',
        dataType: 'json',
        data: MessageReplyData(),
        success: function(data, textStatus, jqXHR) {
            alert('Message sent!');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

$(document).on("pageinit", "#calendar", function(event) {
	            $(function() { 
var map = new google.maps.Map(document.getElementById("map_canvas"), {zoom:5, center:new google.maps.LatLng(30.5133685,-87.8804408)});});
});
<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/username/:apikey',	'getUsername');

$app->get('/fullname/:apikey',	'getfullName');

$app->get('/idfromapi/:api',	'getIDFromAPI');

$app->post('/lastseen/:api', 'lastSeen');

$app->get('/inbox/lastten/:apikey', 'getLastTen');

$app->get('/inbox/nextten/:apikey', 'getNextTen');

$app->get('/messagescount/:apikey',	'messagesCount');

$app->post('/inbox', 'sendMessage');

$app->get('/workorders/:apikey', 'getWorkorders');

$app->get('/workorders/:id/:apikey', 'getWorkOrderDetails');

$app->get('/workorders/:id/:events/:apikey', 'getWorkOrderEvents');

$app->get('/workorderauthor/:id/:apikey', 'getWorkOrderAuthor');

$app->get('/workorderaddress/:id/:apikey', 'getWorkOrderLocation');

$app->get('/workordertitle/:id/:apikey', 'getWorkOrderTitle');

$app->get('/workordercount/:apikey', 'workOrderCount');

$app->post('/workorders', 'addWorkorders');

$app->get('/employees/:apikey', 'getEmployees');

$app->get('/employees/:id', 'getEmployeeInfo');

$app->post('/events/:id', 'addEvent');

$app->get('/tools/phytogeo/:phy', 'phyToGeo');

$app->get('/tools/timeconvert/:time', 'timeConvert');

$app->get('/tools/createmap/:location', 'createMap');


$app->run();

function getConnection() {
	    $dbhost = 'localhost';
    $dbuser = 'root';
    $dbpass = '123456';
    $dbname = 'traxxman';
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function getUsername($apikey) {
	$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 

function getWorkOrderDetails($id, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "select * FROM " .$id;
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 

function getWorkOrderAuthor($id, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "SELECT user FROM ".$id." WHERE event = 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 

function getWorkOrderLocation($id, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "SELECT eventdata FROM ".$id." WHERE eventtype = 'jobsite'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 
function getWorkOrderTitle($id, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "SELECT eventdata FROM ".$id." WHERE eventtype = 'title'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 

function getWorkOrderEvents($id, $events, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "select * FROM " .$id. " WHERE `eventtype` = '".$events."'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function sendMessage() {
	error_log('sendMessage\n', 3, 'inbox.log');
	$request = Slim::getInstance()->request();
	$msgdata = json_decode($request->getBody());
	date_default_timezone_set("America/New_York");
	$timestamp = timeConvert(time());
	$apikey = $msgdata->api;
	$to = $msgdata->to;
	$sql = "select fullname FROM users WHERE `id` = '" .$msgdata->to. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$sqldata = null;}
				catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}
		if ($users[0]->fullname == "") {
		$sql = "select username FROM users WHERE `id` = '" .$msgdata->to. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$sqldata = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$to = '[{"fullname":"' . $sqldata[0]->username . '"}]';
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}}
		else {
		$to = '[{"fullname":"' . $users[0]->fullname . '"}]';
		}
		$friendlyto = json_decode($to);
		$sql = "select fullname FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		if ($users[0]->fullname == "") {
		$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$from = '[{"fullname":"' . $users[0]->username . '"}]';
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		}
		else {
		$from = '[{"fullname":"' . $users[0]->fullname . '"}]';
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		$sql = "select id FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$fromid = '[{"id":"' . $users[0]->id . '"}]';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$friendlyfrom = json_decode($from);
	$from = json_decode($fromid);
	$location = "Daphne, AL";
	$read = "0";
	$sql = 'INSERT INTO `traxxman`.`inbox` (`id`, `subject`, `from`, `friendlyfrom`, `to`, `friendlyto`, `contents`, `location`, `timestamp`, `read`) VALUES (NULL, :subject, :from, :friendlyfrom, :to, :friendlyto, :contents, :location, :timestamp, '.$read.')';
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("subject", $msgdata->subject);
		$stmt->bindParam("from", $from[0]->id);
		$stmt->bindParam("friendlyfrom", $friendlyfrom[0]->fullname);
		$stmt->bindParam("to", $msgdata->to);
		$stmt->bindParam("friendlyto", $friendlyto[0]->fullname);
		$stmt->bindParam("contents", $msgdata->contents);
		$stmt->bindParam("location", $location);
		$stmt->bindParam("timestamp", $timestamp);
		$stmt->execute();
		$db = null;
		echo json_encode($msgdata); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'inboxerrors.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function messagesCount($apikey) {
	$sql = "select unreadmessages FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function workOrderCount($apikey) {
	$sql = "select workordercount FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 
function getfullName($apikey) {
	$sql = "select fullname FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		if ($users[0]->fullname == "") {
		$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '[{"fullname":"' . $users[0]->username . '"}]';
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		}
		else {
		echo '[{"fullname":"' . $users[0]->fullname . '"}]';
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getIDFromAPI($apikey) {
	$sql = "select id FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '[{"id":"' . $users[0]->id . '"}]';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function getNameFromID($id) {
	$sql = "select fullname FROM users WHERE `id` = '" .$id. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$iddata = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		if ($iddata[0]->fullname == "") {
		$sql = "select username FROM users WHERE `id` = '" .$id. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$iddata = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '[{"fullname":"' . $iddata[0]->username . '"}]';
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		}
		else {
		echo '[{"fullname":"' . $iddata[0]->fullname . '"}]';
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getLastTen($apikey) {
	$sql = "select id FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$id = $data[0]->id;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$sql = "select * FROM inbox WHERE `to` = '" .$id. "'ORDER BY id DESC LIMIT 10";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"messages": ' . json_encode($users) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 



function phyToGeo($phy) {
	$address = str_replace(" ", "+", $phy);
	$url = "http://maps.google.com/maps/api/geocode/json?sensor=false&address=$address";
	$response = file_get_contents($url);
	$json = json_decode($response, TRUE);
	echo ($json['results'][0]['geometry']['location']['lat'] . "," . $json['results'][0]['geometry']['location']['lng']);
	}


function timeConvert($time) {
	return date("m/d/Y h:i a");
	}

function GMapCircle($Lat,$Lng,$Rad,$Detail=8){
  $R    = 6371;
 
  $pi   = pi();
 
  $Lat  = ($Lat * $pi) / 180;
  $Lng  = ($Lng * $pi) / 180;
  $d    = $Rad / $R;
 
  $points = array();
  $i = 0;
 
  for($i = 0; $i <= 360; $i+=$Detail):
    $brng = $i * $pi / 180;
 
    $pLat = asin(sin($Lat)*cos($d) + cos($Lat)*sin($d)*cos($brng));
    $pLng = (($Lng + atan2(sin($brng)*sin($d)*cos($Lat), cos($d)-sin($Lat)*sin($pLat))) * 180) / $pi;
    $pLat = ($pLat * 180) /$pi;
 
    $points[] = array($pLat,$pLng);
  endfor;
 
  require_once('polylineencoder.php');
  $PolyEnc   = new PolylineEncoder($points);
  $EncString = $PolyEnc->dpEncode();
 
  return $EncString['Points'];
}

function createMap($location) {
	$address = str_replace(" ", "+", $location);
	$url = "https://maps-api-ssl.google.com/maps/api/geocode/json?sensor=false&address=$address";
	$response = file_get_contents($url);
	$json = json_decode($response, TRUE);
	$lat = $json['results'][0]['geometry']['location']['lat'];
	$lng = $json['results'][0]['geometry']['location']['lng'];
	$MapLat    = $lat; // latitude for map and circle center
$MapLng    = $lng; // longitude as above
$MapRadius = 1;         // the radius of our circle (in Kilometres)
$MapFill   = 'E85F0E';    // fill colour of our circle
$MapBorder = '91A93A';    // border colour of our circle
$MapWidth  = 150;         // map image width (max 640px)
$MapHeight = 150;         // map image height (max 640px)
 
$EncString = GMapCircle($MapLat,$MapLng, $MapRadius);
 
/* put together the static map URL */
$MapAPI = 'https://maps.googleapis.com/maps/api/staticmap?';
$MapURL = $MapAPI.'center='.$MapLat.','.$MapLng.'&size='.$MapWidth.'x'.$MapHeight.'&maptype=roadmap&path=fillcolor:0x'.$MapFill.'33%7Ccolor:0x'.$MapBorder.'00%7Cenc:'.$EncString.'&zoom=11&sensor=true&markers=color:red%7C'.$address;
 
echo $MapURL;
	}


function getWorkorders($apikey) {
	$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$username = $users[0]->username;
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$sql = "select workorderids FROM users WHERE `username` = '" .$username. "'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		//$ids = $data[0]->workorderids;
		echo json_encode($data[0]);
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	
}

function getEmployees($apikey) {
	$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$username = $users[0]->username;
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$sql = "select employeeids FROM users WHERE `username` = '" .$username. "'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		//$ids = $data[0]->workorderids;
		echo json_encode($data[0]);
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	
}

function addWorkOrders() {
	error_log('addWorkOrders\n', 3, 'workorderserrors.log');
	$request = Slim::getInstance()->request();
	$userdata = json_decode($request->getBody());
	$orderinfo = "X" . $userdata->ordernumber;
	$api = $userdata->api;
	$orderlocation = $userdata->orderlocation;
	$ordertitle = $userdata->ordertitle;
	$sql = "select username FROM users WHERE `apikey` = '" . $api . "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$username = $data[0]->username;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$sql = 
	"CREATE TABLE " . $orderinfo . " 
	(event INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	eventtype VARCHAR(40) NOT NULL, 
	eventdata VARCHAR(40) NOT NULL,
	user VARCHAR(40) NOT NULL, 
	timestamp VARCHAR(40) NOT NULL);
	
	INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	(:eventtype, :eventdata, :user, :timestamp);
	
	INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	('jobsite', '" . $orderlocation . "', :user, :timestamp);

	INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	('title', '" . $ordertitle . "', :user, :timestamp);"
		;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$type = "creation";
		$data = "initial";
		date_default_timezone_set("America/New_York");
		$timestamp = timeConvert(time());
		$stmt->bindParam("eventtype", $type);
		$stmt->bindParam("eventdata", $data);
		$stmt->bindParam("user", $username);
		$stmt->bindParam("timestamp", $timestamp);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'workorderserrors.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}		
	$sql = "select workorderids FROM users WHERE `username` = '" .$username. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$ids = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$existingids = $ids[0]->workorderids;
		$newids = "";
		if ($existingids == null) {
			$newids = $orderinfo; }
		else {
		$newids = $existingids . ", " . $orderinfo;
		}
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		$sql = 'UPDATE users SET workorderids="'.$newids.'" WHERE username="'.$username.'"';
		try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$db = null;
			echo json_encode($userdata);
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addEvent($id) {
	error_log('addEvent\n', 3, 'addeventlog.log');
	$request = Slim::getInstance()->request();
	$userdata = json_decode($request->getBody());
	$sql = "INSERT INTO " . $id . " (eventtype, eventdata, user, timestamp) VALUES (:eventtype, :eventdata, :user, :timestamp)";
	date_default_timezone_set("America/New_York");
	$timestamp = timeConvert(time());
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("eventtype", $userdata->eventtype);
		$stmt->bindParam("eventdata", $userdata->eventdata);
		$stmt->bindParam("user", $userdata->user);
		$stmt->bindParam("timestamp", $timestamp);
		$stmt->execute();
		$db = null;
		echo json_encode($userdata); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'addeventlog.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

?>
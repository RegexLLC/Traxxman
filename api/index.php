<?php

require 'Slim/Slim.php';
$app = new Slim();

$app->get('/username/:apikey',	'getUsername');

$app->get('/fullname/:apikey',	'getfullName');

$app->get('/idfromapi/:api',	'getIDFromAPI');


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

$app->post('/events/:id', 'addEvent');

$app->get('/tools/phytogeo/:phy', 'phyToGeo');

$app->get('/tools/timeconvert/:time', 'timeConvert');

$app->run();

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
		$to = '[{"fullname":"' . $users[0]->username . '"}]';
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
	return gmdate("m-d-Y H:i:s", $time);
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

function addWorkOrders() {
	error_log('addWorkOrders\n', 3, 'workorderserrors.log');
	$request = Slim::getInstance()->request();
	$userdata = json_decode($request->getBody());
	$sql = 
	"CREATE TABLE " . $userdata->ordernumber . " 
	(event INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	eventtype VARCHAR(40) NOT NULL, 
	eventdata VARCHAR(40) NOT NULL,
	user VARCHAR(40) NOT NULL, 
	timestamp VARCHAR(40) NOT NULL);
	
	INSERT INTO " . $userdata->ordernumber . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	(:eventtype, :eventdata, :user, :timestamp);";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$type = "creation";
		$data = "initial";
		$timestamp = time();
		$stmt->bindParam("eventtype", $type);
		$stmt->bindParam("eventdata", $data);
		$stmt->bindParam("user", $userdata->user);
		$stmt->bindParam("timestamp", $timestamp);
		$stmt->execute();
		$db = null;
		echo json_encode($userdata); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'workorderserrors.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addEvent($id) {
	error_log('addEvent\n', 3, 'addeventlog.log');
	$request = Slim::getInstance()->request();
	$userdata = json_decode($request->getBody());
	$sql = "INSERT INTO " . $id . " (eventtype, eventdata, user, timestamp) VALUES (:eventtype, :eventdata, :user, :timestamp)";
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


function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="";
	$dbname="traxxman";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
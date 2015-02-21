<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/profile/:id', 'getProfile');

$app->get('/sendmessage/:apikey/:number/:message', 'SendText');

$app->get('/makecall/:apikey/:number', 'MakeCall');

$app->get('/myaccount/:apikey', 'myAccount');

$app->get('/username/:apikey',	'getUsername');

$app->get('/avatar/:id/:api',	'getAvatar');

$app->get('/avatarbyID/:id/:api',	'getAvatarbyID');
	
$app->get('/fullname/:apikey',	'getfullName');

$app->get('/idfromapi/:api',	'getIDFromAPI');

$app->get('/inbox/lastten/:apikey', 'getLastTen');

$app->get('/inbox/nextten/:apikey', 'getNextTen');

$app->get('/inbox/:id/:apikey', 'getMessageData');

$app->get('/inboxdl/:id/:apikey', 'deleteMessage');

$app->get('/locations/:workorder/:username/:apikey', 'pullLocations');

$app->get('/messagescount/:apikey',	'messagesCount');

$app->get('/markasread/:toid',	'markAsRead');

$app->get('/mylocation/:location/:apikey',	'myLocation');

$app->post('/inbox', 'sendMessage');

$app->get('/workorders/:apikey', 'getWorkorders');

$app->get('/workorders/notes/:id/:apikey', 'getNotes');

$app->get('/addemployeetoWO/:userid/:ordernumber/:apikey', 'addEmployeeToWO');

$app->get('/workorders/:id/:apikey', 'getWorkOrderDetails');

$app->get('/workorders/:id/:events/:apikey', 'getWorkOrderEvents');

$app->get('/workorderauthor/:id/:apikey', 'getWorkOrderAuthor');

$app->get('/workorderaddress/:id/:apikey', 'getWorkOrderLocation');

$app->get('/workordertitle/:id/:apikey', 'getWorkOrderTitle');

$app->get('/workorderlistinfo/:id/:apikey', 'getWorkOrderList');

$app->get('/workordercount/:apikey', 'workOrderCount');

$app->post('/workorders', 'addWorkorders');

$app->get('/employees/:apikey', 'getEmployees');

$app->get('/employeeinfo/:id', 'getEmployeeInfoList');

$app->get('/employeefullname/:id', 'getEmployeeFullname');

$app->get('/tools/phytogeo/:phy', 'phyToGeo');

$app->get('/tools/apicheck/:apikey', 'apiCheck');

$app->get('/tools/timeconvert/:time', 'timeConvert');

$app->get('/tools/calcdistance/:origin/:destination', 'calcdistance');

$app->get('/tools/createmap/:location/:wonumber', 'createMap');

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

	function getProfile($id) {
	$sql = "select mobile, email, company, timezone, avatarurl, fullname, activeworkorder, lastseen FROM users WHERE `id` = " .$id;
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

	function myAccount($apikey) {
	$sql = 'select mobile, email, timezone, company, employees, usedemployees, avatarurl, fullname, activeworkorder, lastseen FROM users WHERE `apikey` = "' .$apikey. '"';
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
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



function getAvatar($id, $api) {
	$sql = "select avatarurl FROM users WHERE `username` = '" .$id. "' LIMIT 1";
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

function getAvatarbyID($id, $api) {
	$sql = "select avatarurl FROM users WHERE `id` = " .$id. " LIMIT 1";
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
	$sql = "select * FROM " .$id. " LIMIT 10";
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

function getNotes($id, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "select * FROM " .$id. " WHERE eventtype = 'note'";
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


function apiCheck($apikey) {
	$sql = "select id FROM users WHERE apikey='".$apikey."'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		if ($users == null) {
		echo json_encode("not valid"); }
		else {
		echo json_encode("valid"); }
	}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; }
	
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

function pullLocations($workorder, $username, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "SELECT * FROM ".$workorder." WHERE `eventtype`='location' AND `user` = '".$username."' LIMIT 1500";
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
	function getMessageData($id, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "SELECT * FROM inbox WHERE id = '".$id."'";
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

	function deleteMessage($id, $apikey) {
	//check perms	
	$sql = "delete from inbox where id=".$id." limit 1";
		try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$db = null;
		}
	 catch(PDOException $e) {
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

function getWorkOrderListInfo($id, $apikey) {
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


function getWorkOrderList($id, $apikey) {
	//check that the "work order" ($id) is in usertable column allowed work orders
	$sql = "SELECT eventdata FROM ".$id." WHERE eventtype = 'title'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$title = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		$sql = "SELECT eventdata FROM ".$id." WHERE eventtype = 'jobsite'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$jobsite = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($title);
		echo json_encode($jobsite);
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
		echo '{"'.$events.'": ' . json_encode($users) . '}';
		} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function sendMessage() {
	error_log('sendMessage\n', 3, 'inbox.log');
	$request = Slim::getInstance()->request();
	$msgdata = json_decode($request->getBody());
	$timestamp = time();
	$apikey = $msgdata->api;
	$to = $msgdata->to;
	$toid = $msgdata->to;
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
	$sql = "select unreadmessages FROM users WHERE `id` = '" .$toid. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$msgs = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	
	$newcount = $msgs[0]->unreadmessages;
	
	$newcount += 1;
	
$sql = 'UPDATE users SET unreadmessages='. $newcount . ' WHERE id=' . $toid;
		try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$db = null;
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
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

function myLocation($location, $apikey) {
	$coords = explode("x", $location);
	$location = $coords[0] . "," . $coords[1];
	$sql = 'UPDATE users SET lastseen="'. $location . '" WHERE apikey="' . $apikey . '"';
		try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$db = null;
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function markAsRead($apikey) {
	$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$username = $users[0]->username;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$newcount = 0;
$sql = 'UPDATE users SET unreadmessages='. $newcount . ' WHERE username="' . $username . '"';
		try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$db = null;
		echo ($newcount);
		}
		catch(PDOException $e) {
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
	$sql = "select workorderids FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wocount = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$counting_array = explode(", ", $wocount[0]->workorderids);
		$result = count($counting_array);
		echo('[{"workordercount":"' . $result . '"}]');
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

function getEmployeeInfoList($id) {
	// add api key as an argument and check that $id is in users employeeids
	$sql = "select fullname, avatarurl, lastseen FROM users WHERE `id` = '" .$id. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$info = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($info);
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	
}

function getEmployeeFullname($id) {
	// add api key as an argument and check that $id is in users employeeids
	$sql = "select fullname from users WHERE `id` = '" .$id. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$info = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($info);
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	
}

function getEmployeeInfo($id, $apikey) {
	// add api key as an argument and check that $id is in users employeeids
	$sql = "select username, fullname, email, company, timezone, employees,  usedemployees, activeworkorder, lastseen FROM users WHERE `id` = '" .$id. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$info = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		var_dump($info);
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	
}

function addEmployeeToWO($userid, $ordernumber, $apikey) {
	//check for permissions
	$sql = "select workorderids FROM users WHERE `id` = '" .$userid. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$ids = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		$existingids = $ids[0]->workorderids;
		$newids = "";
		echo json_encode('Success');
		if ($existingids == null) {
			$newids = $ordernumber; }
		else {
		$newids = $existingids . ", " . $ordernumber;
		}
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		$sql = 'UPDATE users SET workorderids="'.$newids.'" WHERE id="'.$userid.'"';
		try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$db = null;
		echo json_encode('Success');
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		$sql = "select username FROM users WHERE `id` = '" .$userid. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$ids = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode('Success');
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$username = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode('Success');
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	$type = "employee";
$sql = "INSERT INTO " . $ordernumber . " (eventtype, eventdata, user, timestamp) VALUES (:eventtype, :eventdata, :user, :timestamp)";
		$timestamp = time();
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("eventtype", $type);
		$stmt->bindParam("eventdata", $ids[0]->username);
		$stmt->bindParam("user", $username[0]->username);
		$stmt->bindParam("timestamp", $timestamp);
		$stmt->execute();
		$db = null;
		echo json_encode('Success');
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'addeventlog.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addWorkOrders() {
	error_log('addWorkOrders\n', 3, 'workorderserrors.log');
	$request = Slim::getInstance()->request();
	$userdata = json_decode($request->getBody());
	$orderinfo = "x" . $userdata->ordernumber;
	$api = $userdata->api;
	$orderlocation = $userdata->orderlocation;
	$ordertitle = $userdata->ordertitle;
	$jobstart = $userdata->jobstart;
	$jobend = $userdata->jobend;
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
	$address = str_replace(" ", "+", $orderlocation);
	$url = "http://maps.google.com/maps/api/geocode/json?sensor=false&address=$address";
	$response = file_get_contents($url);
	$json = json_decode($response, TRUE);
	$ordercoords = ($json['results'][0]['geometry']['location']['lat'] . "," . $json['results'][0]['geometry']['location']['lng']);
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
	('title', '" . $ordertitle . "', :user, :timestamp);
	
		INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	('jobcoords', '" . $ordercoords . "', :user, :timestamp);
	
	INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	('jobstart', '" . $jobstart . "', :user, :timestamp);
	
	INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	('jobend', '" . $jobend . "', :user, :timestamp);
	
	INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	('detail', 'Work Order Created', :user, :timestamp);
	
	INSERT INTO " . $orderinfo . " 
	(eventtype, eventdata, user, timestamp) 
	VALUES 
	('employee', :user, 'owner', :timestamp);"
		;
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$type = "creation";
		$data = "initial";
		$timestamp = time();
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
		echo json_encode('Success');
		}
		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addEvent($id, $apikey) {
	
$sql = "select username FROM users WHERE `apikey` = '" .$apikey. "' LIMIT 1";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	error_log('addEvent\n', 3, 'addeventlog.log');
	$request = Slim::getInstance()->request();
	$userdata = json_decode($request->getBody());
	$sql = "INSERT INTO " . $id . " (eventtype, eventdata, user, timestamp) VALUES (:eventtype, :eventdata, :user, :timestamp)";
	$timestamp = time();
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("eventtype", $userdata->eventtype);
		$stmt->bindParam("eventdata", $userdata->eventdata);
		$stmt->bindParam("user", $users[0]->username);
		$stmt->bindParam("timestamp", $timestamp);
		$stmt->execute();
		$db = null;
		echo json_encode('Success');
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'addeventlog.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
function SendText($apikey, $number, $message) {
    
    //check $apikey against database to see if they are legit

require('Services/Twilio.php');

$sid = "ACa1a1399c9738edbf45b54eef30d7ed37"; // Your Account SID from www.twilio.com/user/account
$token = "35791bfc6073ada9d6a69f4da0fb6ceb"; // Your Auth Token from www.twilio.com/user/account

$client = new Services_Twilio($sid, $token);
$message = $client->account->messages->sendMessage(
  '2512343045', // From a valid Twilio number
  $number, // Text this number
  $message
);

print $message->sid;
}

function MakeCall($apikey, $number) {
require('Services/Twilio.php');

$sid = "ACa1a1399c9738edbf45b54eef30d7ed37";
$token = "35791bfc6073ada9d6a69f4da0fb6ceb";

$client = new Services_Twilio($sid, $token);
$call = $client->account->calls->create(
  '2512343045',
  $number,

  'http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient'
);

}

function calcdistance($origin, $destination) {
$url = 'http://maps.googleapis.com/maps/api/distancematrix/json?origins=' . $origin. '&destinations=' . $destination . '&mode=driving&language=en,EN';
$result = file_get_contents($url);
echo $result;
	
	
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

function createMap($location, $wonumber) {
	$path = '../app/images/workorders/' . $wonumber . '.jpg';
	if (file_exists($path)) {
		echo json_encode($path);
	} else {
	$address = str_replace(" ", "+", $location);
	$url = "https://maps-api-ssl.google.com/maps/api/geocode/json?sensor=false&address=$address";
	$response = file_get_contents($url);
	$json = json_decode($response, TRUE);
	$lat = $json['results'][0]['geometry']['location']['lat'];
	$lng = $json['results'][0]['geometry']['location']['lng'];
$MapLat    = $lat;
$MapLng    = $lng;
$MapRadius = 1;
//$MapRadius = .6214;
$MapFill   = 'E85F0E';    // fill of circle
$MapBorder = '91A93A';    // border of circle
$MapWidth  = 150;
$MapHeight = 150;
$EncString = GMapCircle($MapLat,$MapLng, $MapRadius);
$MapAPI = 'https://maps.googleapis.com/maps/api/staticmap?';
$MapURL = $MapAPI.'center='.$MapLat.','.$MapLng.'&size='.$MapWidth.'x'.$MapHeight.'&maptype=roadmap&path=fillcolor:0x'.$MapFill.'33%7Ccolor:0x'.$MapBorder.'00%7Cenc:'.$EncString.'&zoom=11&sensor=true&markers=color:red%7C'.$address;
$contents=file_get_contents($MapURL);
file_put_contents($path,$contents);
echo json_encode($path);
	}
}
?>
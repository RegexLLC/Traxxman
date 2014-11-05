<?php

function getConnection() {
	$dbhost = 'localhost';
    $dbuser = 'root';
    $dbpass = '123456';
    $dbname = 'traxxman';
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function getWorkOrders() {
	$sql = "show tables";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$tablesdata = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
	}		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	
	$workorders = array();
	for($i = 0, $l = count($tablesdata); $i < $l; ++$i) {
		array_push($workorders, $tablesdata[$i]->Tables_in_traxxman);
	}
	$workorderslist = array();
	$workorderslist = preg_grep("/^x/", $workorders);
	
	$workordersjustx = array();
	array_push($workordersjustx, $workorderslist);
	$workordersarray = array_values($workordersjustx[0]);
	
	for($i = 0, $l = count($workordersarray); $i < $l; ++$i) {
		
		$currentorder = $workordersarray[$i];
		$sql = "SELECT * FROM " . $currentorder . " WHERE eventtype='jobstart'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$startdata = $stmt->fetchAll(PDO::FETCH_OBJ);
		$jobstart = $startdata[0]->eventdata;
		$db = null;
	}		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		
		$sql = "SELECT * FROM " . $currentorder . " WHERE eventtype='jobend'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$enddata = $stmt->fetchAll(PDO::FETCH_OBJ);
		$jobend = $enddata[0]->eventdata;
		$db = null;
	}		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		
$currentTime = time();

if ($currentTime > $jobstart && $currentTime < $jobend ) {
    $sql = "SELECT * FROM " . $currentorder . " WHERE eventtype='employee'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
	}		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	} 
	
	for($i = 0, $l = count($employees); $i < $l; ++$i) {
	$workorderemployee = $employees[$i]->eventdata;
		    $sql = "SELECT lastseen FROM users WHERE username='" .$workorderemployee. "'";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$lastseens = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
	}		catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		$personallastseen = $lastseens[0]->lastseen;
		
	$sql = "INSERT INTO " . $currentorder . " (eventtype, eventdata, user, timestamp) VALUES (:eventtype, :eventdata, :user, :timestamp)";
	$eventtype = "location";
	$eventdata = $personallastseen;
	$user = $workorderemployee;
	$timestamp = time();
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("eventtype", $eventtype);
		$stmt->bindParam("eventdata", $eventdata);
		$stmt->bindParam("user", $user);
		$stmt->bindParam("timestamp", $timestamp);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, 'addeventlog.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
		
		
	}
	
	} 
	} 
	}

	
getWorkOrders();
?>
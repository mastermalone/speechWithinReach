<?php
    
	if($_POST){
		$speechEmail = "nikkib7@gmail.com";
		//$speechEmail = "asst@speechwithinreachla.com";
		$subjectLine ="Speech Within Reach Referral";
		
		//Make sure the request is an AJAX call
		if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest'){
			$outputError = json_encode(array(
				'type' => 'error',
				'text' => 'Request must be an AJAX call'
			));
			die($outputError);
		}
	}
	
	//Serverside validation.  The client side that I wrote means that this will likely never be called.
	//But it is better to be safe anyway
	if(!isset($_POST["firstName"]) || !isset($_POST["lastName"]) || !isset($_POST["userEmail"]) || !isset($_POST["userPhone"]) || !isset($_POST["prefDate"])){
		$outputError = json_encode(array(
			'type' => 'error',
			'text' => 'All required fields must be completed'
		));
		die($outputError);
	}
	
	//Assign the javascript variables from the AJAX post to PHP vaiables and sanitize them
	$firstame = filter_var($_POST["firstName"], FILTER_SANITIZE_STRING);
	$lastName = filter_var($_POST["lastName"], FILTER_SANITIZE_STRING);
	$userEmail = filter_var($_POST["userEmail"], FILTER_SANITIZE_STRING);
	$userPhone = filter_var($_POST["userPhone"], FILTER_SANITIZE_STRING);
	$prefDate = filter_var($_POST["prefDate"], FILTER_SANITIZE_STRING);
	$bestTime = filter_var($_POST["bestTime"], FILTER_SANITIZE_STRING);
	$userComment = filter_var($_POST["userComment"], FILTER_SANITIZE_STRING);
	
	//More server side validation for the user entered data
	if(strlen($firstame) < 2){
		$outputError = json_encode(array("type"=>"error", "text"=>"The Name field is too short!"));
		die($outputError);
	}
	if(strlen($lastName) < 2){
		$outputError = json_encode(array("type"=>"error", "text"=>"The Name field is too short!"));
		die($outputError);
	}
	if(!filter_var($userEmail, FILTER_VALIDATE_EMAIL)){
		$outputError = json_encode(array("type"=>"error", "text"=>"Please enter a valid e-mail address"));
		die($outputError);
	}
	if(!is_numeric($userPhone)){
		$outputError = json_encode(array("type"=>"error", "text"=>"Please enter only numbers in the phoe number field, no special characters."));
		die($outputError);
	}
	
	$headers = 'From: '.$userEmail. '' . "\r\n" . 'Reply to: '.$userEmail. '' . "\r\n";
	$sendMail = @mail($speechEmail, $subjectLine, 'Referral Contact: '. '' ."\r\n" .$firstame .' '.$lastName. '' ."\r\n" . 'Contact E-mail: ' .$userEmail. '' ."\r\n" . 'Contact Phone: ' .$userPhone. '' ."\r\n" . 'Preferred Contact Date: '.$prefDate. '' ."\r\n" . 'Preferred Time of Day: ' .$bestTime. '' ."\r\n\r\n" .$userComment, $headers);
	
	if(!$sendMail){
		$outputError = json_encode(array("type"=>"error", "text"=>"The message was not sent!"));
		die($outputError);
	}else{
		$outputError = json_encode(array('type'=>'message', 'text' => 'Hi '.$firstame .'! Thank you for contacting us! A representative from Speech Within Reach will contact you shortly.'));
        die($outputError);
	}
	
?>
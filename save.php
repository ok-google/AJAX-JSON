<?php

	if (function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) {
    function strip_slashes($input) {
        if (!is_array($input)) {
            return stripslashes($input);
        }
        else {
            return array_map('strip_slashes', $input);
        }
    }
    $_GET = strip_slashes($_GET);
    $_POST = strip_slashes($_POST);
    $_COOKIE = strip_slashes($_COOKIE);
    $_REQUEST = strip_slashes($_REQUEST);
	}

	function customError($errno, $errstr) {
	    echo "<b>Error:</b> [$errno] $errstr<br>";
	    echo "Ending Script";
	    die("Ending Script");
	}
	set_error_handler("customError");

	//Mengambil data yang sudah dikirim dengan method get
	$myData = $_GET["data"];

	//file json yang akan diisi file baru
	$myFile = "data.json";
	//buka file json
	$fileHandle = fopen($myFile, "w");

	//tulis data ke dalam file json
	if(fwrite($fileHandle, $myData))
		echo "sukses";
	//tutup file json
	fclose($fileHandle);
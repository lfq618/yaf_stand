<?php
define('APPLICATION_PATH', realpath(dirname(__FILE__).'/../'));
defined('YAF_ENVIRON') || define('YAF_ENVIRON', 'develop');


if (! extension_loaded("yaf"))
{
	include APPLICATION_PATH . '/framework/loader.php';
}

$application = new Yaf_Application( APPLICATION_PATH . "/conf/application.ini");

$application->bootstrap()->run();
?>

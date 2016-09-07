<?php
class IndexController extends Yaf_Controller_Abstract
{
    const CONTROL_COOK      = 4;   //是否烹饪标识位
    const CONTROL_GARNISH   = 2;   //是否配菜标识位
    const CONTROL_RECOMMEND = 1;   //是否推荐标识位
    
	public function indexAction() {
	  
        echo phpinfo();	   
	   
	}
	
	public function taskAction() {
	    echo "this is a task!";
	    
	    $taskAry = array(
	        'id'   => 1,
	        'name' => 'fuqiang',
	    );
	    
	    $ret = Task::addTask("Test", json_encode($taskAry));
	    var_dump($ret);
	}
	
	public function mongoAction() {
	    $mongo = new MongoDB\Client('mongodb://localhost:27107');

	    $databases = $mongo->listDatabases();
	    var_dump($databases);
	}
	
	public function mongo2Action() {
	    $className = 'MongoClient';
	    $class2Name = 'Mongo';
	    
	    if (! class_exists($className)) {
	        echo "MongoClient 不存在";
	    }
	    
	    if (! class_exists($class2Name)) {
	        echo 'Mongo不存在';
	    }
	}
}
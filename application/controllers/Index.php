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
	    $manager = new MongoDB\Driver\Manager('mongodb://127.0.0.1:27017');
	    
	    var_dump($manager);
	    echo "<hr />";
	    
	    $collection = (new MongoDB\Client)->demo-zips;
	    $document = $collection->findOne(["_id" => 123]);
	    var_dump($document);
	    
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
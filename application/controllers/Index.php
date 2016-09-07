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
	    $manager = new MongoDB\Driver\Manager('mongodb://localhost:27017/foodtoon1');
	    $command = new MongoDB\Driver\Command(['ping' => 1]);
	    
	    try {
	        $cursor = $manager->executeCommand('foodtoon', $command);
	    } catch (MongoDB\Driver\Exception $e) {
	        echo $e->getMessage();
	        exit;
	    }
	    
	    $response = $cursor->toArray()[0];
	    
	    var_dump($response);
	    
	    echo "<hr />";
	    
	    $bulk = new MongoDB\Driver\BulkWrite;
	    $bulk->insert(['_id' => 3, 'name' => 'liboran', 'age' => 2]);
	    $bulk->insert(['_id' => 4, 'name' => 'chenlong', 'age' => 30]);
	    
	    $ret = $manager->executeBulkWrite('db.foodtoon', $bulk);
	    var_dump($ret);
	    
	    
	    
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
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
	    $conn = new Mongo('mongodb:/127.0.0.1:27017');
	    
	    print_r($conn->listDBs());
	    
	}
}
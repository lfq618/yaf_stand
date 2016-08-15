<?php
class IndexController extends Yaf_Controller_Abstract
{
    const CONTROL_COOK      = 4;   //是否烹饪标识位
    const CONTROL_GARNISH   = 2;   //是否配菜标识位
    const CONTROL_RECOMMEND = 1;   //是否推荐标识位
    
	public function indexAction() {
	   $num = intval($this->getRequest()->getQuery('num'));
	   
	   if ($num & self::CONTROL_COOK) {
	       echo "需要烹饪";
	   } else {
	       echo "不需要烹饪";
	   }
	   echo "<br />";
	   if ($num & self::CONTROL_GARNISH) {
	       echo "需要配菜";
	   } else {
	       echo "不需要配菜";
	   }
	   echo "<br />";
	   if ($num & self::CONTROL_RECOMMEND) {
	       echo "推荐";
	   } else {
	       echo "不推荐";
	   } 
	   
	   echo "你更新了";
	   
	   
	   
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
}
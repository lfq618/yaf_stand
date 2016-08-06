<?php
class IndexController extends Yaf_Controller_Abstract
{
	public function indexAction() {
		$obj = new Task_RedisStore('main');
		
		$ret = $obj->addTask('IMNOTICE', 'aaaaaa');
		var_dump($ret);
	}
}
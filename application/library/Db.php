<?php
/**
 * 数据库连接类
 * @author dell
 *
 */
class Db {
	
	protected $autoFree = false;
	
	//数据库连接池， 支持多个连接
	protected $linkID = array();
	
	//当前链接ID
	protected $_linkID = null;
	
	//错误信息
	protected $error   = '';
	
	//事物指令数
	protected $transTimes = 0;
	
	public static function getInstance( $dbString ) {		
		static $_instance = array();
		
		//根据数据库链接字产生唯一guid
		$guid = Fn::to_guid_string($dbString);
		
		if (! isset($_instance[$guid])) {
			$obj = new Db();
			$_instance[$guid] = $obj->factory($dbString);
		}
		
		return $_instance[$guid];
	}
	
	public function factory( $dbString ) {
		
		//获取数据库配置
		$dbConfig = Yaf_Registry::get('')
	}
}

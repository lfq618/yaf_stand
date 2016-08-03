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
		
	//当前sql指令
	protected $queryStr = '';
	
	//事物指令数
	protected $transTimes = 0;
	
	protected $config = null;  //数据库链接配置
	
	//参数绑定
	protected $bind   = array();  
	
	public static function getInstance( $dbString ) {		
		static $_instance = array();
		
		//根据数据库链接字产生唯一guid
// 		$guid = Fn::to_guid_string($dbString);
		
		if (! isset($_instance[$dbString])) {
			$obj = new Db();
			$_instance[$dbString] = $obj->factory($dbString);
		}
		
		return $_instance[$dbString];
	}
	
	/**
	 * 实例化数据库驱动
	 * @param string $dbString 数据库链接字
	 * @return Db
	 */
	public function factory( $dbString ) {
		
		//获取数据库配置
		$dbConfig = Yaf_Registry::get('dbConfig');
		if (! isset($dbConfig[$dbString])) {
		    Db::Error("[{$dbString}], 没有数据库配置");
		}
		
		$dbConfig = $dbConfig[$dbString];
		
		if (empty($dbConfig['driver'])) {
		    Db::Error("[{$dbString}], 配置没有数据库驱动类型");
		}
		
		$driver = ucfirst($dbConfig['driver']);
		$class  = 'Db_' . $driver;
		
		//检查驱动
		if (! class_exists($class)) {
		    Db::Error("[{$dbString}], 数据库驱动类不存在");
		}
		
		$db = new $class($dbConfig);
		
		return $db;		
	}
		
	/**
	 * 链接数据库， 支持一主多从
	 * @param string $master
	 */
	public function initConnect( $master = true ) {	    
	    if ($master) {
	        //链接主数据库
	        $dbConfig = $this->config['master'];
	        $this->_linkID = $this->connect($dbConfig, 'master');
	    } else {
	        $dbConfig = $this->config['slave'];
	        $r = floor(mt_rand(0, count($dbConfig)-1));
	        $this->_linkID = $this->connect($dbConfig[$r], $r);
	    }	
	    return true;
	}
	
	/**
	 * 添加数据
	 * @param string $tableName  数据表名
	 * @param array $data  要插入的数据： 数组形式
	 * @param boolean $replace 是否采用replace模式插入，默认为false
	 * @return number|boolean 返回受影响的行数
	 */
	public function insert( $tableName , $data, $replace = false, $getInsertId = false ) {
	    $fields = $values = array();
	    $bind   = array();
	    foreach ($data as $key => $val) {
	        $fields[] = $key;
	        
	        if (0 !== strpos($val, ':')) {
	            $name      = ':'.$key;
	            $values[]  = $name;
	            $bind[$name] = $val;
	        } else {
	            $values[] = $val;
	        }
	        
	    }
	    
	    $sql  = ($replace ? 'REPLACE' : 'INSERT') . ' INTO ' . $tableName . ' ('.implode(',', $fields).') VALUES ('. implode(',', $values) .')';
	    return $this->execute($sql, $bind, $getInsertId);
	}
	
	/**
	 * 按照sql语句插入数据
	 * @param string $sql
	 */
	public function insertBySql( $sql, $getInsertId = false ) {
	    return $this->execute($sql, array(), $getInsertId);
	}
	
	/**
	 * 更新操作
	 * @param unknown $data
	 * @param unknown $where
	 * @param unknown $tableName
	 */
	public function update( $tableName, $data, $where ) {
	    if (! $where) {
	        Db::Error("更新语句缺少where条件");
	    }
	    
	    $fields = array();
	    $bind   = array();
	    foreach ($data as $key => $val) {
	        $name = ':'.$key;
	        $fields[] = $key.'='.$name;
	        $bind[$name] = $val;
	    }
	    
	    $sql = "UPDATE `{$tableName}` SET " . join(',', $fields) . ' WHERE ' . $where;
	    return $this->execute($sql, $bind);
	}
	
	/**
	 * 按照sql语句更新
	 * @param unknown $sql
	 */
	public function updateBySql( $sql ) {
	    if (false === stripos($sql, 'where')) {
	        Db::Error("更新语句缺少where条件");
	    }
	    
	    return $this->execute($sql, array());
	}
	
	/**
	 * 删除
	 * @param unknown $table
	 * @param unknown $where
	 */
	public function delete( $tableName, $where ) {
	    if (! $where) {
	        Db::Error("删除语句缺少where语句");
	    }
	    
	    $sql = "DELETE FROM `{$tableName}` WHERE {$where}";
	    return $this->execute($sql, array());
	}
	
	public function selectOne( $tableName, $where, $selectFileds = array(), $order = null ) {
	    $fields = '*';
	    if (! empty($selectFileds)) {
	        $fields = implode(',', $selectFileds);
	    }
	     
	    $sql = "SELECT {$fields} FROM `{$tableName}` WHERE {$where}";
	    if ($order) {
	        $sql .= " ORDER BY {$order}";
	    }
	     
	    return $this->queryOne($sql);
	}
	
	/**
	 * 组合查询
	 * @param unknown $tableName
	 * @param unknown $where
	 * @param unknown $selectFields
	 * @param string $order
	 * @param string $limit
	 */
	public function selectAll( $tableName, $where, $selectFields = array(), $order = null, $limit = null ) {
	    $fields = '*';
	    if (! empty($selectFields)) {
	        $fields = implode(',', $selectFields);
	    }
	    
	    $sql = "SELECT {$fields} FROM `{$tableName}` WHERE {$where}";
	    if ($order) {
	        $sql .= " ORDER BY {$order}";
	    }
	    if ($limit) {
	        $sql .= " LIMIT {$limit}";
	    }
	    
	    return $this->query($sql);
	}
	
	/**
	 * 按照sql语句查询
	 * @param unknown $sql
	 */
	public function setlectBySql( $sql ) {
	    return $this->query($sql);
	}
	
	/**
	 * 绑定参数
	 * @param unknown $name
	 * @param unknown $val
	 */
	protected function bindParam( $name, $val ) {
	    $this->bind[$name] = $val;
	}
	
	
	
	
	/**
	 * 数据库统一错误
	 * @param unknown $msg
	 * @param number $code
	 * @throws Exception
	 */
	protected static function Error( $msg, $code = 0 ) {
	    Fn::writeLog($msg);
	    throw new Exception($msg, $code);
	}
}

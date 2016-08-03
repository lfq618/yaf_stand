<?php
/**
 * Mongo数据库驱动
 * @author lifuqiang
 * 
 */
class Db_Mongo extends Db {
    
    protected $_mongo           = null;  //mongo数据库对象
    protected $_collection      = null;  //mongo数据表对象
    protected $_dbName          = '';    //dbName
    protected $_collectionName  = '';    //collectionName
    
    /**
     * Db_Mongo构造函数
     * @param unknown $config
     */
    public function __construct( $config = array() ) {
       if (! class_exists('MongoClient')) {
           Db::Error('MongoClient扩展类库不存在');
       }
       
       if (! empty($config)) {
           $this->config = $config;
           if (empty($this->config['options'])) {
               $this->config['options'] = array();
           }
       }       
    }
    
    public function connect( $config = array(), $linkNum = 0 ) {
        if (! isset($this->linkID[$linkNum])) {
            if (empty($config)) {
                Db::Error('Mongo 配置文件不存在');
            }
            
            $host = 'mongodb://'.($config['username']?"{$config['username']}":'').($config['password']?":{$config['password']}@":'').$config['hostname'].($config['port']?":{$config['port']}":'').'/'.($config['dbname']?"{$config['dbname']}":'');
            
            try {
                $this->linkID[$linkNum] = new MongoClient( $host, $config['options'] );
            } catch (MongoConnectionException $e) {
                Db::Error($e->getMessage());
            }
        }
        
        return $this->linkID[$linkNum];        
    }
    
    
}
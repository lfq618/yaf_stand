<?php 
 /**
 * Redis  封装类
 * @description Redis 操作类
 * @author zhaowei
 * @version 2016-05-24
 */
class RedisClient{

    /*单例容器*/
    private static $_instance;

    /**
     * (单例模式)
     * @return object
     */
    public static function instance( $redisString ) {
        if(!(self::$_instance instanceof self)){
            try{
                self::$_instance = new redis();
                self::$_instance->connect('172.28.18.167', 6379);
            }catch(RedisException $e){
                Fn::writeLog($e->getMessage()); 
            }
        }
        return self::$_instance;
    }
    
    /**
     * 防止new
     */
    private function __clone() {}
    
    /**
     * 禁止初始化
     */
    private function __construct() {}  
} 

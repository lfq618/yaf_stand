<?php
/**
 * 公用函数类
 * @description 包含所有非业务相关的所有公共函数
 * @author zhaowei
 * @version 2016-05-24
 */
class Fn {
    /*
     * 根据传入参数获取pdo数据类型
     *
     * @param string $val 传入值
     * @return string 
     */
	public static function select_datatype( $val ) {
	    
		if ( is_string( $val ) )  return PDO::PARAM_STR;
		if ( is_int( $val ) )     return PDO::PARAM_INT;
		if ( is_null( $val ) )    return PDO::PARAM_NULL;
        if ( is_bool( $val ) )    return PDO::PARAM_BOOL;
        return PDO::PARAM_STR;
	}
    
    
    /*
     * 显示调试信息
     *
     * @param string $str 传入值 
     */
    public static function writeLog( $str , $fileName = '' ) {
        if (! $fileName) {
            $fileName =  '/logs/error.log';
        } 
        
//         $fileName = APP_PATH . $fileName;
        
        file_put_contents( $fileName, $str . "\n", FILE_APPEND );        
    }
    
    /**
     * 通过CURL库进POST数据提交
     *
     * @param string $postUrl  url address
     * @param array $data  post data
     * @param int $timeout connect time out
     * @param bool $debug 打开 header 数据
     * @return string
     */
    public static function curlPost( $postUrl, $data = '', $timeout = 30, $header = [], $debug = false ) {
        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, $postUrl );
        curl_setopt( $ch, CURLOPT_POST, true );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch, CURLOPT_HEADER, $debug );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, $header );
        curl_setopt( $ch, CURLINFO_HEADER_OUT, $debug );
        curl_setopt( $ch, CURLOPT_TIMEOUT, $timeout );
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $data );

        $result = curl_exec( $ch );
        $info   = curl_getinfo( $ch );   //用于调试信息
        curl_close( $ch );

        if ( $result === false ) {
            self::writeLog( json_encode( $info ) );
            return false;
        }
        return trim( $result );
    }

    /**
     * 获取url返回值，curl方法
     */
    public static function curlGet( $url, $timeout = 1 ) {
        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, $url );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
        
        $ret  = curl_exec( $ch );
        $info = curl_getinfo($ch);   //用于调试信息
        curl_close($ch);
        
        if ( $ret === false ) {
            self::writeLog( json_encode( $info ) );
            return false;
        }
        return trim( $ret );
    }
  
    /**
     * 二维数组按指定的键值排序
     */
    public static function array_sort( $array, $keys, $type='asc' ) {
        if( !isset( $array ) || !is_array( $array ) || empty( $array ) ) return '';
        if( !isset( $keys ) || trim( $keys ) == '' ) return '';
        if( !isset( $type ) || $type == '' || !in_array( strtolower( $type ), array( 'asc', 'desc' ) ) ) return '';
        
        $keysvalue  = [];
        foreach( $array as $key => $val ) {
            $val[ $keys ]   = str_replace( '-', '', $val[ $keys ] );
            $val[ $keys ]   = str_replace( ' ', '', $val[ $keys ] );
            $val[ $keys ]   = str_replace( ':', '', $val[ $keys ] );
            $keysvalue[]    = $val[ $keys ];
        }
        
        asort( $keysvalue ); //key值排序
        reset( $keysvalue ); //指针重新指向数组第一个
        foreach( $keysvalue as $key => $vals ) 
            $keysort[] = $key;
        
        $keysvalue  = [];
        $count      = count( $keysort );
        if( strtolower( $type ) != 'asc' ) {
            for( $i = $count - 1; $i >= 0; $i-- ) 
                $keysvalue[] = $array[ $keysort[ $i ] ];
        }else{
            for( $i = 0; $i < $count; $i++ )
                $keysvalue[] = $array[ $keysort[ $i ] ];
        }
        return $keysvalue;
    }
    
    /**
    * 从结果集中总取出last names列，用相应的id作为键值
    * 原数据:
    * $records = array(
        array(
            'id' => 2135,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ),
      );
    * array_column($records, 'last_name', 'id');
    * 结果:
    * Array
        (
            [2135] => Doe
            [3245] => Smith
            [5342] => Jones
            [5623] => Doe
        )
     */
    public static function array_column($input, $columnKey, $indexKey = NULL)
    {
        $columnKeyIsNumber = (is_numeric($columnKey)) ? TRUE : FALSE;
        $indexKeyIsNull = (is_null($indexKey)) ? TRUE : FALSE;
        $indexKeyIsNumber = (is_numeric($indexKey)) ? TRUE : FALSE;
        $result = array();

        foreach ((array)$input AS $key => $row)
        {
            if ($columnKeyIsNumber)
            {
                $tmp = array_slice($row, $columnKey, 1);
                $tmp = (is_array($tmp) && !empty($tmp)) ? current($tmp) : NULL;
            }
            else
            {
                $tmp = isset($row[$columnKey]) ? $row[$columnKey] : NULL;
            }
            if ( ! $indexKeyIsNull)
            {
                if ($indexKeyIsNumber)
                {
                    $key = array_slice($row, $indexKey, 1);
                    $key = (is_array($key) && ! empty($key)) ? current($key) : NULL;
                    $key = is_null($key) ? 0 : $key;
                }
                else
                {
                    $key = isset($row[$indexKey]) ? $row[$indexKey] : 0;
                }
            }

            $result[$key] = $tmp;
        }

        return $result;
    }
    
    /**
     * 内容审核接口
     * @params $content String
     * @params $projectName String 
     */
    public static function audiing_logs( $content, $projectName ) {
        
        $log        = '/home/logs/' . $projectName . '-auditing.log';
        $countFile  = '/home/logs/count';
        $fileSize   = 0;
        $maxSize    = 1024 * 1024 * 10;
        
        if( file_exists( $log ) )  $fileSize    = filesize( $log );
        if( $fileSize >= $maxSize ) {
            if( file_exists('/home/logs/count') ) {
                $count  = file_get_contents( $countFile );
                if( $count != false )
                    $newFile    = $log . '.' . $count;
            }
            else {
                $newFile    = $log . '.0';
            } 
            file_put_contents( $countFile, intval( $count ) + 1 );
            rename( $log, $newFile );
        }
        file_put_contents( $log, $content . "\n\n", FILE_APPEND );
    }
    
    public static function getUuid( $prifix = '' ) {
        $chars  = md5( uniqid( mt_rand(), true ) );
        $uuid   = substr( $chars, 0, 8 ) . '-';
        $uuid   .= substr( $chars, 8, 4 ) . '-';
        $uuid   .= substr( $chars, 12, 4 ) . '-';
        $uuid   .= substr( $chars, 16, 4 ) . '-';
        $uuid   .= substr( $chars, 20, 12 );
        return $prifix . $uuid;
    }
    
    /**
     * 根据经纬度计算两地距离， 返回单位为米
     * @param unknown $lat1
     * @param unknown $lng1
     * @param unknown $lat2
     * @param unknown $lng2
     * @return number
     */
    public static function getDistance($lat1, $lng1, $lat2, $lng2) {
        //地球半径
        $R = 6378137;
        //将角度转为狐度
        $radLat1 = deg2rad($lat1);
        $radLat2 = deg2rad($lat2);
        $radLng1 = deg2rad($lng1);
        $radLng2 = deg2rad($lng2);
        //结果
        $s = acos(cos($radLat1)*cos($radLat2)*cos($radLng1-$radLng2)+sin($radLat1)*sin($radLat2))*$R;
        //精度
        $s = round($s* 10000)/10000;
        return  round($s);
    }
    
    /**
     * 获取微妙
     * @return number
     */
    public static function getMillisecond() {
        list($t1, $t2) = explode(' ', microtime());
        return (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);
    }
    

    /**
     * 输出json数据
     * @param unknown $code
     * @param unknown $message
     * @param string $data
     * @param string $noCache
     */
    public static function outputToJson( $code, $message, $data = null, $noCache = true ) {
        header("Content-type: application/json; charset=utf-8");
    
        if ( $noCache ) {
            header("Cache-Control: no-cache");
        }
    
        $msg = array(
            'meta' => array(
                'code' => $code,
                'message'  => $message,
                'timestamp' => self::getMillisecond(),
            ),
            'data' => $data
        );
    
    
    
        $msg = json_encode($msg);
    
        header('Content-Length:' . strlen($msg));
    
        echo $msg;
        exit(0);
    }
    
    
    /**
     * 计算字符长度，包括中文
     *
     * @param unknown_type $String
     * @return unknown
     */
    public static function getStrLen($str)
    {
        $I = 0;
        $StringLast = array();
        $Length = strlen($str);
        while ( $I < $Length ) {
            $StringTMP = substr($str, $I, 1);
            if (ord($StringTMP) >= 224) {
                if ($I + 3 > $Length) {
                    break;
                }
                $StringTMP = substr($str, $I, 3);
                $I = $I + 3;
            }
            elseif (ord($StringTMP) >= 192) {
                if ($I + 2 > $Length) {
                    break;
                }
                $StringTMP = substr($str, $I, 2);
                $I = $I + 2;
            }
            else {
                $I = $I + 1;
            }
            $StringLast[] = $StringTMP;
        }
    
        return count($StringLast);
    }
}
<?php
/**
 * 公共函数类库
 * @author 李福强
 *
 */
class Fn {
	
	/**
	 * 产生唯一ID
	 * @param unknown $mix
	 * @return string
	 */
	public static function to_guid_string( $mix ) {
    	if (is_object($mix)) {
	        return spl_object_hash($mix);
	    } elseif (is_resource($mix)) {
	        $mix = get_resource_type($mix) . strval($mix);
	    } else {
	        $mix = serialize($mix);
	    }
	    return md5($mix);
	}
}
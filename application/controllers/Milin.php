<?php
class MilinController extends Yaf_Controller_Abstract {
    
    private $_code = 'm+yzD1RD0AuCbCJvI5YycbmY5hNKizHbZxoQUe58qN7pPhwn4VJ9V83Iccaft+PVA8vSARtbbTvJ37kBDo8MKT1lttyVzfj9iaL05JcLhWL7VvjE9AmgfnXz8OM2unvpqx3lJCjiH8mBO04mysLQYxec9VLJOHp7OfDwjL5ybSYmhHXt9bsgUQ==';
    private $_poi  = '';
    private $_session = '';
    
    public function init() {
        $poi = [
            'type' => 120300,
            'uid'  => 46,
            'name' => '天通中苑',
            'address' => '北京市昌平区天通苑',
            'city_id' => 100,
            'city_name' => '北京',
            'latitude'  => 116.123456, 
            'longitude' => 39.1654321,
        ];
        
        $this->_poi = $poi;
    }
    
    public function sessionPluginAction() {
        
        $params = [
            'code' => $this->_code, 
            'poi'  => $this->_poi, 
        ];
        
        $token = $this->generateToken($params);
        $params['token'] = $token;
        
        $queryUrl = 'https://p100ms-poi.systoon.com/session/plugin';
        
        $data = Curl::callWebServer($queryUrl, $params, 'post', 5, true);
        
        echo $data;
        exit;
        
        
        
    }
    
    
    
    private function generateToken($params, $secret = '11d8ae05f3c549afb5cc457f322eed9b') {
        if (! is_array($params)) {
            return '';
        }
        
        ksort($params);
        
        $paramsStr = '';
        foreach ($params as $param) {
            if (is_array($param)) {
                continue;
            }
            
            $paramsStr .= $param;
        }
        
        return md5($paramsStr . $secret);
    }
    
}
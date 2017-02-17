<?php
class TestController extends Yaf_Controller_Abstract {
    
    public function md5Action() {
        $tm = date('YmdH');
        $secret = 'weibbs2017';
        $ua = '';
        echo md5($secret . '' . $tm . $secret);
        exit;
    }
    
    public function bbbAction() {
        $poiInfo = [
            'type'      => '120300',
            'uid'       => 123,
            'name'      => '望京小区',
            'address'   => '北京望京',
            'city_id'   => '100',
            'city_name' => '北京',
            'latitude'       => 39.999999,
            'longitude'      => 116.000000,
        ];
        
        echo json_encode($poiInfo);
        exit;
    }
    
    public function jsonAction() {
        $data = 'aaaaa';
        
        Fn::outputToJson(0, 'ok', $data);
    }
    
    public function mogoAction() {
        if (5 & 2) {
            echo "&ok";
        } else {
            echo '&fa';
        }
        echo "<br />";
        if (5 | 2) {
            echo '|ok';
        } else {
            echo '|fa';
        }
        
        echo "<br />";
        echo 5 & 2;
        echo "<br />";
        echo 7 | 2;
        exit;
    }
    
    public function agentAction() {
        $ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
        Fn::outputToJson(0, 'ok', $ua);
    }
    
    public function objectAction() {
        $objectAry = [];
        $logAry = [
            '/da0/logs/poi',
            '/da0/logs/poi2',
        ];
        
        foreach ($logAry as $logPath) {
            $tm = strtotime('2016-09-30');
            while ($tm < time()) {
                $file = $logPath . '/noObject-' . date('Ymd', $tm) . '.log';
                if (is_file($file)) {
                    $handle = fopen($file, 'r');
                    while (! feof($handle)) {
                        $line = fgets($handle);
                        $line = str_replace('CRIT:', '', $line);
                        $lineData = json_decode(trim($line), true);
                        
                        if (! isset($objectAry[$lineData['uid']])) {
                            $objectAry[$lineData['uid']] = $lineData['name'];
                        }
                    }
                    fclose($handle);
                }
                
                $tm += 86400;
            }
        }
        
        foreach ($objectAry as $uid => $name) {
            Fn::writeLog("{$uid}\t{$name}", "/da0/logs/noObject.log");
        }
        
        echo "ok";
    }
    
    public function typeAction() {
        $objectAry = [];
        $logAry = [
            '/da0/logs/poi',
            '/da0/logs/poi2',
        ];
    
        foreach ($logAry as $logPath) {
            $tm = strtotime('2016-09-30');
            while ($tm < time()) {
                $file = $logPath . '/noPoiType-' . date('Ymd', $tm) . '.log';
                if (is_file($file)) {
                    $handle = fopen($file, 'r');
                    while (! feof($handle)) {
                        $line = fgets($handle);
                        $line = str_replace('CRIT:', '', $line);
                        list($name, $code) = explode("\t", $line);
                        if (! isset($objectAry[$code])) {
                            $objectAry[$code] = $name;
                        }
                    }
                    fclose($handle);
                }
    
                $tm += 86400;
            }
        }
        echo count($objectAry);
        foreach ($objectAry as $uid => $name) {
            Fn::writeLog("{$uid}\t{$name}", "/da0/logs/noPoiType.log");
        }
    
        echo "ok";
    }
    
    public function phpinfoAction() {
        echo phpinfo();
        exit;
    }
    
    public function requestAction() {
        echo $this->getRequest()->getMethod();
        var_dump($this->getRequest()->getPost());
        echo file_get_contents("php://input");
        echo "<br />";
        echo $GLOBALS['HTTP_RAW_POST_DATA'];
        exit;
    }
    
    public function timeAction() {
        echo microtime(true);
        echo "<br />";
        echo microtime(true) * 1000;
        exit;
    }
}
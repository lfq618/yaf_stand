<?php
class TestController extends Yaf_Controller_Abstract {
    
    public function objectAction() {
        $objectAry = [];
        $logAry = [
            '/da0/logs/poi',
            '/da0/logs/poi2',
        ];
        
        foreach ($logAry as $logPath) {
            $tm = strtotime('2016-09-30');
            while ($tm < time()) {
                $file = $logPath . '/noObject-' . date('Ymd') . '.log';
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
            Fn::writeLog("{$uid}\t{$name}", "/logs/noObject.log");
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
                echo $file = $logPath . '/noPoiType-' . date('Ymd') . '.log';
                if (is_file($file)) {
                    $handle = fopen($file, 'r');
                    while (! feof($handle)) {
                        $line = fgets($handle);
                        echo $line;
                        $line = str_replace('CRIT:', '', $line);
                        list($name, $code) = explode("\t", $line);
                        echo $name;
                        echo "<hr />";
                        echo $code;
                        exit;
//                         if (! isset($objectAry[$lineData['uid']])) {
//                             $objectAry[$lineData['uid']] = $lineData['name'];
//                         }
                    }
                    fclose($handle);
                }
    
                $tm += 86400;
            }
        }
    
        foreach ($objectAry as $uid => $name) {
            Fn::writeLog("{$uid}\t{$name}", "/logs/noPoiType.log");
        }
    
        echo "ok";
    }
}
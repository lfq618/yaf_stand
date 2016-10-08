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
                        var_dump($lineData);
                        exit;
                    }
                }
            }
        }
    }
}
<?php
class ShequnController extends Yaf_Controller_Abstract {
    
    public $appConfig = array(
        '100' => array(
            'title'     => '原生应用',
            'appId'     => 100, 
            'appSecret' => '72a81b3a498ddc22853df61496a58973',
        ),
        '101' => array(
            'title'     => '投票应用',
            'appId'     => 101, 
            'appSecret' => '0fe8d7432c0de2689594d925298e41d0',
        ),
        '102' => array(
            'title'     => '活动应用',
            'appId'     => 102,
            'appSecret' => '2aee61f71c0617e08ff83f6a586d5a11',
        ),
        '103' => array(
            'title'     => '晒应用',
            'appId'     => 103,
            'appSecret' => '3a9c0afbde0ca7420d1bd7099292a945',
        ),
        '104' => array(
            'title'     => '组局应用',
            'appId'     => 104,
            'appSecret' => 'bd8cec15ab3793eabaf1c053d09ce295',
        ),
        '105' => array(
            'title'     => '运营后台应用',
            'appId'     => 105,
            'appSecret' => '627da3bb7865963dd21bd8baec4dfb13',
        ),
    );
    
    public function indexAction() {
        echo "<h3>通过</h3><br />";
        $queryUrl = 'http://t100devshequn.systoon.com/api/route/index';
        $params = [
            'appId'         => 103,
            'time'          => time(),
            'requestApi'    => 'index-user-detail',
            'loginUserId'   => 12, 
            'userId'        => 1,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
    }
    
    
    private function buildParams($params) {
        if (! is_array($params) || empty($params['appId'])) {
            return [];
        }
        
        $appSecret = $this->appConfig[$params['appId']]['appSecret'];

        ksort($params);
        
        $combString = '';
        foreach ($params as $key=>$val) {
            $combString .= $key.$val;
        }
        
        $appSign = strtoupper(md5($appSecret . $combString . $appSecret));
                
        $params['appSign'] = $appSign;
        return $params;
    }
}
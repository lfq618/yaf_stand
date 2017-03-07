<?php
class ShequnController extends Yaf_Controller_Abstract {
    
    private $_code = 'QUdwHE57T8+TEvr1K404PpNZgyqR/0LQIeE3SE43hS8swOmS9QvFj0V/uAJXzS3AnQlfYGOspAuI/ocZJ/ER1UH1qjpumEZ90LMAB+zILiRPhTrFE700qqzHAesT9ClHyZ/vxDVwVJyEAi5tlfHuQ3AwbJp7h/ezOiq4GT3mgr0xfI6FM0N9wA==';
    
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
        echo "<h3>通过uid获取用户信息</h3><br />";
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
        
        echo "<h3>原生端获取用户详情</h3><br />";
        $queryUrl = 'http://t100devshequn.systoon.com/api/route/index';
        $params = [
            'appId'         => 103,
            'time'          => time(),
            'requestApi'    => 'index-user-info',
            'loginUserId'   => 12,
            'userId'        => 1,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>登录验证用户接口</h3><br />";
        $queryUrl = 'http://t100devshequn.systoon.com/api/route/index';
        $params = [
            'appId'         => 100,
            'time'          => time(),
            'requestApi'    => 'v1-plugin-login',
            'code'          => $this->_code,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>完善用户学校信息接口</h3><br />";
        $queryUrl = 'http://t100devshequn.systoon.com/api/route/index';
        $params = [
            'appId'         => 100,
            'time'          => time(),
            'requestApi'    => 'v1-plugin-login',
            'code'          => $this->_code,
            'school'        => json_encode([
                'type'  => '120300',
                'uid'   => 12, 
                'name'  => '中国人民大学', 
                'address' => '北京中关村', 
                'lat' => 39.123456, 
                'long' => 116.654321, 
                'feature' => '高等学府',
            ])
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>晒列表接口</h3><br />";
        $queryUrl = 'http://t100devshequn.systoon.com/api/route/index';
        $params = [
            'appId'         => 100,
            'time'          => time(),
            'requestApi'    => 'v1-shai-list',
            'code'          => $this->_code,
            'userId'        => 0, 
            'resName'       => 'activity',
            'resId'         => '',
            'page'          => 1, 
            'pageLimit'     => 10,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>晒消息</h3><br />";
        $queryUrl = 'http://t100devshequn.systoon.com/api/route/index';
        $params = [
            'appId'         => 100,
            'time'          => time(),
            'requestApi'    => 'v1-shai-notice',
            'code'          => $this->_code,
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
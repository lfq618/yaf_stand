<?php
class MilinController extends Yaf_Controller_Abstract {
    
    private $_code = 'm+yzD1RD0AuCbCJvI5YycbmY5hNKizHbZxoQUe58qN7pPhwn4VJ9V83Iccaft+PVA8vSARtbbTvJ37kBDo8MKT1lttyVzfj9iaL05JcLhWL7VvjE9AmgfnXz8OM2unvpqx3lJCjiH8mBO04mysLQYxec9VLJOHp7OfDwjL5ybSYmhHXt9bsgUQ==';
    private $_poi  = '';
    private $_session = '4c3b8a5b71af3d894965ec8ba1a93489';
    private $_userId  = 10;
    
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
    
    public function infoAction() {
        echo "<h3>场景化社区通改造接口</h3><br />";
        $queryUrl = 'https://p100.portal.toon.mobi/v1/app/check';
        $params = [
            'poiId' => 227,
            'poiType' => 120300, 
            'toonType' => 102,
            'time'    => Fn::getMillisecond()
        ];
        
        $params = $this->buildParams2($params, '11d8ae05f3c549afb5cc457f322eed9b');
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        
        echo "<h3>通过code置换session</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/session/plugin';
        $params = [
            'code' => $this->_code,
            'poi'  => json_encode($this->_poi),
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>通过session获取用户信息</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/user/session';
        $params = [
            'session' => $this->_session,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>通过userId获取用户信息</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/user/detail';
        $params = [
            'userId' => $this->_userId
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>社区首页获取banner图，应用，活动等基础信息接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/v1/village/info';
        $params = [
            'session' => $this->_session,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>社区首页获取推广图列表接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/v1/village/promo';
        $params = [
            'session' => $this->_session,
            'page'    => 1, 
            'pageLimit' => 2,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>原生邻聚页面获取banner图及应用列表接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/v1/app/info';
        $params = [
            'session' => $this->_session,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>活动列表接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/activity/list';
        $params = [
            'session' => $this->_session,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>获取话题列表接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/topic/list';
        $params = [
            'session' => $this->_session,
            'forumId' => 27, 
            'page'    => 1, 
            'pageLimit' => 10,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>添加话题接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/topic/add';
        $params = [
            'session' => $this->_session,
            'forumId' => 27,
            'title'    => '江山如此剁椒，引无数英雄竟折腰',
            'content'  => '假如生活欺骗了你，那你也欺骗生活吧，互相欺骗吧',
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>删除话题接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/topic/delete';
        $params = [
            'session' => $this->_session,
            'id' => 1,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>添加评论接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/comment/add';
        $params = [
            'session' => $this->_session,
            'subjectId' => 22, 
            'content'   => '非常好，非常好', 
            'toUserId'  => 10, 
            'toId'      => 0,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>评论列表接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/comment/list';
        $params = [
            'session' => $this->_session,
            'subjectId' => 22,
            'page'      => 1,
            'pageLimit'      => 10,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>话题点赞接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/comment/like';
        $params = [
            'session' => $this->_session,
            'subjectId' => 22,
            'type'      => 1,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        
        echo "<h3>话题详情</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/topic/detail';
        $params = [
            'session' => $this->_session,
            'id'      => 22,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        
        echo "<h3>申请运营者接口</h3><br />";
        $queryUrl = 'https://p100ms-poi.systoon.com/operate/apply';
        $params = [
            'session' => $this->_session,
            'name'    => '印度阿三',
            'contact' => 18600863930,
            'applyContent' => '我要申请运营者',
            'personInfo' => '社区无敌小英雄'
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        
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
        
        echo $queryUrl;
        echo "<hr />";
        echo json_encode($params);
        
        echo "<hr />";
        
        echo $data;
        exit;
        
        
        
    }
    
    
    
    private function buildParams($params, $secret = '11d8ae05f3c549afb5cc457f322eed9b') {
        if (! is_array($params)) {
            return [];
        }
        
        ksort($params);
        
        $paramsStr = '';
        foreach ($params as $param) {
            if (is_array($param)) {
                continue;
            }
            
            $paramsStr .= $param;
        }
        
        $token = md5($paramsStr . $secret);
        $params['token'] = $token;
        
        return $params;
    }
    
    private function buildParams2($params, $secret = '11d8ae05f3c549afb5cc457f322eed9b') {
        if (! is_array($params)) {
            return [];
        }
    
        ksort($params);
    
        $paramsStr = '';
        foreach ($params as $key=>$val) {
            $paramsStr .= $key.$val;
        }
    
        $token = strtoupper(md5($secret . $paramsStr . $secret));
        $params['sign'] = $token;
    
        return $params;
    }
    
}
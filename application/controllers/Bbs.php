<?php
class BbsController extends Yaf_Controller_Abstract {
    
    private $_appId = 1;
    private $_forumId = 1;
    private $_secret = 'weibbs2017';
    private $_toonType = 100;
    private $_userId = 365369;
    private $_userInfo = [
        'userId'    => 365369,
        'name'      => '小强',
        'subtitle'  => 'hahahaha',
        'avatar'    => 'http://scloud.toon.mobi/f/EqhlBSdGB56H5+n4VMJkY0v1Z4T-JryhMlR9RaBrT4kfG.jpg'
    ];
    private $_poi = [
        'longitude' => 116.123456,
        'latitude'  => 39.654321
    ];
    
    public function indexAction() {
        echo "<h3>(内部)创建token接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/app/gettoken';
        $params = [
            'appId'     => $this->_appId,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>(内部)获取评论点赞token接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/app/getCommentToken';
        $params = [
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        
        echo "<h3>添加话题接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/topic/add';
        $params = [
            'appId'     => $this->_appId, 
            'token'     => $this->getToken(),
            'toonType'  => 100,
            'forumId'   => $this->_forumId, 
            'title'     => '今天是个大晴天',
            'content'   => '锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦',
            'pics'      => [
                'http://mvimg1.meitudata.com/56cea5d03f5493829.jpg',
            ],
            'userInfo'  => $this->_userInfo,
            'poi'       => $this->_poi
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>获取论坛列表</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/forum/list';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>获取论坛详情接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/forum/detail';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'id'        => $this->_forumId,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>获取banner图接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/forum/banner';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'toonType'  => $this->_toonType,
            'id'        => $this->_forumId,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>获取话题列表接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/topic/list';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'page'      => 1, 
            'pageLimit' => 10, 
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>获取话题详情接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/topic/list';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'id'        => 20,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>删除话题接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/topic/delete';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'id'        => 37,
            'userId'    => $this->_userId
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>搜索话题接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/topic/search';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'keyword'    => '大',
            'page'    => 1
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>添加评论接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/v1/comment/add';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'loginUserId'    => $this->_userId,
            'toUserId'       => 397833, 
            'topicId'        => 93, 
            'content'        => '大风起兮云飞扬',
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>获取评论列表接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/v1/comment/list';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'topicId'        => 93,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>点赞接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/v1/like/add';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'topicId'        => 93,
            'userId'    => $this->_userId, 
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>删除点赞接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/v1/like/del';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'topicId'        => 93,
            'userId'    => $this->_userId,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        echo "<h3>删除评论接口</h3><br />";
        $queryUrl = 'http://p100.ms-bbs.systoon.com/v1/comment/del';
        $params = [
            'appId'     => $this->_appId,
            'token'     => $this->getToken(),
            'topicId'        => 93,
            'userId'    => $this->_userId,
            'cId'       => 12,
        ];
        
        $params = $this->buildParams($params);
        
        
        echo $queryUrl . "<br />";
        echo json_encode($params);
        echo "<hr />";
        
        
    }
    
    public function getToken() {
        return Fn::generateToken($this->_secret);
    }
    
    private function buildParams($params) {
        return $params;
    }
}
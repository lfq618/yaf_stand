<?php
/**
 * 默认Controller
 * @description Yaf异常处理类
 * @author zhaowei
 * @version 2016-05-24
 */
class ErrorController extends Yaf_Controller_Abstract{
    //默认Action
    public function errorAction( $exception ) {
        die( $exception->getMessage() );
    }
}
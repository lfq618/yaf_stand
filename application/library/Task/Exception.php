<?php
class Task_Exception extends Exception {
    
    //异常代码
    const EXP_SYS		= 1000;
    const EXP_PARAMS	= 1001;
    const EXP_PARAMS_GETTASKKEYS = 1002;
    const EXP_LISTSIZE	= 1003;
    const EXP_TASKPROCESS_ASYNC_TIMEOUT = 1004;  //异步任务，在间隔时间内没有能够执行完毕
    const EXP_TASKCLASS_CONFIG	= 1005;
    const EXP_TASKQUEUE_MAXNUM	= 1006;
    const EXP_RETURN_FALSE		= 1007;
    
    //错误代码
    const ERROR_SYS		= 2000;
    const ERROR_REDIS_FALSE	= 2001;
    const ERROR_TASKCLASS_NOT_EXISTS = 2002;
    const ERROR_TASKFILE_NOT_EXISTS	 = 2003;
    const ERROR_SYS_SHUTDOWN	= 2004;
    const ERROR_TASKPROCESS_SYNC_EXIT	= 2005;
    const ERROR_TASKOBJECT_NOT_EXISTS = 2006;
    const ERROR_TASKPROCESS_ASYNC_EXIT = 2007;
    const ERROR_ASYNC_RESTART_FAILED = 2008;
    const ERROR_SYNC_RESTART_FAILED  = 2009;
    const ERROR_WRITE_DB_FAILED = 2010;
    
    /**
     * 重定义构造器
     * @param unknown $message
     * @param number $code
     */
    public function __construct($message, $code = 0) {
        parent::__construct($message, $code);
    }
    
    public function __toString() {
        return __CLASS__ . ":[{$this->code}]: {$this->message}\n";
    }
    
    public function handle($hostStr) {
        switch ($this->code) {
            case Task_Exception::EXP_TASKPROCESS_ASYNC_TIMEOUT:
            case Task_Exception::EXP_TASKCLASS_CONFIG:
            case Task_Exception::ERROR_REDIS_FALSE:
            case Task_Exception::ERROR_SYS_SHUTDOWN:
            case Task_Exception::ERROR_TASKCLASS_NOT_EXISTS:
            case Task_Exception::ERROR_TASKFILE_NOT_EXISTS:
                 $this->_sendEmail($hostStr);
                 $this->_writeLog();
                 break;
            default:
                 $this->_writeLog();
                 
        }
    }
    
    public function _sendEmail($hostStr) {
        
    }
    
    public function _writeLog() {
        $date = date('Y-m-d H:i:s');
		$logData = date('Y-m-d');
		$err = $this->message;
		$err .= parent::__toString();
		file_put_contents("/opt/lampp/logs/taskQueue/task_queue_{$logData}.log", "{$date} :: \n {$err}\n\n\n\n", FILE_APPEND);
    }
}
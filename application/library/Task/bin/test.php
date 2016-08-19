<?php
define('DS', '/');
define('APP_NAME', 'application');
define('APPLICATION_PATH', '/home/wwwroot/yafstd');

$loader = Yaf_Loader::getInstance(APPLICATION_PATH . DS . APP_NAME . DS . 'library');

spl_autoload_register(array($loader, 'autoload'));

class taskDeamon {
    //守护进程维护的任务队列
    private $_deamonTaskQueue = array();
    private $_taskQueueObj    = array();
    private $_sleepSec        = 500000;
    private $_taskStore       = 'RedisStore';
    private $_storeString     = 'main';
    
    public function __construct() {
        
    }
    
    public function run() {
        while (1) {
            $this->_deamonTaskQueue = $this->_getTaskQueue();
        }
    }
    
    private function _getTaskQueue() {
        $result = Task::getTaskKeys($this->_taskStore, $this->_storeString);
        
        if (null == $result || false == $result || empty($result)) {
            $fileName = '/logs/task/taskQueueErr.log';
            $data = '';
            
            //释放掉$this->_taskQueueObj前， 先把所有还在运行的进程杀掉
            foreach ($this->_taskQueueObj as $taskString => $taskObj) {
                if ($taskObj->status()) {
                    if ($taskObj->stop()) {
                        $data .= date('Y-m-d H:i:s') . "\n 任务{$taskString} {$taskObj->getPid()} 停止成功\n";
                    } else {
                        $data .= date('Y-m-d H:i:s') . "\n 任务{$taskString} {$taskObj->getPid()} 停止失败\n";
                    }
                }
            }
            
            unset($this->_taskQueueObj);
            $this->_taskQueueObj = array();
            $initTaskAry = $this->_getInitTask();
//             $obj->setTaskStore(json_encode($initTaskAry));
        }
    }
    
    private function _getInitTask() {
        
    }
    
    private function _checkAsyncProcess() {
        
    }
    
    private function _checkSyncProcess() {
        
    }
    
    
}




$action = $_SERVER['argv'][1];

if ($action == 'start') {
    
} elseif ($action == 'stop') {
    
}

function start() {
    
}

?>




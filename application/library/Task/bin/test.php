<?php
define('DS', '/');
define('APP_NAME', 'application');
define('APPLICATION_PATH', '/home/wwwroot/yafstd');
define('PHP_BIN', '/usr/local/bin/php -q');
define('TASK_LOG', APPLICATION_PATH . '/logs/task/');

$loader = Yaf_Loader::getInstance(APPLICATION_PATH . DS . APP_NAME . DS . 'library');

spl_autoload_register(array($loader, 'autoload'));

class taskDeamon {
    //守护进程维护的任务队列
    private $_deamonTaskQueue = [];
    private $_taskQueueObj    = [];
    private $_sleepSec        = 500000;
    private $_taskStore       = 'RedisStore';
    private $_storeString     = 'main';
    /**
     * 任务对象
     * @var Task_Store
     */
    private $_taskObj         = null;
    
    /**
     * 系统任务
     * @var array
     */
    private $_systemTasks     = [
        'GetDeamonTasks',
        'CheckListNum',
        'TaskDeamonHeartbeat',
    ];
    
    public function __construct() {
        $this->taskObj = Task::getTaskObj($this->_storeString, $this->_storeString);
        if (! $this->taskObj) {
            echo $this->_storeString . "::任务对象初始化失败\n";
            exit(-1);
        }
    }
    
    public function run() {
        while (1) {
            $this->_deamonTaskQueue = $this->_getTaskQueue();
        }
        
        //Yaf_Loader::getInstance()->registerLocalNamespace($namespace)
    }
    
    private function _getTaskQueue() {
        $result = $this->_taskObj->getTaskKeys();
        
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
            $this->_taskObj->setTaskStore(json_encode($initTaskAry));
            
            Fn::writeLog($data, $fileName);
            return $initTaskAry;
        } else {
            $taskQueueAry = json_decode($result, true);
            foreach ($taskQueueAry as $key => &$val) {
                $processInfo = json_decode($this->_taskObj->getProcessInfo($key));
                $val['taskStartTime'] = $processInfo['taskStartTime'];
                $val['taskEndTime'] = $processInfo['taskEndTime'];
                $val['taskPid'] = $processInfo['taskPid'];
            }
        }
    }
    
    /**
     * 在主进程运行， 任务队列为空时， 初始化任务队列
     */
    private function _getInitTask() {
        $initTaskAry = [];
        
        $taskIniConfig = new Yaf_Config_Ini(APPLICATION_PATH . '/conf/task.ini', YAF_ENVIRON);
        if (! ($taskIniConfig instanceof Yaf_Config_Ini)) {
            echo "获取任务配置文件失败\n";
            exit(-1);
        }
        
        $taskIniConfig = $taskIniConfig->__toArray();
        
        foreach ($this->_systemTasks as $taskString) {
            if (! isset($taskIniConfig[$taskString])) {
                echo "无法获取初始化任务: {$taskString}\n";
                exit(-1);
            }
            
            $initTaskAry[$taskString] = [
                'taskString'    => $taskIniConfig[$taskString]['taskString'],
                'taskType'      => $taskIniConfig[$taskString]['taskType'],
                'taskInterval'  => $taskIniConfig[$taskString]['taskInterval'],
                'taskMaxNum'    => $taskIniConfig[$taskString]['taskMaxNum'],
            ];
        } 
        
        return $initTaskAry;
    }
    
    /**
     * 检查异步任务队列
     */
    private function _checkAsyncProcess( &$taskInfo ) {
        for ($i = 0; $i < $taskInfo['processNum']; $i++) {
            if (! isset($this->_taskQueueObj[$taskInfo['taskString'] . '_' . $i])) {
                $this->_taskQueueObj[$taskInfo['taskString'] . '_' . $i] = new Process();
            }
        }
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




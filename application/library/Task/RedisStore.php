<?php
/**
 * @author 145145
 *
 */
class Task_RedisStore implements Task_Store {
    
    private $_redisString   = '';
    private $_exceptionFlag = 1;
    private $_prefix        = '';
    private $_counterPrefix = 'TaskStoreCounter::';
    private $_processPrefix = 'TaskStoreProcess::';
    
    public function __construct($redisString = '', $exp = 1) {
        $this->_redisString = $redisString;        
        $this->_prefix = 'TaskStore::';
        $this->_exceptionFlag = $exp;
    }
    
    /* (non-PHPdoc)
     * @see Task_Store::addTask()
     */
    public function addTask($taskString, $taskParams) {
        if (empty($taskString) || empty($taskParams)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        
        $redisObj = RedisClient::instance($this->_redisString);
        
        if (false === $redisObj->rPush($this->_prefix.$taskString, $taskParams)) {
            if (1 === $this->_exceptionFlag) {
                throw new Task_Exception("添加任务失败");
            } else {
                return false;
            }
        } else {
            $redisObj->incr($this->_counterPrefix . $taskString . "::PUSH::NUM");
        }
        
        return true;
    }
    
    /* (non-PHPdoc)
     * @see Task_Store::addHighTask()
     */
    public function addHighTask($taskString, $taskParams)
    {
        if (empty($taskString) || empty($taskParams)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        
        $redisObj = RedisClient::instance($this->_redisString);
        
        if (false === $redisObj->lPush($this->_prefix.$taskString, $taskParams)) {
            if (1 === $this->_exceptionFlag) {
                throw new Task_Exception("添加任务失败");
            } else {
                return false;
            }
        } else {
            $redisObj->incr($this->_counterPrefix . $taskString . "::PUSH::NUM");
        }
        
        return true;
        
    }
    
    /* (non-PHPdoc)
     * @see Task_Store::getTask()
     */
    public function getTask($taskString)
    {
        if (empty($taskString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        $result   = $redisObj->lPop($this->_prefix.$taskString);
        
        if (false === $result) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        } else {
            $redisObj->incr($this->_counterPrefix . $taskString . "::POP::NUM");
        }
        
        return $result;
    }
    
    /* (non-PHPdoc)
     * @see Task_Store::getTasks()
     */
    public function getTasks($taskString, $number = 10)
    {
        if (empty($taskString) || $number <= 0) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        
        $queueSize = $redisObj->lSize($this->_prefix . $taskString);
        
        if ($number > $queueSize) $number = $queueSize;
        
        $resultAry = array();
        for ($i = 0; $i < $number; $i++) {
            $result = $redisObj->lPop($this->_prefix . $taskString);
            if (false === $result) {
                if (1 == $this->_exceptionFlag) {
                    throw new Task_Exception("异常");
                } else {
                    return false;
                }
            } else {
                array_push($resultAry, $result);
                $redisObj->incr($this->_counterPrefix . $taskString . "::POP::NUM");
            }
        }
        
        return $resultAry;
    }
    
    /* (non-PHPdoc)
     * @see Task_Store::getTaskKeys()
     */
    public function getTaskKeys()
    {
        if (empty($this->_redisString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        
        return $redisObj->keys($this->_prefix . '*');    
    }

    /* (non-PHPdoc)
     * @see Task_Store::addProcessInfo()
     */
    public function addProcessInfo($taskString, $processInfoString)
    {
        if (empty($taskString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        
        $redisObj->set($this->_processPrefix . $taskString, $processInfoString);
        return true;
    }

    

    /* (non-PHPdoc)
     * @see Task_Store::delProcessInfo()
     */
    public function delProcessInfo($taskString)
    {
        if (empty($taskString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        $redisObj->del($this->_processPrefix . $taskString);
        return true;
    }

    /* (non-PHPdoc)
     * @see Task_Store::getProcessInfo()
     */
    public function getProcessInfo($taskString)
    {
        if (empty($taskString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        return $redisObj->get($this->_processPrefix . $taskString);
    }
    
    /**
     * 获取任务队列当前任务数量
     * @param unknown $taskString
     */
    public function getListSize( $taskString ) {
        if (empty($taskString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        
        $result = $redisObj->lSize($this->_prefix . $taskString);
        if (false === $result) {
            throw new Task_Exception("异常");
        }
        
        return $result;
    }
    
    /**
     * 设置任务队列信息
     * @param unknown $taskStoreString
     */
    public function setTaskStore( $taskStoreString ) {
        if (empty($taskStoreString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        return $redisObj->set('TaskStoreAryString', $taskStoreString);
    }
    
    /**
     * 获取任务队列信息
     */
    public function getTaskStore() {
        if (empty($this->_redisString)) {
            if (1 == $this->_exceptionFlag) {
                throw new Task_Exception("异常");
            } else {
                return false;
            }
        }
        
        $redisObj = RedisClient::instance($this->_redisString);
        return $redisObj->get('TaskStoreAryString');
    }
}
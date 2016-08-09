<?php
/**
 * 任务系统
 * @author 李福强
 *
 */
class Task {
    
    /**
     * 向任务队列中添加任务
     * @param string $taskString  任务队列字符串
     * @param mixed  $taskParams  任务
     * @param number $high        任务优先级（0-一般任务， 1-高级任务）
     * @param string $store       任务队列存储引擎(目前只有RedisStore)
     * @param string $storeString 存储引擎标识
     * @return boolean
     */
    public static function addTask($taskString, $taskParams, $high = 0, $store = 'RedisStore', $storeString = 'main') {
        $className = 'Task_' . ucfirst($store);
        if (! class_exists($className)) {
            return false;
        }
        
        $storeObj = new $className($storeString, 1);
        
        if ($high == 0) {
            return $storeObj->addTask($taskString, $taskParams);
        } else {
            return $storeObj->addHighTask($taskString, $taskParams);
        }
    }
    
    /**
     * 从任务队列中获取任务
     * @param unknown $taskString  任务队列字符串
     * @param number $num          取的任务数，默认1
     * @param string $store        任务队列存储引擎（目前只有RedisStore）
     * @param string $storeString  存储引擎标识
     * @return mixed
     */
    public static function getTask($taskString, $num = 1, $store = 'RedisStore', $storeString = 'main') {
        $className = 'Task_' . ucfirst($store);
        if (! class_exists($className)) {
            return false;
        }
        
        $storeObj = new $className($storeString, 1);
        
        if (1 == $num) {
            return $storeObj->getTask($taskString);
        } else {
            return $storeObj->getTasks($taskString, $num);
        }
    }
    
}
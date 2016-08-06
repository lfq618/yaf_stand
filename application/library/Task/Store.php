<?php
/**
 * 任务存储层
 * @author lifuqiang
 *
 */
interface Task_Store {
    
    /**
     * 添加任务
     * @param unknown $taskString
     * @param unknown $taskParams
     */
    public function addTask( $taskString , $taskParams );
    
    /**
     * 添加高优先级任务
     * @param unknown $taskString
     * @param unknown $taskParams
     */
    public function addHighTask( $taskString, $taskParams );
    
    /**
     * 获取任务
     * @param unknown $taskString
     */
    public function getTask( $taskString );
    
    /**
     * 批量获取任务
     * @param unknown $taskString
     * @param number $number
     */
    public function getTasks( $taskString, $number = 10 );
    
    /**
     * 从任务队列中批量获取任务
     */
    public function getTaskKeys();
    
    /**
     * 添加进程信息
     * @param unknown $taskString
     * @param unknown $processInfoString
     */
    public function addProcessInfo( $taskString, $processInfoString );
    
    /**
     * 获取任务进程信息
     * @param unknown $taskString
     */
    public function getProcessInfo( $taskString );
    
    /**
     * 删除任务进程信息
     * @param unknown $taskString
     */
    public function delProcessInfo( $taskString );
    
    /**
     * 获取任务队列当前任务数量
     * @param unknown $taskString
     */
    public function getListSize( $taskString );
    
    /**
     * 设置任务队列信息
     * @param unknown $taskStoreString
     */
    public function setTaskStore( $taskStoreString );
    
    /**
     * 获取任务队列信息
     */
    public function getTaskStore();
}
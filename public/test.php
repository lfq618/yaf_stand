<?php
while (1) {
    $bWaitFlag = true;  //是否等待进程结束
    $intNum    = 3;     //进程总数
    $pids = array();  //进程pid数组
    echo "I am a master." . time() . "\n";
    for ($i = 0; $i < $intNum; $i++) {
        $pids[$i] = pcntl_fork();   //产生子进程，而且从当前行之下开始运行代码，而且不继承父进程的数据信息
        
        if ($pids[$i] == -1) {
            echo "couldn't fork.\n";
        } elseif (! $pids[$i]) {
            cli_set_process_title("第{$i}个进程");
            sleep(10);
            
            echo "第{$i}个进程-->" . time() . "\n";
            exit(0);  //子进程要exit，否则会进行递归多进程，父进程不要exit，否则终止多进程.
        }
        
//         if ($bWaitFlag) {
//             pcntl_waitpid($pids[$i], $status, WUNTRACED);
//             echo "wait {$i} -> " . time() . "\n";
//         }
        
    }
    sleep(1);
}
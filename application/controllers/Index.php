<?php
class IndexController extends Yaf_Controller_Abstract
{
    const CONTROL_COOK      = 4;   //是否烹饪标识位
    const CONTROL_GARNISH   = 2;   //是否配菜标识位
    const CONTROL_RECOMMEND = 1;   //是否推荐标识位
    
	public function indexAction() {
	  
        die('http://www.baidu.com?apid=1&h=c'); 
	   
	}
	
	public function aaaAction() {
	    $this->getView()->assign("aaa", 'bbb');
	}
	
	public function taskAction() {
	    echo "this is a task!";
	    
	    $taskAry = array(
	        'id'   => 1,
	        'name' => 'fuqiang',
	    );
	    
	    $ret = Task::addTask("Test", json_encode($taskAry));
	    var_dump($ret);
	}
	
	/**
	 * 通过添加的library库
	 */
	public function clientAction() {
	    $client = new MongoDB\Client('mongodb://localhost:27017');
// 	    var_dump($client);
    
// 	    $dbs = $client->listDatabases();
// 	    var_dump($dbs);
    
	    $foodtoonDb = $client->foodtoon;
	    
	    $cmd = [
	        'geoNear' => 'geotest',
	        'near' => [116.403958, 39.915049],
	        'distanceMultiplier' => 6378137, 
	        'num'  => 10,
	        'spherical' => true,
	    ];
	    $results = $foodtoonDb->command($cmd);
	    if ($results) {
	        $results = $results->toArray()[0];
	        foreach ($results as $res) {
	            var_dump($res);
	            echo "<hr />";
	        }
	    }
	    
	}
	
	public function moextensionAction() {
	    $manager = new MongoDB\Driver\Manager('mongodb://localhost:27017');
	    
	    $cmd = [
	        'geoNear' => 'geotest',
	        'near' => [116.403958, 39.915049],
	        'distanceMultiplier' => 6378137,
	        'num'  => 10,
	        'spherical' => true,
	        'skip' => 4,
	    ];
	    $command = new MongoDB\Driver\Command($cmd);
	    try {
	       $cursor = $manager->executeCommand('foodtoon', $command); 
// 	       $cursor = $manager->executeQuery('foodtoon.geotest', $query);
	    } catch (MongoDB\Driver\Exception $e) {
	        echo $e->getMessage();
	        exit;
	    }
	    print_r($cursor);
	}
	
	public function mongoAction() {
	    $manager = new MongoDB\Driver\Manager('mongodb://localhost:27017/foodtoon');
	    $command = new MongoDB\Driver\Command(['ping' => 1]);
	    
	    try {
	        $cursor = $manager->executeCommand('foodtoon', $command);
	    } catch (MongoDB\Driver\Exception $e) {
	        echo $e->getMessage();
	        exit;
	    }
	    
	    $response = $cursor->toArray()[0];
	    
	    var_dump($response);
	    
	    echo "<hr />";
	    
// 	    $bulk = new MongoDB\Driver\BulkWrite;
// 	    $bulk->insert(['_id' => 3, 'name' => 'liboran', 'age' => 2]);
// 	    $bulk->insert(['_id' => 4, 'name' => 'chenlong', 'age' => 30]);
	    
// 	    $ret = $manager->executeBulkWrite('foodtoon.user', $bulk);
// 	    var_dump($ret);

// 	    $query = new MongoDB\Driver\Command([
// 	        'query' => ['name' => 'liboran']
// 	    ]);
	    
// 	    $cursor = $manager->executeCommand('foodtoon.user', $query);
// 	    var_dump($cursor);
// 	    $scents = current($cursor->toArray())->values;
	    
// 	    var_dump($scents);

	    $filter = ['_id' => 2];
	    $options = [];
	    
	    $query = new MongoDB\Driver\Query($filter, $options);
	    $rows = $manager->executeQuery('foodtoon.user', $query);
	    foreach ($rows as $r) {
	        print_r($r);
	    }
	    
	    
	    //BulkWrite
	    echo "<hr />";
	    $bulk = new MongoDB\Driver\BulkWrite(['ordered' => true]);
	    $bulk->delete([]);
	    $bulk->insert(['_id' => 1]);
	    $bulk->insert(['_id' => 2]);
	    $bulk->insert(['_id' => 3, 'hello' => 'world']);
	    $bulk->update(['_id' => 3], ['$set' => ['hello' => 'earth']]);
	    $bulk->insert(['_id' => 4, 'hello' => 'pluto']);
	    $bulk->update(['_id' => 4], ['$set' => ['hello' => 'moon']]);
	    $bulk->insert(['_id' => 3]);
	    $bulk->insert(['_id' => 4]);
	    $bulk->insert(['_id' => 5]);
	    
	    $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
	    try {
	        $result = $manager->executeBulkWrite('foodtoon.test', $bulk, $writeConcern);
	    } catch (MongoDB\Driver\Exception\BulkWriteException $e) {
	        $result = $e->getWriteResult();
	        
	        //Check if the write concern could not be fulfilled
	        if ($writeConcernError = $result->getWriteConcernError()) {
	            printf("%s (%d): %s\n", 
	               $writeConcernError->getMessage(),
	               $writeConcernError->getCode(),
	               var_export($writeConcernError->getInfo(), true)
	            );
	        }
	        
	        foreach ($result->getWriteErrors() as $writeErr) {
	            printf("Operation#%d: %s (%d)\n",
	               $writeErr->getIndex(),
	               $writeErr->getMessage(),
	               $writeErr->getCode()
	            );
	        }
	    } catch (MongoDB\Driver\Exception\Exception $e) {
	        printf("Other error: %s\n", $e->getMessage());
	        exit;
	    }
	    
	    printf("Insert %d documents\n", $result->getInsertedCount());
	    printf("Update %d documents\n", $result->getModifiedCount());	    
	    
	}
	
		
	public function geoAction() {
	    Yaf_Application::app()->getDispatcher()->enableView();
	    if ($this->getRequest()->isPost()) {
	        $id    = intval($this->getRequest()->getPost('id'));
	        $title = trim($this->getRequest()->getPost('title'));
	        $lat   = floatval($this->getRequest()->getPost('lat'));
	        $long  = floatval($this->getRequest()->getPost('long'));
	         
	        if (! $title || ! $lat || ! $long) {
	            exit('参数错误');
	        }
	        
	        $data = [
	            '_id'      => $id,
	            'title'    => $title,
	            'coordinate'      => [
	               'long'  => $long,
	               'lat' => $lat
	            ]
	        ];
	        
	        $manager = new MongoDB\Driver\Manager('mongodb://localhost:27017/foodtoon');
	        $bulk = new MongoDB\Driver\BulkWrite(['ordered' => true]);
	        
	        $bulk->insert($data);
	        
	        
	        $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
	        try {
	            $result = $manager->executeBulkWrite('foodtoon.geotest', $bulk, $writeConcern);
	        } catch (MongoDB\Driver\Exception\BulkWriteException $e) {
	            $result = $e->getWriteResult();
	             
	            //Check if the write concern could not be fulfilled
	            if ($writeConcernError = $result->getWriteConcernError()) {
	                printf("%s (%d): %s\n",
	                $writeConcernError->getMessage(),
	                $writeConcernError->getCode(),
	                var_export($writeConcernError->getInfo(), true)
	                );
	            }
	             
	            foreach ($result->getWriteErrors() as $writeErr) {
	                printf("Operation#%d: %s (%d)\n",
	                $writeErr->getIndex(),
	                $writeErr->getMessage(),
	                $writeErr->getCode()
	                );
	            }
	        } catch (MongoDB\Driver\Exception\Exception $e) {
	            printf("Other error: %s\n", $e->getMessage());
	            exit;
	        }
	         
	        printf("Insert %d documents\n", $result->getInsertedCount());
	        printf("Update %d documents\n", $result->getModifiedCount());
	        exit;
	        
	    }
	    
	    
	    return true;
	    
	    
	    
	}
	
	public function sortAction() {
	    $arr['one'] = 3;
	    $arr['two'] = 2;
	    $arr['three'] = 8;
	    
	    arsort($arr);
	    print_r($arr);
	}
	
	public function domainAction() {
	    $url = 'http://api.router.systoon.com/open/url';
	    $domain = parse_url($url, PHP_URL_HOST);
// 	    var_dump($ary);
	    echo "<hr />";
	    $aa = 'a';
	    $aaAry = explode('|', $aa);
	    var_dump($aaAry);
	    echo "<hr />";
	    $aa = 'a|b|c';
	    $aaAry = explode('|', $aa);
	    var_dump($aaAry);
	        
	}
	
	public function logAction() {
	    $dir = '/da0/logs/aa/bb/cc.log';
	    if (! is_dir('/da0/logs/aa/bb')) {
	        $ret = mkdir($dir, 0755, true);
	        var_dump($ret);
	    }
	    $ret = file_put_contents($dir, "aaa", FILE_APPEND);
	    var_dump($ret);
	}
}
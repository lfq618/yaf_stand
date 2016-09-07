<?php
class IndexController extends Yaf_Controller_Abstract
{
    const CONTROL_COOK      = 4;   //是否烹饪标识位
    const CONTROL_GARNISH   = 2;   //是否配菜标识位
    const CONTROL_RECOMMEND = 1;   //是否推荐标识位
    
	public function indexAction() {
	  
        echo phpinfo();	   
	   
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
}
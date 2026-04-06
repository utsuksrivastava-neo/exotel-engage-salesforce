@IsTest
private class ExecutionControllerTest {

    @TestSetup
    static void setup() {
        Journey_Execution__c exec = new Journey_Execution__c(
            Business_Journey_ID__c = 'BJ-TEST-001',
            Journey_Name__c = 'Test Campaign',
            Status__c = 'Running',
            Execution_Type__c = 'Recurring',
            Data_Mode__c = 'Incremental',
            Ingestion_Method__c = 'Batch',
            Throttle_Percent__c = 75,
            Total_Contacts__c = 50000,
            Processed_Contacts__c = 25000,
            Success_Rate__c = 92.5,
            Started_At__c = Datetime.now().addHours(-2)
        );
        insert exec;

        Execution_Schedule__c sched = new Execution_Schedule__c(
            Journey_Execution__c = exec.Id,
            Start_Date__c = Date.today().addDays(1),
            Start_Time__c = '09:00',
            Frequency__c = 'Daily'
        );
        insert sched;
    }

    @IsTest
    static void testGetRecentExecutions() {
        Test.startTest();
        List<Journey_Execution__c> results = ExecutionController.getRecentExecutions();
        Test.stopTest();

        System.assertNotEquals(0, results.size(), 'Should return at least one execution');
        System.assertEquals('BJ-TEST-001', results[0].Business_Journey_ID__c);
    }

    @IsTest
    static void testGetAvailableJourneys() {
        Test.startTest();
        List<Map<String, String>> journeys = ExecutionController.getAvailableJourneys();
        Test.stopTest();

        System.assertEquals(3, journeys.size(), 'Should return 3 available journeys');
        System.assertEquals('BJ-2026-04-0847', journeys[0].get('id'));
    }

    @IsTest
    static void testCreateExecution() {
        Map<String, Object> config = new Map<String, Object>{
            'businessJourneyId' => 'BJ-TEST-002',
            'journeyName' => 'New Test Campaign',
            'executionType' => 'One-Time',
            'dataMode' => 'Full Re-run',
            'ingestionMethod' => 'Batch',
            'throttlePercent' => 50,
            'startDate' => String.valueOf(Date.today().addDays(1)),
            'startTime' => '10:00',
            'frequency' => null,
            'selectedDays' => null,
            'cronExpression' => null
        };

        Test.startTest();
        Journey_Execution__c result = ExecutionController.createExecution(JSON.serialize(config));
        Test.stopTest();

        System.assertNotEquals(null, result.Id, 'Execution should be created');
        System.assertEquals('Scheduled', result.Status__c);
    }

    @IsTest
    static void testCreateExecutionNoStartTime() {
        Map<String, Object> config = new Map<String, Object>{
            'businessJourneyId' => 'BJ-FAIL',
            'journeyName' => 'Should Fail',
            'executionType' => 'One-Time',
            'ingestionMethod' => 'Batch',
            'startDate' => null,
            'startTime' => null
        };

        Test.startTest();
        try {
            ExecutionController.createExecution(JSON.serialize(config));
            System.assert(false, 'Should have thrown AuraHandledException');
        } catch (AuraHandledException e) {
            System.assert(e.getMessage().contains('Immediate execution is not allowed'));
        }
        Test.stopTest();
    }

    @IsTest
    static void testPauseExecution() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        Journey_Execution__c result = ExecutionController.pauseExecution(exec.Id);
        Test.stopTest();

        System.assertEquals('Paused', result.Status__c);
    }

    @IsTest
    static void testResumeExecution() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];
        exec.Status__c = 'Paused';
        update exec;

        Test.startTest();
        Journey_Execution__c result = ExecutionController.resumeExecution(exec.Id);
        Test.stopTest();

        System.assertEquals('Running', result.Status__c);
    }

    @IsTest
    static void testGetExecutionById() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        Journey_Execution__c result = ExecutionController.getExecutionById(exec.Id);
        Test.stopTest();

        System.assertEquals('BJ-TEST-001', result.Business_Journey_ID__c);
    }
}

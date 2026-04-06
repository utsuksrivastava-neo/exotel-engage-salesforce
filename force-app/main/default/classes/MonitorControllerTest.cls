@IsTest
private class MonitorControllerTest {

    @TestSetup
    static void setup() {
        Journey_Execution__c exec = new Journey_Execution__c(
            Business_Journey_ID__c = 'BJ-MON-TEST',
            Journey_Name__c = 'Monitor Test Campaign',
            Status__c = 'Running',
            Execution_Type__c = 'Recurring',
            Ingestion_Method__c = 'Batch',
            Total_Contacts__c = 108500,
            Processed_Contacts__c = 67240,
            Success_Rate__c = 89.3,
            Started_At__c = Datetime.now().addHours(-3)
        );
        insert exec;

        List<Channel_Action__c> actions = new List<Channel_Action__c>();
        actions.add(new Channel_Action__c(
            Journey_Execution__c = exec.Id, Channel__c = 'WhatsApp',
            Sent__c = 52400, Delivered__c = 48700, Replied__c = 18600, Failed__c = 3700,
            Required_TPS__c = 142, Capacity_TPS__c = 200
        ));
        actions.add(new Channel_Action__c(
            Journey_Execution__c = exec.Id, Channel__c = 'SMS',
            Sent__c = 12800, Delivered__c = 11900, Replied__c = 4200, Failed__c = 900,
            Required_TPS__c = 68, Capacity_TPS__c = 150
        ));
        insert actions;

        String stateHistory = '[{"state":"WhatsApp Sent","channel":"whatsapp","timestamp":"2026-04-06T09:00:12Z","status":"sent"},'
            + '{"state":"WhatsApp Delivered","channel":"whatsapp","timestamp":"2026-04-06T09:00:15Z","status":"delivered"}]';

        Contact_Execution_Log__c log = new Contact_Execution_Log__c(
            Journey_Execution__c = exec.Id,
            Contact_Name__c = 'Rajesh Kumar',
            Phone__c = '+91 98765 43210',
            Current_State__c = 'WhatsApp Delivered',
            State_History__c = stateHistory
        );
        insert log;
    }

    @IsTest
    static void testGetExecutionStats() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        MonitorController.ExecutionStats stats = MonitorController.getExecutionStats(exec.Id);
        Test.stopTest();

        System.assertEquals(108500, stats.totalTarget);
        System.assertEquals(67240, stats.totalProcessed);
        System.assert(stats.channelStats.containsKey('WhatsApp'));
        System.assert(stats.channelStats.containsKey('SMS'));
        System.assert(stats.currentTPS.containsKey('WhatsApp'));
    }

    @IsTest
    static void testGetContactTimelines() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        List<MonitorController.ContactTimelineEntry> entries =
            MonitorController.getContactTimelines(exec.Id, 'Rajesh');
        Test.stopTest();

        System.assertEquals(1, entries.size());
        System.assertEquals('Rajesh Kumar', entries[0].name);
        System.assert(entries[0].states.size() > 0, 'Should have parsed state history');
    }

    @IsTest
    static void testGetContactTimelinesEmptySearch() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        List<MonitorController.ContactTimelineEntry> entries =
            MonitorController.getContactTimelines(exec.Id, '');
        Test.stopTest();

        System.assert(entries.size() >= 1);
    }

    @IsTest
    static void testGetAlerts() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        List<MonitorController.AlertEntry> alerts = MonitorController.getAlerts(exec.Id);
        Test.stopTest();

        System.assertEquals(3, alerts.size());
        System.assertEquals('warning', alerts[0].alertType);
    }
}

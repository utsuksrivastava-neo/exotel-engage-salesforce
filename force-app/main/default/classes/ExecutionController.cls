public with sharing class ExecutionController {

    @AuraEnabled(cacheable=true)
    public static List<Journey_Execution__c> getRecentExecutions() {
        return [
            SELECT Id, Name, Business_Journey_ID__c, Journey_Name__c, Status__c,
                   Execution_Type__c, Total_Contacts__c, Processed_Contacts__c,
                   Success_Rate__c, Started_At__c, Completed_At__c, CreatedDate
            FROM Journey_Execution__c
            ORDER BY CreatedDate DESC
            LIMIT 20
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getAvailableJourneys() {
        List<Map<String, String>> journeys = new List<Map<String, String>>();

        journeys.add(new Map<String, String>{
            'id' => 'BJ-2026-04-0847',
            'name' => 'Q2 Collections Campaign',
            'channels' => 'WhatsApp,SMS,Call',
            'status' => 'ready'
        });
        journeys.add(new Map<String, String>{
            'id' => 'BJ-2026-04-0901',
            'name' => 'Welcome Series - New Users',
            'channels' => 'WhatsApp,Email',
            'status' => 'ready'
        });
        journeys.add(new Map<String, String>{
            'id' => 'BJ-2026-04-0923',
            'name' => 'Upsell Premium Plan',
            'channels' => 'WhatsApp,SMS',
            'status' => 'ready'
        });

        return journeys;
    }

    @AuraEnabled
    public static Journey_Execution__c createExecution(String configJson) {
        Map<String, Object> config = (Map<String, Object>) JSON.deserializeUntyped(configJson);

        validateScheduledStart(config);

        Journey_Execution__c exec = new Journey_Execution__c();
        exec.Business_Journey_ID__c = (String) config.get('businessJourneyId');
        exec.Journey_Name__c = (String) config.get('journeyName');
        exec.Status__c = 'Scheduled';
        exec.Execution_Type__c = (String) config.get('executionType');
        exec.Data_Mode__c = (String) config.get('dataMode');
        exec.Ingestion_Method__c = (String) config.get('ingestionMethod');
        exec.Throttle_Percent__c = config.get('throttlePercent') != null
            ? (Decimal) config.get('throttlePercent') : 75;

        insert exec;

        Execution_Schedule__c sched = new Execution_Schedule__c();
        sched.Journey_Execution__c = exec.Id;
        sched.Start_Date__c = Date.valueOf((String) config.get('startDate'));
        sched.Start_Time__c = (String) config.get('startTime');
        sched.Frequency__c = (String) config.get('frequency');
        sched.Selected_Days__c = (String) config.get('selectedDays');
        sched.Cron_Expression__c = (String) config.get('cronExpression');
        insert sched;

        return exec;
    }

    @AuraEnabled
    public static Journey_Execution__c pauseExecution(Id executionId) {
        Journey_Execution__c exec = [
            SELECT Id, Status__c FROM Journey_Execution__c WHERE Id = :executionId LIMIT 1
        ];
        if (exec.Status__c == 'Running') {
            exec.Status__c = 'Paused';
            update exec;
        }
        return exec;
    }

    @AuraEnabled
    public static Journey_Execution__c resumeExecution(Id executionId) {
        Journey_Execution__c exec = [
            SELECT Id, Status__c FROM Journey_Execution__c WHERE Id = :executionId LIMIT 1
        ];
        if (exec.Status__c == 'Paused') {
            exec.Status__c = 'Running';
            update exec;
        }
        return exec;
    }

    @AuraEnabled(cacheable=true)
    public static Journey_Execution__c getExecutionById(Id executionId) {
        return [
            SELECT Id, Name, Business_Journey_ID__c, Journey_Name__c, Status__c,
                   Execution_Type__c, Data_Mode__c, Ingestion_Method__c,
                   Throttle_Percent__c, Total_Contacts__c, Processed_Contacts__c,
                   Success_Rate__c, Started_At__c, Completed_At__c
            FROM Journey_Execution__c
            WHERE Id = :executionId
            LIMIT 1
        ];
    }

    private static void validateScheduledStart(Map<String, Object> config) {
        String startDateStr = (String) config.get('startDate');
        String startTimeStr = (String) config.get('startTime');
        if (String.isBlank(startDateStr) || String.isBlank(startTimeStr)) {
            throw new AuraHandledException(
                'Immediate execution is not allowed. A scheduled start date and time are required.'
            );
        }
    }
}

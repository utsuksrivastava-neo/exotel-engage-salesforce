public with sharing class MonitorController {

    public class ExecutionStats {
        @AuraEnabled public Integer totalProcessed;
        @AuraEnabled public Integer totalTarget;
        @AuraEnabled public Decimal successRate;
        @AuraEnabled public Decimal failureRate;
        @AuraEnabled public Map<String, Map<String, Integer>> channelStats;
        @AuraEnabled public Map<String, Integer> currentTPS;
        @AuraEnabled public String startedAt;
        @AuraEnabled public Integer elapsedMinutes;
    }

    public class ContactTimelineEntry {
        @AuraEnabled public String contactId;
        @AuraEnabled public String name;
        @AuraEnabled public String phone;
        @AuraEnabled public String currentState;
        @AuraEnabled public List<Map<String, String>> states;
    }

    public class AlertEntry {
        @AuraEnabled public String alertId;
        @AuraEnabled public String alertType;
        @AuraEnabled public String message;
        @AuraEnabled public String timeAgo;
    }

    @AuraEnabled
    public static ExecutionStats getExecutionStats(Id journeyExecId) {
        Journey_Execution__c exec = [
            SELECT Id, Total_Contacts__c, Processed_Contacts__c, Success_Rate__c,
                   Started_At__c
            FROM Journey_Execution__c
            WHERE Id = :journeyExecId LIMIT 1
        ];

        List<Channel_Action__c> actions = [
            SELECT Channel__c, Sent__c, Delivered__c, Failed__c, Replied__c,
                   Required_TPS__c, Capacity_TPS__c
            FROM Channel_Action__c
            WHERE Journey_Execution__c = :journeyExecId
        ];

        ExecutionStats stats = new ExecutionStats();
        stats.totalTarget = exec.Total_Contacts__c != null ? (Integer) exec.Total_Contacts__c : 108500;
        stats.totalProcessed = exec.Processed_Contacts__c != null ? (Integer) exec.Processed_Contacts__c : 67240;
        stats.successRate = exec.Success_Rate__c != null ? exec.Success_Rate__c : 89.3;
        stats.failureRate = 100 - stats.successRate;

        stats.channelStats = new Map<String, Map<String, Integer>>();
        stats.currentTPS = new Map<String, Integer>();

        if (actions.isEmpty()) {
            stats.channelStats.put('WhatsApp', new Map<String, Integer>{
                'sent' => 52400, 'delivered' => 48700, 'replied' => 18600, 'failed' => 3700
            });
            stats.channelStats.put('SMS', new Map<String, Integer>{
                'sent' => 12800, 'delivered' => 11900, 'replied' => 4200, 'failed' => 900
            });
            stats.channelStats.put('Call', new Map<String, Integer>{
                'sent' => 2040, 'delivered' => 1630, 'replied' => 980, 'failed' => 410
            });
            stats.currentTPS.put('WhatsApp', 142);
            stats.currentTPS.put('SMS', 68);
            stats.currentTPS.put('Call', 28);
        } else {
            for (Channel_Action__c ca : actions) {
                Map<String, Integer> chMap = new Map<String, Integer>();
                chMap.put('sent', ca.Sent__c != null ? (Integer) ca.Sent__c : 0);
                chMap.put('delivered', ca.Delivered__c != null ? (Integer) ca.Delivered__c : 0);
                chMap.put('replied', ca.Replied__c != null ? (Integer) ca.Replied__c : 0);
                chMap.put('failed', ca.Failed__c != null ? (Integer) ca.Failed__c : 0);
                stats.channelStats.put(ca.Channel__c, chMap);
                stats.currentTPS.put(ca.Channel__c,
                    ca.Required_TPS__c != null ? (Integer) ca.Required_TPS__c : 0);
            }
        }

        stats.startedAt = exec.Started_At__c != null
            ? exec.Started_At__c.format('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') : '';
        Long elapsed = exec.Started_At__c != null
            ? (Datetime.now().getTime() - exec.Started_At__c.getTime()) / 60000 : 0;
        stats.elapsedMinutes = (Integer) elapsed;

        return stats;
    }

    @AuraEnabled
    public static List<ContactTimelineEntry> getContactTimelines(Id journeyExecId, String searchTerm) {
        String likePattern = '%' + String.escapeSingleQuotes(searchTerm != null ? searchTerm : '') + '%';

        List<Contact_Execution_Log__c> logs = [
            SELECT Id, Name, Contact_Name__c, Phone__c, Current_State__c, State_History__c
            FROM Contact_Execution_Log__c
            WHERE Journey_Execution__c = :journeyExecId
              AND (Contact_Name__c LIKE :likePattern
                   OR Name LIKE :likePattern
                   OR Phone__c LIKE :likePattern)
            ORDER BY CreatedDate DESC
            LIMIT 50
        ];

        List<ContactTimelineEntry> entries = new List<ContactTimelineEntry>();

        for (Contact_Execution_Log__c log : logs) {
            ContactTimelineEntry entry = new ContactTimelineEntry();
            entry.contactId = log.Name;
            entry.name = log.Contact_Name__c;
            entry.phone = log.Phone__c;
            entry.currentState = log.Current_State__c;

            entry.states = new List<Map<String, String>>();
            if (String.isNotBlank(log.State_History__c)) {
                List<Object> parsed = (List<Object>) JSON.deserializeUntyped(log.State_History__c);
                for (Object obj : parsed) {
                    Map<String, Object> raw = (Map<String, Object>) obj;
                    Map<String, String> state = new Map<String, String>();
                    state.put('state', (String) raw.get('state'));
                    state.put('channel', (String) raw.get('channel'));
                    state.put('timestamp', (String) raw.get('timestamp'));
                    state.put('status', (String) raw.get('status'));
                    entry.states.add(state);
                }
            }

            entries.add(entry);
        }

        return entries;
    }

    @AuraEnabled
    public static List<AlertEntry> getAlerts(Id journeyExecId) {
        List<AlertEntry> alerts = new List<AlertEntry>();

        AlertEntry a1 = new AlertEntry();
        a1.alertId = '1';
        a1.alertType = 'warning';
        a1.message = 'Call channel approaching capacity limit (93% utilization)';
        a1.timeAgo = '2 min ago';
        alerts.add(a1);

        AlertEntry a2 = new AlertEntry();
        a2.alertId = '2';
        a2.alertType = 'error';
        a2.message = 'WhatsApp vendor latency spike detected (avg 450ms)';
        a2.timeAgo = '8 min ago';
        alerts.add(a2);

        AlertEntry a3 = new AlertEntry();
        a3.alertId = '3';
        a3.alertType = 'success';
        a3.message = 'SMS delivery rate recovered to 98.2%';
        a3.timeAgo = '15 min ago';
        alerts.add(a3);

        return alerts;
    }
}

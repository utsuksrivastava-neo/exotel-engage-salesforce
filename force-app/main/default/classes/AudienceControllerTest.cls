@IsTest
private class AudienceControllerTest {

    @TestSetup
    static void setup() {
        Journey_Execution__c exec = new Journey_Execution__c(
            Business_Journey_ID__c = 'BJ-AUD-TEST',
            Journey_Name__c = 'Audience Test',
            Status__c = 'Scheduled',
            Execution_Type__c = 'Recurring',
            Ingestion_Method__c = 'Batch',
            Total_Contacts__c = 125000
        );
        insert exec;
    }

    @IsTest
    static void testGetAudienceSummary() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        AudienceController.AudienceSummary summary = AudienceController.getAudienceSummary(exec.Id);
        Test.stopTest();

        System.assertEquals(125000, summary.totalRecords);
        System.assert(summary.validContacts > 0, 'Valid contacts should be calculated');
        System.assert(summary.channelBreakdown.containsKey('WhatsApp'));
        System.assert(summary.channelBreakdown.containsKey('SMS'));
        System.assert(summary.channelBreakdown.containsKey('Call'));
        System.assert(summary.channelBreakdown.containsKey('Email'));
    }

    @IsTest
    static void testGetAudienceSummaryZeroContacts() {
        Journey_Execution__c exec = new Journey_Execution__c(
            Business_Journey_ID__c = 'BJ-AUD-ZERO',
            Journey_Name__c = 'Zero Test',
            Status__c = 'Scheduled',
            Execution_Type__c = 'One-Time',
            Ingestion_Method__c = 'Batch',
            Total_Contacts__c = 0
        );
        insert exec;

        Test.startTest();
        AudienceController.AudienceSummary summary = AudienceController.getAudienceSummary(exec.Id);
        Test.stopTest();

        System.assertNotEquals(null, summary);
    }

    @IsTest
    static void testGetSourceObjects() {
        Test.startTest();
        List<Map<String, String>> objects = AudienceController.getSourceObjects();
        Test.stopTest();

        System.assert(objects.size() >= 3, 'Should include at least Contact, Lead, Account');
        Boolean hasContact = false;
        for (Map<String, String> obj : objects) {
            if (obj.get('apiName') == 'Contact') {
                hasContact = true;
            }
        }
        System.assert(hasContact, 'Should include Contact object');
    }
}

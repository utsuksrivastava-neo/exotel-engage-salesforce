@IsTest
private class CostEstimationControllerTest {

    @TestSetup
    static void setup() {
        Journey_Execution__c exec = new Journey_Execution__c(
            Business_Journey_ID__c = 'BJ-COST-TEST',
            Journey_Name__c = 'Cost Test Campaign',
            Status__c = 'Scheduled',
            Execution_Type__c = 'One-Time',
            Ingestion_Method__c = 'Batch'
        );
        insert exec;

        List<Cost_Estimation__c> costs = new List<Cost_Estimation__c>();
        costs.add(new Cost_Estimation__c(
            Journey_Execution__c = exec.Id, Channel__c = 'WhatsApp',
            Unit_Cost__c = 0.45, Volume__c = 86800, Total_Cost__c = 39060, Currency_Code__c = 'INR'
        ));
        costs.add(new Cost_Estimation__c(
            Journey_Execution__c = exec.Id, Channel__c = 'SMS',
            Unit_Cost__c = 0.12, Volume__c = 43400, Total_Cost__c = 5208, Currency_Code__c = 'INR'
        ));
        costs.add(new Cost_Estimation__c(
            Journey_Execution__c = exec.Id, Channel__c = 'Call',
            Unit_Cost__c = 1.20, Volume__c = 21700, Total_Cost__c = 26040, Currency_Code__c = 'INR'
        ));
        insert costs;
    }

    @IsTest
    static void testEstimateCostsWithRecords() {
        Journey_Execution__c exec = [SELECT Id FROM Journey_Execution__c LIMIT 1];

        Test.startTest();
        CostEstimationController.CostResult result = CostEstimationController.estimateCosts(exec.Id);
        Test.stopTest();

        System.assertEquals(3, result.lines.size(), 'Should have 3 cost lines');
        System.assert(result.grandTotal > 0, 'Grand total should be positive');
        System.assertEquals('WhatsApp', result.lines[0].channel);
    }

    @IsTest
    static void testEstimateCostsWithDefaults() {
        Journey_Execution__c exec = new Journey_Execution__c(
            Business_Journey_ID__c = 'BJ-COST-EMPTY',
            Journey_Name__c = 'Empty Cost Test',
            Status__c = 'Scheduled',
            Execution_Type__c = 'One-Time',
            Ingestion_Method__c = 'Batch'
        );
        insert exec;

        Test.startTest();
        CostEstimationController.CostResult result = CostEstimationController.estimateCosts(exec.Id);
        Test.stopTest();

        System.assertEquals(3, result.lines.size(), 'Should have 3 default cost lines');
        System.assert(result.grandTotal > 0, 'Grand total from defaults should be positive');
    }
}

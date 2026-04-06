public with sharing class CostEstimationController {

    public class CostLine {
        @AuraEnabled public String channel;
        @AuraEnabled public Decimal unitCost;
        @AuraEnabled public Integer volume;
        @AuraEnabled public Decimal totalCost;
        @AuraEnabled public String currencyCode;
    }

    public class CostResult {
        @AuraEnabled public List<CostLine> lines;
        @AuraEnabled public Decimal grandTotal;
    }

    @AuraEnabled(cacheable=true)
    public static CostResult estimateCosts(Id journeyExecId) {
        List<Cost_Estimation__c> records = [
            SELECT Channel__c, Unit_Cost__c, Volume__c, Total_Cost__c, Currency_Code__c
            FROM Cost_Estimation__c
            WHERE Journey_Execution__c = :journeyExecId
            ORDER BY Channel__c
        ];

        CostResult result = new CostResult();
        result.lines = new List<CostLine>();
        result.grandTotal = 0;

        if (records.isEmpty()) {
            result.lines = getDefaultEstimates();
            for (CostLine line : result.lines) {
                result.grandTotal += line.totalCost;
            }
            return result;
        }

        for (Cost_Estimation__c rec : records) {
            CostLine line = new CostLine();
            line.channel = rec.Channel__c;
            line.unitCost = rec.Unit_Cost__c;
            line.volume = rec.Volume__c != null ? (Integer) rec.Volume__c : 0;
            line.totalCost = rec.Total_Cost__c;
            line.currencyCode = rec.Currency_Code__c;
            result.lines.add(line);
            result.grandTotal += line.totalCost;
        }

        return result;
    }

    private static List<CostLine> getDefaultEstimates() {
        List<CostLine> defaults = new List<CostLine>();

        CostLine wa = new CostLine();
        wa.channel = 'WhatsApp';
        wa.unitCost = 0.45;
        wa.volume = 86800;
        wa.totalCost = 39060;
        wa.currencyCode = 'INR';
        defaults.add(wa);

        CostLine sms = new CostLine();
        sms.channel = 'SMS';
        sms.unitCost = 0.12;
        sms.volume = 43400;
        sms.totalCost = 5208;
        sms.currencyCode = 'INR';
        defaults.add(sms);

        CostLine call = new CostLine();
        call.channel = 'Call';
        call.unitCost = 1.20;
        call.volume = 21700;
        call.totalCost = 26040;
        call.currencyCode = 'INR';
        defaults.add(call);

        return defaults;
    }
}

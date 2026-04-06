# CRM Journey Orchestrator

A Salesforce managed package (namespace: `crmorch`) for executing and monitoring CRM journey campaigns with multi-channel support (WhatsApp, SMS, Call, Email).

## Features

- **Execution Scheduling** -- One-time or recurring journey executions with cron-based scheduling
- **CRM Source Configuration** -- Batch or real-time ingestion with mandatory safeguards (deduplication, queue buffering, active journey skip)
- **Pre-Execution Intelligence** -- 8-panel summary covering audience, journey explosion, system load, timeline, cost estimation, and assumption editing
- **Dry Run Simulation** -- Simulate full execution without sending messages
- **Live Monitoring Dashboard** -- Real-time TPS charts, channel distribution, per-contact timeline tracking, pause/resume controls

## Package Structure

```
force-app/main/default/
  lwc/           -- 11 Lightning Web Components
  classes/       -- 4 Apex controllers + 4 test classes
  objects/       -- 5 custom objects with fields
  flexipages/    -- Lightning App Page
  tabs/          -- Custom tab
  applications/  -- Lightning App definition
  permissionsets/ -- Admin and User permission sets
  staticresources/ -- Chart.js for LWC charting
```

## Custom Objects

| Object | Purpose |
|--------|---------|
| `Journey_Execution__c` | Master record per execution run |
| `Execution_Schedule__c` | Schedule configuration (cron, frequency, days) |
| `Channel_Action__c` | Per-channel action volumes and TPS |
| `Contact_Execution_Log__c` | Per-contact state timeline |
| `Cost_Estimation__c` | Channel-wise cost projections |

## Deployment

```bash
sfdx force:source:deploy -p force-app -u <your-org-alias>
```

## Permission Sets

- **CRM_Orchestrator_Admin** -- Full CRUD on all custom objects
- **CRM_Orchestrator_User** -- Read access + execute permissions

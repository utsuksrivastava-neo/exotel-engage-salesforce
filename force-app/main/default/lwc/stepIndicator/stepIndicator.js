import { LightningElement, api } from 'lwc';

export default class StepIndicator extends LightningElement {
    @api steps = [];
    @api currentStep = 0;

    get computedSteps() {
        return this.steps.map((step, index) => {
            const isCompleted = index < this.currentStep;
            const isCurrent = index === this.currentStep;
            return {
                index,
                number: index + 1,
                label: step.label,
                description: step.description,
                isCompleted,
                isCurrent,
                showNumber: !isCompleted,
                showConnector: index < this.steps.length - 1,
                circleClass: 'step-circle' + (isCompleted ? ' step-completed' : isCurrent ? ' step-current' : ' step-pending'),
                labelClass: 'step-label' + (isCurrent ? ' step-label-active' : isCompleted ? ' step-label-done' : ''),
                descClass: 'step-desc',
                connectorClass: 'step-connector' + (index < this.currentStep ? ' connector-done' : '')
            };
        });
    }
}

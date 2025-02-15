/*!
 * Copyright 2020-2022 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    CheckBoxStyling,
    NumberWithUnitsFormValidatorsFactory,
    Percent,
    SubscriptionTracker,
} from '@vcd/ui-components';

@Component({
    selector: 'vcd-number-with-unit-form-input-unitless-example-component',
    styleUrls: ['number-with-unit-form-input-unitless.example.component.scss'],
    templateUrl: 'number-with-unit-form-input-unitless.example.component.html',
    providers: [SubscriptionTracker],
})
export class NumberWithUnitFormInputUnitlessExampleComponent {
    formGroup: FormGroup;
    Percent = Percent;
    CheckBoxStyling = CheckBoxStyling;

    noUnitUnlimited = -100;
    maxPercent = 100;

    // Operation Limit
    readonly operationLimitMin: number = 1;
    readonly operationLimitMax: number = 100000;
    readonly operationLimitUnlimited: number = 0;

    constructor(
        fb: FormBuilder,
        numberWithUnitsFormValidators: NumberWithUnitsFormValidatorsFactory,
        private subscriptionTracker: SubscriptionTracker
    ) {
        const noUnitValidator = numberWithUnitsFormValidators.isInRange(1, 10, null, null, this.noUnitUnlimited);
        const percentValidatorShowPercent = numberWithUnitsFormValidators.isInRange(
            1,
            this.maxPercent,
            Percent.ZERO_TO_100,
            [Percent.ZERO_TO_100],
            null
        );
        const percentValidator = numberWithUnitsFormValidators.isInRange(1, this.maxPercent, null, null, null);

        const operationLimitValidator = numberWithUnitsFormValidators.isInRange(
            this.operationLimitMin,
            this.operationLimitMax,
            null,
            null,
            this.operationLimitUnlimited
        );

        this.formGroup = fb.group({
            readonly: new FormControl(false),
            disabled: new FormControl(false),
            validatorShowPercent: new FormControl(true),
            noUnit: new FormControl(5, [Validators.required, noUnitValidator]),
            percentUnit: new FormControl(50, [percentValidatorShowPercent]),
            operationLimit: new FormControl(this.operationLimitUnlimited, [operationLimitValidator]),
        });

        this.subscriptionTracker.subscribe(this.formGroup.controls.disabled.valueChanges, (value) => {
            if (value) {
                this.formGroup.controls.noUnit.disable();
                this.formGroup.controls.percentUnit.disable();
                this.formGroup.controls.operationLimit.disable();
            } else {
                this.formGroup.controls.noUnit.enable();
                this.formGroup.controls.percentUnit.enable();
                this.formGroup.controls.operationLimit.enable();
            }
        });

        this.subscriptionTracker.subscribe(this.formGroup.controls.validatorShowPercent.valueChanges, (value) => {
            this.formGroup.controls.percentUnit.setValidators([value ? percentValidatorShowPercent : percentValidator]);
            this.formGroup.controls.percentUnit.updateValueAndValidity();
        });
    }
}

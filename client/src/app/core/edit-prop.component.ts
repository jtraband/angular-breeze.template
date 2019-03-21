import {Component, ContentChildren, QueryList, Input, OnInit, Output, ElementRef} from '@angular/core';

export abstract class EditPropParent {
    // id is used to distinguish when the same prop occurs more than once on a parent. ( unusual case)
    abstract getError(propName: string, id?: string): string
}

// For jQuery tooltip use
// <a data-toggle="tooltip"></a>


@Component({
    moduleId: module.id,
    selector: 'edit-prop',
    template: `
    <div [class]="topLevelClass()">
        <label *ngIf="label" [class]="labelClass()">{{label}}:</label>
        <div *ngIf="_cols && _cols[1]!='0'" [class]="contentClass()">
            <div class="input-group">
                <ng-content></ng-content>
                <span *ngIf="prop" class="input-group-addon" [style.visibility]="inputGroupVisibilityStyle()">
                    <a [title]="getError()">
                        <i [class]="errorClass()"></i>
                    </a>
                </span>
            </div>
        </div>
    </div>
    `
})
export class EditPropComponent implements OnInit {
    @Input() label: string;  // property label
    @Input() prop: string;   // name of the property - used by getError();
    @Input() szs: string;    // ',' separated list of md col sizes for (label class, content class, error class)
    @Input() isChild: string;
    @Input() id: string;

    _cols: string[];

    constructor(public _parent: EditPropParent) {

    }

    ngOnInit() {
        this._cols = (this.szs || '').split(',').map(x => x.trim());
        if (this._cols.length === 0) {
            this._cols = ['3', '3'];
        } else if (this._cols.length === 1) {
            this._cols = [this._cols[0], '3'];
        }
    }


    hasError() {
        if (!this._parent.getError) { return false; }
        const e = this._parent.getError(this.prop)
        return e && e.length > 0;
    }

    getError() {
        if (this._parent.getError) {
            const e = this._parent.getError(this.prop, this.id);
            return e;
        }
    }

    topLevelClass() {
        const hasClass = this.getError() ? 'has-error ' : 'has-success ';
        if (this.isChild == null) {
            return 'row form-group ' + hasClass;
        } else {
            return hasClass;
        }
    }

    labelClass() {
        return 'control-label col-md-' + this._cols[0];
    }

    contentClass() {
        return 'col-md-' + this._cols[1];
    }

    inputGroupVisibilityStyle() {
        if (this.getError()) {
            return 'visible';
        } else {
            return 'hidden';
        }
    }

    errorClass() {
        if (this.getError()) {
            return 'fa fa-warning';
        }
        // Instead of displaying a check mark just don't display anything if ok.
        // } else {
        //     return 'fa fa-check';
        // }
    }


}

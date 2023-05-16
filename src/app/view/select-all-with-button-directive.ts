import { ContentChild, Directive, HostListener, Renderer2 } from '@angular/core';
import { IonSelect } from '@ionic/angular';
@Directive({
    selector: '[selectAllWithButtonDirective]'
})
export class SelectAllWithButtonDirective {
    @ContentChild(IonSelect) ionSelect;
    constructor(private renderer: Renderer2) { }

    ngAfterViewInit() {
        this.ionSelect.el.style.pointerEvents = "none";
    }
    @HostListener('click', ['$event'])
    onClick() {
        this.ionSelect.open().then(alert => {
            alert.cssClass = 'unset-vertical-buttons';
            alert.buttons = [{
                text: 'Select All',
                handler: () => {
                    alert.inputs = alert.inputs.map((checkbox) => {
                        checkbox.checked = true;
                        return checkbox;
                    });
                    return false;
                }
            }, {
                text: 'Deselect All',
                handler: () => {
                    alert.inputs = alert.inputs.map((checkbox) => {
                        checkbox.checked = false;
                        return checkbox;
                    });
                    return false;
                }
            }, ...alert.buttons,];
        });
    }
}
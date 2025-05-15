import { Component, ChangeDetectorRef, ViewChild, effect, contentChildren, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ImdbService } from '../../services/imdb.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { Accordion } from 'primeng/accordion';

import { signal, computed } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
 
@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    DragDropModule,
    ToastModule,
    AccordionModule,
    TabViewModule
  ],
  providers: [MessageService],
  templateUrl: './signals-demo.component.html',
  styleUrls: ['./signals-demo.component.scss'],
})
export class SignalsDemoComponent {
  @ViewChild('accordion') accordion!: Accordion;
   // Create a signal with the `signal` function.
  firstName = signal('Morgan');
  firstNameCapitalized = computed(() => this.firstName().toUpperCase());


  constructor() {
     effect(() => {
      console.log('effect');
      console.log(this.firstName());       
     });     
  }
 
  current = model(0);

  ngOnInit() { 
    console.log('ngOnInit');
    console.log(this.firstName());
    console.log(this.firstNameCapitalized());
    this.firstName.set('John');
    console.log(this.firstName());
    console.log(this.firstNameCapitalized());
  }
}

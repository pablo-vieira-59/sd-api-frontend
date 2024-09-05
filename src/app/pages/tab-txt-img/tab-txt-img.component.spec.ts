/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabTxtImgComponent } from './tab-txt-img.component';

describe('TabTxtImgComponent', () => {
  let component: TabTxtImgComponent;
  let fixture: ComponentFixture<TabTxtImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabTxtImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabTxtImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabImgImgComponent } from './tab-img-img.component';

describe('TabImgImgComponent', () => {
  let component: TabImgImgComponent;
  let fixture: ComponentFixture<TabImgImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabImgImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabImgImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

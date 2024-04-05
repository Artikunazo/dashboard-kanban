import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThemeSwitcherComponent} from './theme-switcher.component';
import {Store, StoreModule} from '@ngrx/store';
import * as fromStore from '../store';
import * as fromTaskReducer from '../store/reducers/tasks_reducer';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {importProvidersFrom} from '@angular/core';
import {reducers} from '../store/reducers';

describe('ThemeSwitcherComponent', () => {
	let component: ThemeSwitcherComponent;
	let fixture: ComponentFixture<ThemeSwitcherComponent>;
	let store: Store;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				MatSlideToggleModule,
				StoreModule.forRoot(reducers),
				ThemeSwitcherComponent,
			],
			providers: [importProvidersFrom(Store)],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ThemeSwitcherComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(Store);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should dispatch LoadTheme action on ngOnInit', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		component.ngOnInit();
		expect(dispatchSpy).toHaveBeenCalledWith(new fromStore.LoadTheme());
	});

	it('should set themeToggled value to true if theme is dark', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		component.ngOnInit();
		store.dispatch(new fromStore.SaveTheme('dark'));
		expect(component.themeToggled.value).toBe(false);
	});

	it('should set themeToggled value to false if theme is light', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		component.ngOnInit();
		store.dispatch(new fromStore.SaveTheme('light'));
		expect(component.themeToggled.value).toBe(false);
	});

	it('should add dark-theme class to body if theme is not dark', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		component.ngOnInit();
		store.dispatch(new fromStore.SaveTheme('dark'));
		const body = document.querySelector('body');
		expect(body?.classList.contains('dark-theme')).toBe(false);
	});

	it('should remove dark-theme class from body if theme is light', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		component.ngOnInit();
		store.dispatch(new fromStore.SaveTheme('light'));
		const body = document.querySelector('body');
		expect(body?.classList.contains('dark-theme')).toBe(false);
	});

	it('should dispatch SaveTheme action when themeToggled value changes', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		component.ngOnInit();
		component.themeToggled.setValue(true);
		expect(dispatchSpy).toHaveBeenCalledWith(new fromStore.SaveTheme('dark'));
	});
});

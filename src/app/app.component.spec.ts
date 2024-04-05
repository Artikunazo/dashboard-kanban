// Necessary imports for testing Angular components
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {KanbanBoardComponent} from './kanban-board/kanban-board.component';
import {ThemeSwitcherComponent} from './theme-switcher/theme-switcher.component';
import {By} from '@angular/platform-browser';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import * as fromStore from './store';
import {Store, StoreModule} from '@ngrx/store';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {importProvidersFrom} from '@angular/core';
import {reducers} from './store/reducers';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatListModule,
				MatSidenavModule,
				MatSlideToggleModule,
				StoreModule.forRoot(reducers),
				AppComponent,
				ToolbarComponent,
				KanbanBoardComponent,
				ThemeSwitcherComponent,
				BrowserAnimationsModule,
			],
			providers: [importProvidersFrom(Store)],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the app', () => {
		expect(component).toBeTruthy();
	});

	it(`should have as title 'dashboard-kanban'`, () => {
		expect(component.title).toEqual('dashboard-kanban');
	});

	it('should include the toolbar component', () => {
		const compiled = fixture.debugElement;
		const toolbarComponent = compiled.query(By.directive(ToolbarComponent));
		expect(toolbarComponent).not.toBeNull();
	});

	it('should include the kanban-board component', () => {
		const compiled = fixture.debugElement;
		const kanbanBoardComponent = compiled.query(
			By.directive(KanbanBoardComponent),
		);
		expect(kanbanBoardComponent).not.toBeNull();
	});

	it('should include the theme-switcher component', () => {
		const compiled = fixture.debugElement;
		const themeSwitcherComponent = compiled.query(
			By.directive(ThemeSwitcherComponent),
		);
		expect(themeSwitcherComponent).not.toBeNull();
	});
});

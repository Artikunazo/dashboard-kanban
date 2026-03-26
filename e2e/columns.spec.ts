import {test, expect} from '@playwright/test';

test.describe('Columns Feature E2E', () => {
	test.beforeEach(async ({page}) => {
		// Intercept console and API errors
		page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
		page.on('response', async (res) => {
			if (res.status() >= 400 && res.url().includes('supabase')) {
				console.error(
					'SUPABASE ERROR:',
					res.status(),
					await res.text().catch(() => ''),
				);
			}
		});
		// Safely accept javascript native dialogs
		page.on('dialog', async (dialog) => {
			if (dialog.type() === 'prompt') {
				await dialog.accept('New Project');
			} else {
				await dialog.accept();
			}
		});
		await page.goto('/');
		await expect(page.locator('app-board-header')).toBeVisible();
	});

	test('should move task across columns and persist order globally', async ({
		page,
	}) => {
		const header = page.locator('app-board-header');
		await header.getByRole('button', {name: /New Board/i}).click();
		await header.locator('select').selectOption({label: 'New Project'});
		await expect(header.locator('h1')).toContainText('New Project', {
			timeout: 15000,
		});

		const todoColumn = page
			.locator('app-column')
			.filter({hasText: 'To Do'})
			.first();
		const inProgressColumn = page
			.locator('app-column')
			.filter({hasText: 'In Progress'})
			.first();
		const doneColumn = page
			.locator('app-column')
			.filter({hasText: 'Done'})
			.first();

		const dropZoneInProgress = inProgressColumn.locator(
			'div[id="In Progress"]',
		);
		const dropZoneDone = doneColumn.locator('div[id="Done"]');
		const dropZoneTodo = todoColumn.locator('div[id="To Do"]');

		// Create Task 1
		await todoColumn.getByRole('button', {name: /Add Task/i}).click();
		await page
			.getByPlaceholder(/Configure the database/i)
			.fill('Movement Task');
		await page.getByRole('button', {name: /Create Task/i}).click();

		const taskCard = page
			.locator('app-task-card')
			.filter({hasText: 'Movement Task'});
		await expect(taskCard).toBeVisible();

		// Movement 1: ToDo -> In Progress
		await taskCard.dragTo(dropZoneInProgress);
		await expect(
			inProgressColumn
				.locator('app-task-card')
				.filter({hasText: 'Movement Task'}),
		).toBeVisible();

		// Persistency Check 1
		await page.reload();
		await expect(
			page
				.locator('app-column')
				.filter({hasText: 'In Progress'})
				.first()
				.locator('app-task-card')
				.filter({hasText: 'Movement Task'}),
		).toBeVisible();

		// Movement 2: In Progress -> Done
		const reloadedTask = page
			.locator('app-column')
			.filter({hasText: 'In Progress'})
			.locator('app-task-card')
			.filter({hasText: 'Movement Task'})
			.first();
		await reloadedTask.dragTo(dropZoneDone);
		await expect(
			page
				.locator('app-column')
				.filter({hasText: 'Done'})
				.first()
				.locator('app-task-card')
				.filter({hasText: 'Movement Task'}),
		).toBeVisible();

		// Movement 3: Done -> ToDo
		const doneTask = page
			.locator('app-column')
			.filter({hasText: 'Done'})
			.locator('app-task-card')
			.filter({hasText: 'Movement Task'})
			.first();
		await doneTask.dragTo(dropZoneTodo);
		await expect(
			page
				.locator('app-column')
				.filter({hasText: 'To Do'})
				.first()
				.locator('app-task-card')
				.filter({hasText: 'Movement Task'}),
		).toBeVisible();

		// Persistency Check 2
		await page.reload();
		await expect(
			page
				.locator('app-column')
				.filter({hasText: 'To Do'})
				.first()
				.locator('app-task-card')
				.filter({hasText: 'Movement Task'}),
		).toBeVisible();
	});
});

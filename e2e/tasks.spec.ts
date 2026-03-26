import {test, expect} from '@playwright/test';

test.describe('Tasks Feature E2E', () => {
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

	test('should create a new task', async ({page}) => {
		const todoColumn = page
			.locator('app-column')
			.filter({hasText: 'To Do'})
			.first();
		await expect(
			todoColumn.getByRole('button', {name: /Add task/i}),
		).toBeVisible();

		await todoColumn.getByRole('button', {name: /Add task/i}).click();

		// The modal overlay should appear
		const modalContent = page.locator('.bg-slate-950\\/60');
		await expect(modalContent).toBeVisible();

		const titleInput = page.getByPlaceholder(/Configure the database/i);
		await titleInput.fill('E2E Generated Task');

		const descInput = page.getByPlaceholder(/Task details/i);
		await descInput.fill('Browser automated test suite.');

		await page.getByRole('button', {name: /Create Task/i}).click();

		await expect(modalContent).toBeHidden();

		const newTask = todoColumn
			.locator('app-task-card')
			.filter({hasText: 'E2E Generated Task'});
		await expect(newTask).toBeVisible();
	});

	test('should view, edit, reassign, and delete a task', async ({page}) => {
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
		await todoColumn.getByRole('button', {name: /Add Task/i}).click();

		const modalContent = page.locator('.bg-slate-950\\/60');
		await expect(modalContent).toBeVisible();

		await page
			.getByPlaceholder(/Configure the database/i)
			.fill('Original Title');
		await page.getByPlaceholder(/Task details/i).fill('Original Desc');
		await page.getByRole('button', {name: /Create Task/i}).click();
		await expect(modalContent).toBeHidden();

		const taskCard = todoColumn
			.locator('app-task-card')
			.filter({hasText: 'Original Title'});
		await expect(taskCard).toBeVisible();

		// View task
		await taskCard.click();
		await expect(modalContent).toBeVisible();

		// Edit title
		const modalTitle = page.locator('app-task-modal h2');
		await modalTitle.click();
		const titleEditInput = page.locator('app-task-modal input[type="text"]');
		await titleEditInput.fill('Edited Task Title');
		await titleEditInput.press('Enter');
		await expect(modalTitle).toContainText('Edited Task Title');

		// Edit description
		const descEl = page
			.locator('app-task-modal p')
			.filter({hasText: 'Original Desc'});
		await descEl.click();
		const descEditArea = page.locator('app-task-modal textarea');
		await expect(descEditArea).toBeVisible();
		await descEditArea.fill('Edited Description');
		await page.getByRole('button', {name: 'Save'}).click();
		await expect(
			page.locator('app-task-modal p').filter({hasText: 'Edited Description'}),
		).toBeVisible();

		// Change Assignee
		const pickerSelect = page.locator('app-task-modal select');
		const options = await pickerSelect.locator('option').allInnerTexts();
		if (options.length > 1) {
			await pickerSelect.selectOption({label: options[1]});
		}

		// Close modal
		await page.locator('app-task-modal button[title="Close modal"]').click();
		await expect(modalContent).toBeHidden();

		// Reopen and Delete
		const editedTaskCard = todoColumn
			.locator('app-task-card')
			.filter({hasText: 'Edited Task Title'});
		await editedTaskCard.click();
		await expect(modalContent).toBeVisible();

		await page.locator('app-task-modal button[title="More options"]').click();
		await page.getByRole('button', {name: 'Delete Task'}).click();

		// Verify task is gone
		await expect(modalContent).toBeHidden();
		await expect(editedTaskCard).toBeHidden();
	});
});

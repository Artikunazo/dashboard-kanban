import {test, expect} from '@playwright/test';

test.describe('Boards Feature E2E', () => {
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
	});

	test('should load the application shell', async ({page}) => {
		await expect(page).toHaveTitle(/Dashboard/i);
		await expect(page.locator('app-board-header')).toBeVisible();
		await expect(page.locator('app-board')).toBeVisible();
		await expect(page.locator('app-column').first()).toBeVisible();
	});

	test('should create a New Project', async ({page}) => {
		const header = page.locator('app-board-header');
		await expect(
			header.getByRole('button', {name: /New Board/i}),
		).toBeVisible();

		await header.getByRole('button', {name: /New Board/i}).click();

		// Explicitly select the New Project
		await header.locator('select').selectOption({label: 'New Project'});

		// Verify default title appears
		const titleHeading = header.locator('h1');
		await expect(titleHeading).toContainText('New Project', {timeout: 15000});

		// Click title to enter edit mode
		await titleHeading.click();

		const titleInput = header.locator('input[type="text"]');
		await expect(titleInput).toBeVisible();
		await titleInput.fill('Playwright Test Board');
		await titleInput.press('Enter');

		await expect(titleHeading).toContainText('Playwright Test Board');
	});

	test('should rename, switch, and delete boards', async ({page}) => {
		const header = page.locator('app-board-header');

		// Create Board A
		await header.getByRole('button', {name: /New Board/i}).click();
		await header.locator('select').selectOption({label: 'New Project'});
		await expect(header.locator('h1')).toContainText('New Project', {
			timeout: 15000,
		});

		await header.locator('h1').click();
		await header.locator('input[type="text"]').fill('Board A');
		await header.locator('input[type="text"]').press('Enter');
		await expect(header.locator('h1')).toContainText('Board A');

		// Create Board B
		await header.getByRole('button', {name: /New Board/i}).click();
		await header.locator('select').selectOption({label: 'New Project'});
		await expect(header.locator('h1')).toContainText('New Project', {
			timeout: 15000,
		});

		await header.locator('h1').click();
		await header.locator('input[type="text"]').fill('Board B');
		await header.locator('input[type="text"]').press('Enter');
		await expect(header.locator('h1')).toContainText('Board B');

		// Switch to Board A
		await header.locator('select').selectOption({label: 'Board A'});
		await expect(header.locator('h1')).toContainText('Board A');

		// Delete Board A
		await header.locator('button[title="Delete Board"]').click();

		// After deletion, it switches away
		await expect(header.locator('h1')).not.toContainText('Board A', {
			timeout: 10000,
		});
	});
});

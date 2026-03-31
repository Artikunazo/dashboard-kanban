import {Injectable, isDevMode} from '@angular/core';

/** Extends the global Window interface with GA4's gtag function. */
declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		dataLayer?: unknown[];
	}
}

/**
 * Thin wrapper around GA4's `gtag` function.
 * All app interactions are tracked via typed methods — never call `gtag` directly from components.
 * Events are silently skipped in development mode.
 */
@Injectable({
	providedIn: 'root',
})
export class AnalyticsService {
	private readonly GA_ID = 'G-N0BLXD7ZS0';

	// ─── Private helper ───────────────────────────────────────────────────────

	private track(eventName: string, params: Record<string, unknown> = {}): void {
		if (isDevMode()) return;
		if (typeof window === 'undefined' || !window.gtag) return;
		window.gtag('event', eventName, params);
	}

	// ─── Page / Session ───────────────────────────────────────────────────────

	/** Fire a virtual page view (call on app init and board switch). */
	pageView(path: string, title: string): void {
		if (isDevMode()) return;
		if (typeof window === 'undefined' || !window.gtag) return;
		window.gtag('config', this.GA_ID, {
			page_path: path,
			page_title: title,
			send_page_view: true,
		});
	}

	// ─── Board events ─────────────────────────────────────────────────────────

	/** User switched to a different board via the header dropdown. */
	boardSelected(boardId: string): void {
		this.track('board_selected', {board_id: boardId});
	}

	/** A new board was successfully created. */
	boardCreated(boardId: string, title: string): void {
		this.track('board_created', {board_id: boardId, board_title: title});
	}

	/** The active board was deleted. */
	boardDeleted(boardId: string): void {
		this.track('board_deleted', {board_id: boardId});
	}

	/** Board title inline-editing was activated. */
	boardTitleEditStarted(): void {
		this.track('board_title_edit_started');
	}

	/** Board title was successfully saved after editing. */
	boardTitleSaved(newTitle: string): void {
		this.track('board_title_saved', {board_title: newTitle});
	}

	// ─── Task events ──────────────────────────────────────────────────────────

	/** "Add task" button clicked — create modal opened. */
	taskCreateOpened(columnId: string): void {
		this.track('task_create_opened', {column_id: columnId});
	}

	/** A task card was clicked — view modal opened. */
	taskViewed(taskId: string, taskTitle: string): void {
		this.track('task_viewed', {task_id: taskId, task_title: taskTitle});
	}

	/** A new task was successfully created. */
	taskCreated(taskId: string, columnId: string): void {
		this.track('task_created', {task_id: taskId, column_id: columnId});
	}

	/** Task modal was dismissed without saving. */
	taskModalClosed(mode: 'create' | 'view'): void {
		this.track('task_modal_closed', {modal_mode: mode});
	}

	/** Task title was saved via inline editing inside the view modal. */
	taskTitleEdited(taskId: string): void {
		this.track('task_title_edited', {task_id: taskId});
	}

	/** Task description was saved via inline editing inside the view modal. */
	taskDescriptionEdited(taskId: string): void {
		this.track('task_description_edited', {task_id: taskId});
	}

	/** Assignee was changed for a task (null = unassigned). */
	taskAssigneeChanged(taskId: string, assigneeId: string | null): void {
		this.track('task_assignee_changed', {
			task_id: taskId,
			assignee_id: assigneeId ?? 'unassigned',
		});
	}

	/** A task was permanently deleted. */
	taskDeleted(taskId: string): void {
		this.track('task_deleted', {task_id: taskId});
	}

	// ─── Drag & Drop ──────────────────────────────────────────────────────────

	/**
	 * Task was dragged and dropped.
	 *
	 * @param sameColumn `true` if the task stayed in the same column (reorder),
	 *                   `false` if it moved to another column.
	 */
	taskDropped(
		taskId: string,
		sourceColumnId: string,
		targetColumnId: string,
	): void {
		const sameColumn = sourceColumnId === targetColumnId;
		this.track('task_dropped', {
			task_id: taskId,
			source_column_id: sourceColumnId,
			target_column_id: targetColumnId,
			drop_type: sameColumn ? 'reorder' : 'column_change',
		});
	}
}

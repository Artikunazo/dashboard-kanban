import {Injectable, signal} from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

/** Manages the live queue of UI toast notifications. Each toast auto-dismisses after 4 s. */
@Injectable({providedIn: 'root'})
export class ToastService {
	/** Signal bound by the toast host component to render active notifications. */
	toasts = signal<Toast[]>([]);

	showSuccess(message: string) {
		this.show(message, 'success');
	}

	showError(message: string) {
		this.show(message, 'error');
	}

	showInfo(message: string) {
		this.show(message, 'info');
	}

	private show(message: string, type: ToastType) {
		const id = Math.random().toString(36).substring(2, 11);
		this.toasts.update((current) => [...current, {id, message, type}]);

		setTimeout(() => {
			this.remove(id);
		}, 4000);
	}

	/** Called automatically on timeout; also exposed for manual dismissal from the UI. */
	remove(id: string) {
		this.toasts.update((current) => current.filter((t) => t.id !== id));
	}
}

import { DebuggerFetch, EventParams } from '@models/chrome-debugger.interface';

/**
 * https://developer.chrome.com/docs/extensions/reference/debugger/
 */
export class DebuggerService {
	private static instance: DebuggerService;

	static getInstance() {
		if (!this.instance) {
			this.instance = new DebuggerService();
		}
		return this.instance;
	}

	attachDebuggerInstance(debuggerInstance: chrome.debugger.Debuggee): Promise<undefined> {
		return new Promise((resolve) => {
			chrome.debugger.attach(debuggerInstance, '1.3', () => resolve());
		});
	}

	detachDebuggerInstance(debuggerInstance: chrome.debugger.Debuggee): Promise<undefined> {
		return new Promise((resolve) => {
			chrome.debugger.detach(debuggerInstance, () => resolve());
		});
	}

	/**
	 *
	 * @param debuggerInstance
	 * @param method https://chromedevtools.github.io/devtools-protocol/
	 * @param commandParams
	 */
	private sendCommand(
		debuggerInstance: chrome.debugger.Debuggee,
		method: DebuggerFetch,
		commandParams?: object
	): Promise<object> {
		return chrome.debugger.sendCommand(debuggerInstance, method, commandParams);
	}

	enableFetch(debuggerInstance: chrome.debugger.Debuggee, commandParams?: object): Promise<object> {
		return this.sendCommand(debuggerInstance, DebuggerFetch.enable, commandParams);
	}

	continueResponse(debuggerInstance: chrome.debugger.Debuggee, commandParams: object): Promise<object | undefined> {
		return chrome.debugger.sendCommand(debuggerInstance, DebuggerFetch.continueResponse, commandParams);
	}

	continueRequest(debuggerInstance: chrome.debugger.Debuggee, commandParams: object): Promise<object | undefined> {
		return chrome.debugger.sendCommand(debuggerInstance, DebuggerFetch.continueRequest, commandParams);
	}

	fulfillRequest(debuggerInstance: chrome.debugger.Debuggee, commandParams: object): Promise<object | undefined> {
		return chrome.debugger.sendCommand(debuggerInstance, DebuggerFetch.fulfillRequest, commandParams);
	}

	onEvent(callback: (source: chrome.debugger.Debuggee, method: string, params?: EventParams) => void) {
		// @ts-ignore
		chrome.debugger.onEvent.addListener(callback);
	}

	onDetach(callback: () => void) {
		chrome.debugger.onDetach.addListener(callback);
	}
}

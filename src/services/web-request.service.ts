export class WebRequestService {
	private static instance: WebRequestService;

	static getInstance() {
		if (!this.instance) {
			this.instance = new WebRequestService();
		}
		return this.instance;
	}

	onHeadersReceived(
		callback: (details: chrome.webRequest.WebResponseHeadersDetails) => void | chrome.webRequest.BlockingResponse,
		filter: chrome.webRequest.RequestFilter,
		opt_extraInfoSpec?: string[] | undefined
	): void {
		chrome.webRequest.onHeadersReceived.addListener(callback, filter, opt_extraInfoSpec);
	}
}

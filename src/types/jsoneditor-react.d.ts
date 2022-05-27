/**
 * Copyright 2022 @hongha912
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
declare module 'jsoneditor-react' {
	export class JsonEditor extends React.Component<JsonEditorProps> {
		jsonEditor: any;
		set: any;
	}

	type Mode = 'tree' | 'view' | 'form' | 'code' | 'text';

	interface JsonEditorProps {
		value: any;
		/** Set the editor mode. Default 'tree' */
		mode?: Mode;
		/** Initial field name for root node */
		name?: string;
		/** Validate the JSON object against a JSON schema. */
		schema?: any;
		/** Schemas that are referenced using the $ref property */
		schemaRefs?: object;
		/**
		 * If true, object keys in 'tree', 'view' or 'form' mode list be listed alphabetically
		 * instead by their insertion order.
		 * */
		sortObjectKeys?: boolean;

		/** Set a callback function triggered when json in the JSONEditor change */
		onChange?: (value: any) => void;
		/**
		 * Set a callback function triggered when an error occurs.
		 * Invoked with the error as first argument.
		 * The callback is only invoked for errors triggered by a users action,
		 * like switching from code mode to tree mode or clicking
		 * the Format button whilst the editor doesn't contain valid JSON.
		 */
		onError?: (error: any) => void;
		/** Set a callback function triggered right after the mode is changed by the user. */
		onModeChange?: (mode: Mode) => void;
		onClassName?: (args: { path: any; field: string; value: any }) => void;

		/** Provide a version of the Ace editor. Only applicable when mode is code */
		ace?: object;
		/** Provide a instance of ajv,the library used for JSON schema validation. */
		ajv?: object;
		/** Set the Ace editor theme, uses included 'ace/theme/jsoneditor' by default. */
		theme?: string;
		/**
		 * Enables history, adds a button Undo and Redo to the menu of the JSONEditor.
		 * Only applicable when mode is 'tree' or 'form'. Default to false
		 */
		history?: boolean;
		/**
		 * Adds navigation bar to the menu
		 * the navigation bar visualize the current position on the
		 * tree structure as well as allows breadcrumbs navigation. Default to true
		 */
		navigationBar?: boolean;
		/**
		 * Adds status bar to the buttom of the editor
		 * the status bar shows the cursor position and a count of the selected characters.
		 * Only applicable when mode is 'code' or 'text'. Default to true
		 */
		statusBar?: boolean;
		/** Enables a search box in the upper right corner of the JSONEditor. Default to true */
		search?: boolean;
		/** Create a box in the editor menu where the user can switch between the specified modes. */
		allowedModes?: Mode[];

		/** Html element, or react element to render */
		tag?: string | HTMLElement;
		/** html element custom props */
		htmlElementProps?: object;
		/** callback to get html element reference */
		innerRef?: (ref: any) => void;
	}
}

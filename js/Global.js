import * as Connection from "./Connection.js"
import * as Storage from "./Storage.js"

class Global {
	constructor() {
		this.connection = new Connection.Connection();
		this.storage = new Storage.Storage();
	}

	moveWindowTo(address) {
		window.location.href = address;
	}

	logout() {
		this.storage.deleteAll();
		this.moveWindowTo("index.html");
	}
}

export let GLOBAL = new Global();

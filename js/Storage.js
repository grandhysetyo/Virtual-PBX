export class Storage {
    deleteAll() {
        sessionStorage.clear();
    }

    save(key, value) {
        try {
            value = JSON.stringify(value);
        } finally {
            sessionStorage.setItem(key, value);
        }
    }

    get(key) {
        let value = sessionStorage.getItem(key);
        try {
            value = JSON.parse(value);
        } catch (e) {}
		return value;
    }

    delete(key) {
        sessionStorage.removeItem(key);
    }

    isExist(key) {
        return sessionStorage.getItem(key) != null;
    }
}

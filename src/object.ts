type Obj = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[K: string]: any | Obj;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getValfromKey = (obj: Obj, key: string, result: any[] = []) => {
	for (const k in obj) {
		if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
			getValfromKey(obj[k], key, result);
		}
		if (k === key) result.push(obj[k]);
	}

	return result;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getKeyFromVal = (obj: Obj, val: any, result: any[] = []) => {
	for (const k in obj) {
		if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
			getKeyFromVal(obj[k], val, result);
		}
		if (obj[k] === val) result.push(obj[k]);
	}

	return result;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function updateVal<T extends object>(obj: T, key: string, value: any): T {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const updateRecursively = (target: any): any => {
		if (typeof target === "object" && target !== null) {
			if (Object.prototype.hasOwnProperty.call(target, key)) {
				return { ...target, [key]: value };
			}

			return Object.fromEntries(Object.entries(target).map(([k, v]) => [k, updateRecursively(v)]));
		}
		return target;
	};

	return updateRecursively(obj) as T;
}

const hasKey = () => {};

const hasVal = () => {};

const hasNull = () => {};

const getAllKeys = () => {};

const getAllVals = () => {};

export { getValfromKey, getKeyFromVal, updateVal, hasKey, hasVal, hasNull, getAllKeys, getAllVals };

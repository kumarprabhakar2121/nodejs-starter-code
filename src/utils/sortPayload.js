function sortObjectKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys); // Recursively sort items in an array
    }

    if (typeof obj === "object" && obj !== null) {
        // Sort the keys of the object
        const sortedObj = {};
        const keys = Object.keys(obj).sort(); // Get and sort keys
        for (let key of keys) {
            sortedObj[key] = sortObjectKeys(obj[key]); // Recursively sort values
        }
        return sortedObj;
    }

    return obj; // Return value if it's not an object or array
}

module.exports = sortObjectKeys;

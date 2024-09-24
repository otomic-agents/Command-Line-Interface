function flattenObject(obj: any, prefix = '') {
    return Object.keys(obj).reduce((acc: any, key) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], pre + key));
        } else {
            acc[pre + key] = obj[key];
        }
        return acc;
    }, {});
}

export function objectToString(obj: any) {
    const flattened = flattenObject(obj);
    return Object.entries(flattened)
        .map(([key, value]) => `${key}=${value}`)
        .join(',');
}
function getRandomInt(maxRange) {
    const randomNumber = Math.floor(Math.random() * Math.floor(maxRange));

    return randomNumber;
}

function deepCopy(objectToCopy) {
    let newObject = {};

    if (typeof objectToCopy !== "object" || objectToCopy === null) {
        return objectToCopy; // Return the value if objectToCopy is not an object
    }

    // Create an array or object to hold the values
    newObject = Array.isArray(objectToCopy) ? [] : {};

    for (const key in objectToCopy) {
        const value = objectToCopy[key];

        // Recursively (deep) copy for nested objects, including arrays
        newObject[key] = deepCopy(value);
    }

    return newObject;
}

function sleepAsync(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export {
    getRandomInt,
    deepCopy,
    sleepAsync
};
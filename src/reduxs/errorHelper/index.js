export function parseRestError(response) {
    if (process.env.NODE_ENV !== 'production') console.log("Parse Error: ", response);
    try {

    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            console.log("parseRestError: " + e);
        }
    }
}
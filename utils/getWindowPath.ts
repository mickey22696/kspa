function tryToGetParamsFromBrowser(endpoint: string) {
    // make sure we don't crash on server side
    if (typeof window === 'undefined') {
        return null;
    }

    const path = window.location.pathname;

    const paramsInEndpoint: string[] = [];
    const endpointMatcher = endpoint
        // find each [foo] part and extract 'foo' from it.
        .replace(/\[([a-z]+)\]/gi, (_, paramName) => {
            // push it to list of params in order they appear
            paramsInEndpoint.push(paramName);

            // replace [foo] with regexp part that will match actual values
            return '([a-zA-Z0-9-]+)';
        })
        // escpae '/' parts of endpoint so we can use it in regexp
        .replace(/\//g, '\\/');

    // create regexp that will pick actual values from window path
    const endpointRegexp = new RegExp(endpointMatcher, 'ig');

    // let's try to match it
    const result = endpointRegexp.exec(path);

    // if current browser path is not matching - give up
    if (!result) {
        return null;
    }

    // we will have actual values as array here in the same order as param names in paramsInEndpoint
    const [, ...routeParamsValues] = result;

    // let's create a map of params
    const paramsFromPath: Record<string, string> = {};

    // now, let's connect param names and values and add results to our map
    routeParamsValues.forEach((value, index) => {
        // index in array of values is the same as index of param name
        const paramName = paramsInEndpoint[index];

        // add it to params map
        paramsFromPath[paramName] = value;
    });

    return paramsFromPath;
}

export default tryToGetParamsFromBrowser;

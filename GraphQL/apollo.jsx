import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    from,
    ApolloLink,
} from '@apollo/client';
import { useMemo } from 'react';
import { onError } from '@apollo/client/link/error';
import cookie from 'js-cookie';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';

let apolloClient;
const serverURL = process.env.NEXT_PUBLIC_API_URL;

//console.log(serverURL);

const createIsomorphLink = createHttpLink({
    uri: `${serverURL}/graphql`,
    // uri: 'https://strapi.lunchb0ne.me/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
    let auth;
    const retCookie = cookie.get('token');
    if (retCookie) {
        auth = { authorization: `Bearer ${retCookie}` };
    } else {
        auth = {};
    }
    // console.log('Created Link with', auth);
    operation.setContext(({ headers }) => ({
        headers: {
            ...auth,
            ...headers,
        },
    }));
    return forward(operation);
});
// setup an onError link to handle all the apollo errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
                    locations
                )}, Path: ${path}`
            )
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: from([errorLink, authLink, createIsomorphLink]),
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                fetchPolicy: 'no-cache',
            },
        },
    });
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract();

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s))
                ),
            ],
        });

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data);
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);
    return store;
}

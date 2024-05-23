'use client'

import { ApolloLink, ApolloProvider, HttpLink } from "@apollo/client";
import { ApolloNextAppProvider, NextSSRApolloClient, NextSSRInMemoryCache, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr";

const makeClient = () => {
    const httpLink = new HttpLink({
        uri: 'http://localhost:4000/graphql',
    })

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link: typeof window === 'undefined' ? 
        ApolloLink.from([
            new SSRMultipartLink({
                stripDefer: true,
            }),
            httpLink,
        ]) : httpLink,
    })
}


export default function ApolloWrapper({
    children
} : {
    children : React.ReactNode
}){
    return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
'use client'
import { createClient } from "@/actions/graphql/client";
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloNextAppProvider, NextSSRApolloClient, NextSSRInMemoryCache, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr";
import Cookies from "js-cookie";



const client = createClient();

export function ApolloWrapper({
 children
} : React.PropsWithChildren){

    return(
        <ApolloProvider client={client}>{children}</ApolloProvider>
    )
}
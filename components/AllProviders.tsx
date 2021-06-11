import { useState, FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';

import { AuthProvider } from '../context/auth';
import { createApolloClient } from '../lib/apolloClient';
import defaultTheme from '../chakra';

const defaultApolloClient = createApolloClient();

type Props = {
  apolloClient?: typeof defaultApolloClient;
  theme?: typeof defaultTheme;
  state?: unknown;
};

/**
 * Renders all context providers
 */
export const AllProviders: FC<Props> = ({
  apolloClient = defaultApolloClient,
  theme = defaultTheme,
  state,
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={state}>
        <ApolloProvider client={apolloClient}>
          <ChakraProvider theme={theme}>
            <AuthProvider>
              <CSSReset />
              {children}
              <ReactQueryDevtools />
            </AuthProvider>
          </ChakraProvider>
        </ApolloProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};

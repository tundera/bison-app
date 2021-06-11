import { useState } from 'react';
import NextLink from 'next/link';
import {
  Link,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Circle,
} from '@chakra-ui/react';
import { gql } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useAuth } from '../context/auth';
import { setErrorsFromGraphQLErrors } from '../utils/setErrors';
import { useSignupMutation } from '../types';
import { EMAIL_REGEX } from '../constants';

import { ErrorText } from './ErrorText';

export const SIGNUP_MUTATION = gql`
  mutation signup($data: SignupInput!) {
    signup(data: $data) {
      token
      user {
        id
      }
    }
  }
`;

/** Form to sign up */
export function SignupForm() {
  const { register, handleSubmit, formState, setError } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [signup] = useSignupMutation();
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Submits the login form
   * @param formData the data passed from the form hook
   */
  async function handleSignup(formData) {
    try {
      setIsLoading(true);
      const { email, password, ...profile } = formData;
      const variables = { data: { email, password }, profile: { create: { profile } } };

      const { data } = await signup({ variables });

      await login(data.signup.token);

      router.replace('/');
    } catch (e) {
      setErrorsFromGraphQLErrors(setError, e.graphQLErrors);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSignup)}>
      <Flex flexDirection="column" justifyContent="center" marginBottom={4}>
        <Circle size="60px" bg="gray.300" color="white" alignSelf="center" />

        <Text as="h2" color="gray.400" fontSize="lg" textAlign="center" marginTop={2}>
          Create an account.
        </Text>
      </Flex>

      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            type="text"
            name="email"
            isInvalid={formState.errors.email}
            {...register('email', {
              required: 'email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'invalid email',
              },
            })}
          />
          <ErrorText>{formState.errors.email && formState.errors.email.message}</ErrorText>
        </FormControl>

        <FormControl id="password">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            name="password"
            isInvalid={formState.errors.password}
            {...register('password', { required: 'password is required', minLength: 8 })}
          />
          <ErrorText>{formState.errors.password && formState.errors.password.message}</ErrorText>
        </FormControl>

        <FormControl id="firstName">
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="firstName"
            isInvalid={formState.errors.firstName}
            {...register('firstName', { required: true })}
          />
          <ErrorText>{formState.errors.firstName && formState.errors.firstName.message}</ErrorText>
        </FormControl>

        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="lastName"
            isInvalid={formState.errors.lastName}
            {...register('lastName', { required: true })}
          />
          <ErrorText>{formState.errors.lastName && formState.errors.lastName.message}</ErrorText>
        </FormControl>
      </Stack>

      <Button type="submit" marginTop={8} width="full" isLoading={isLoading}>
        Signup
      </Button>

      <Flex marginTop={8} justifyContent="center">
        <Text color="gray.500">
          Have an account?{' '}
          <NextLink href="/login" passHref>
            <Link href="#" color="gray.900">
              Sign In
            </Link>
          </NextLink>
        </Text>
      </Flex>
    </form>
  );
}

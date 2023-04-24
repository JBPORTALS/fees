'use client'
import {
    FormControl,
    Input,
    Stack,
    Button,
    Heading,
    FormLabel
  } from '@chakra-ui/react';

export default function Home() {
  return (
    <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={'white'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Reset Password
        </Heading>
        <FormControl id="new password" isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <FormControl id="confirm password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}>
            Submit
          </Button>
        </Stack>
      </Stack>
  )
}

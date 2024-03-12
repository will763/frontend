import { Button, Flex, Heading, Stack, Image, Center, } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { signInMicrosoft, userLogged } = useContext(AuthContext)

  useEffect(() => {
    if(userLogged == undefined){
      signInMicrosoft();
    }
  }, [])

  const handleClick = () => {
    window.location.href = 'https://backend-production-1ae5.up.railway.app/api/v1/auth/microsoft?redirect_url=https://frontend-cyan-omega.vercel.app';
  }

  return (
    <>
      {userLogged ? <Navigate to="/home" />
        : <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
          <Flex p={8} flex={1} align={'center'} justify={'center'}>
            <Stack spacing={4} w={'full'} maxW={'md'}>
              <Heading mb={8} textAlign={'center'} fontSize={'2xl'}>Faça login com sua conta Sysmap</Heading>
              <Stack spacing={6}>
                <Button colorScheme={'blue'} variant={'solid'} onClick={() => handleClick()}>
                  Entrar
                </Button>
                <Center>
                  <Image h={50} src={'https://www.sysmap.com.br/img/logo_sysmap.svg'} />
                </Center>
              </Stack>
            </Stack>
          </Flex>
          <Flex flex={1}>
            <Image
              alt={'Login Image'}
              objectFit={'cover'}
              src={
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
              }
            />
          </Flex>
        </Stack>}
    </>
  );
}

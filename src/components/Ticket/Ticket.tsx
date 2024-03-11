import { Box, Center, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { ITicket } from '../../@Types/Ticket'
import { TicketsOptionsButtons } from '../TicketsOptionsButtons/TicketsOptionsButtons'

export function Ticket({ ticket }: ITicket) {
  function getTimetoSolvedTicket() {
    const entryDate = Date.parse(ticket.data_entrada) //'2022-12-01 T00:00:00'
    const resolvedDate = Date.parse(ticket.data_resolucao)
    const timeToSolved = resolvedDate - entryDate

    const solvedHours = (timeToSolved / (1000 * 60 * 60)) % 24
    const solvedMinutes = (timeToSolved / (1000 * 60)) % 60
    const solvedSeconds = (timeToSolved / 1000) % 60

    const timeInString = `${Math.trunc(solvedHours)}H:${Math.trunc(
      solvedMinutes
    )}M`

    return timeInString
  }

  return (
    <>
      <Flex flexWrap={'wrap'}>
        <Flex width='full'>
          <Box fontSize='sm' width='15%' marginX='2'>
            <Box border='1px'>
              <Text as='b'>
                <Center>chamado:</Center>
              </Text>
              <Text fontSize='md' background='blue.200' paddingX='3'>
                #{ticket.chamado}
              </Text>
            </Box>
            <Box border='1px' marginY='2'>
              <Text as='b'>
                <Center>Entrada:</Center>
              </Text>
              <Text fontSize='sm' background='blue.200' paddingX='3'>
                {ticket.data_entrada}
              </Text>
            </Box>
            <Box border='1px'>
              <Center>
                <Text as='b'>Resolução:</Text>
              </Center>
              <Text fontSize='sm' background='blue.200' paddingX='3'>
                {ticket.data_resolucao}
              </Text>
            </Box>
            <Box border='1px' marginY='2'>
              <Text as='b'>
                <Center>Tempo na fila:</Center>
              </Text>
              <Text fontSize='sm' background='blue.200' paddingX='3'>
                {getTimetoSolvedTicket()}
              </Text>
            </Box>
          </Box>

          <Box fontSize='sm' width='25%' marginX='2'>
            <Box border='1px'>
              <Text as='b'>
                <Center>País:</Center>
              </Text>
              <Text fontSize='md' background='blue.200' paddingX='3'>
                {ticket.pais}
              </Text>
            </Box>
            <Box border='1px' marginY='2'>
              <Text as='b'>
                <Center>Categoria/Problema:</Center>
              </Text>
              <Text
                fontSize='md'
                background='blue.200'
                paddingX='3'
                noOfLines={2}
                height='50px'
                overflow='hidden'
              >
                {ticket.categoria_problema}
              </Text>
            </Box>
            <Box border='1px'>
              <Text as='b'>
                <Center>Tipo de Solicitação:</Center>
              </Text>
              <Text fontSize='md' background='blue.200' paddingX='3'>
                {ticket.tipo_solicitacao}
              </Text>
            </Box>
          </Box>
          <Box fontSize='sm' width='15%' marginX='2'>
            <Box border='1px'>
              <Text as='b'>
                <Center>Status:</Center>
              </Text>
              <Text
                fontSize='md'
                background='blue.200'
                paddingX='3'
                noOfLines={2}
                height='50px'
                overflow='hidden'
              >
                {ticket.status}
              </Text>
            </Box>
            <Box border='1px' marginY='2'>
              <Text as='b'>
                <Center>Quem resolveu:</Center>
              </Text>
              <Text fontSize='md' background='blue.200' paddingX='3'>
                {ticket.quem_resolveu}
              </Text>
            </Box>
            <Box border='1px'>
              <Text as='b'>
                <Center>SLA Estourado:</Center>
              </Text>
              <Text fontSize='md' background='blue.200' paddingX='3'>
                {ticket.sla_estourado}
              </Text>
            </Box>
          </Box>
          <Box fontSize='sm' width='35%' marginX='2'>
            <Box border='1px'>
              <Text as='b'>
                <Center>Detalhes da Resolução:</Center>
              </Text>
              <Text
                fontSize='md'
                background='blue.200'
                paddingX='3'
                noOfLines={6}
                height='150px'
                overflow='hidden'
              >
                {ticket.detalhes_resolucao}
              </Text>
            </Box>
          </Box>
          <TicketsOptionsButtons id={ticket.id}/>
        </Flex>
        {ticket.outras_equipes ? (
          <Flex width='full' mb='3' justifyContent='space-around'>
            <Box border='1px' width='full'>
              <Text as='b'>
                <Center>Outras Equipes:</Center>
              </Text>
              <Text
                fontSize='md'
                background='blue.200'
                paddingX='3'
                noOfLines={1}
                overflow='hidden'
              >
                {ticket.outras_equipes}
              </Text>
            </Box>
            <Box border='1px' width='full'>
              <Center>
                <Text>Subcategoria: </Text>
              </Center>
              <Text
                fontSize='md'
                background='blue.200'
                paddingX='3'
                noOfLines={1}
                overflow='hidden'
              >
                {ticket.subcategoria}
              </Text>
            </Box>
            <Box border='1px' width='full'>
              <Center>
                <Text>Person ID: </Text>
              </Center>
              <Text
                fontSize='md'
                background='blue.200'
                paddingX='3'
                noOfLines={1}
                overflow='hidden'
              >
                {ticket.person_id}
              </Text>
            </Box>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    </>
  )
}

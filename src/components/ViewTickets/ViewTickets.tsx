import { useEffect, useState } from 'react'
import { ChakraProvider, Divider, FormControl, FormLabel, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import {
  IResponseTicket,
  ITicket,
  ResponseTicketType,
  TicketType,
} from '../../@Types/Ticket'
import { useApi } from '../../hooks/useApi'
import { Ticket } from '../Ticket/Ticket'
import { useQuery } from 'react-query'
import { PaginatorComponent } from '../PaginatorComponent/PaginatorComponent'

import { usePagination } from '@ajna/pagination'
import { useForm } from 'react-hook-form'

type Inputs = {
  chamado: string
}

export function ViewTickets() {

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors, isSubmitting },
    resetField
  } = useForm<Inputs>()

  const apiReq = useApi()
  const [ticketsList, setTicketsList] = useState<IResponseTicket>()

  const [ticketsPageList, setTicketsPageList] = useState<ResponseTicketType[]>()

  const pagesQuantity = 8 //ticketsList
  // ? ticketsList.tableAtendimentoEquipeResult.length / 15
  // : 0

  const { currentPage, setCurrentPage } = usePagination({
    initialState: { currentPage: 1 },
  })

  useEffect(() => {
    const getTickets = () => {
      setTicketsPageList(
        ticketsList
          ? ticketsList!.tableAtendimentoEquipeResult.slice(0, 15)
          : []
      )
    }
    getTickets()
  }, [ticketsList])

  const { isLoading, error, data } = useQuery('allTickets', async () => {
    const response = await apiReq.getTickets()

    setTicketsList(response)
  })

  function handlePaginator(nextPage: number) {
    const ticketsInPage =
      ticketsList &&
      ticketsList?.tableAtendimentoEquipeResult.slice(
        (currentPage - 1) * 15,
        currentPage * 15
      )
    ticketsInPage && setTicketsPageList(ticketsInPage)

    setCurrentPage(nextPage)
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Stack>
            <FormControl mr='5%' mb='8'>
              <FormLabel htmlFor='categoria'>
                Deseja Pesquisar um Ticket?
              </FormLabel>
              <Input
                _placeholder={{ color: 'facebook.200' }}
                bg='blue.100'
                id='categoria'
                placeholder='Insira o nº do chamado'
                {...register('chamado', { required: true })}
                w='30%'
              />
            </FormControl>
            {/* <Stack maxHeight='200px' overflowY='scroll'>
                  {tableCategoriesResult.map((item, index) => {
                    if (
                      item.categoria.toLowerCase()
                        .includes(watch('categoria', '').toLowerCase())
                    ) {
                      return (
                        <Stack key={index}>
                          <Text>{item.categoria}</Text>
                        </Stack>
                      )
                    }
                  })}
                </Stack> */}
            <Stack spacing={7}>
              {ticketsPageList &&
                ticketsPageList.map((ticket: ResponseTicketType) => {
                  if(ticket.chamado.includes(watch('chamado')))
                  return (
                    <div key={ticket.id}>
                      <Ticket ticket={ticket} />
                      <Divider borderBottomWidth='4px' borderColor='black' />
                    </div>
                  )
                })}
            </Stack>
            <PaginatorComponent
              currentPage={currentPage}
              handlePaginator={handlePaginator}
              pagesQuantity={pagesQuantity}
            />
          </Stack>
        </>
      )}
    </>
  )
}

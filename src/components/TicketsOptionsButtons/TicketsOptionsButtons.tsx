import { useState } from 'react';

import { IconButton, Stack, useDisclosure, useToast } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useApi } from '../../hooks/useApi'
import { EditModal } from '../EditModal/EditModal';

interface IRequest {
  id: string;
}

export function TicketsOptionsButtons({ id }: IRequest) {
  const useReq = useApi()
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  async function deleteTicket() {

    const deleteTicket = await useReq.deleteTicket(id)

    if (deleteTicket === 203) {
      toast({
        title: "Ticket deletado",
        status: "success",
        duration: 4000,
        isClosable: true,
        onCloseComplete: () => document.location.reload()
      })
    } else {
      toast({
        title: "Algo deu errado",
        status: "error",
        duration: 9000,
        isClosable: true
      })
    }
  }

  function closeModal() {
    onClose()
    document.location.reload()
  }

  return (
    <>
      <Stack>
        <IconButton
          variant='outline'
          colorScheme='blue'
          aria-label='Call Sage'
          fontSize='20px'
          icon={<EditIcon />}
          onClick={onOpen}
        />
        <IconButton
          variant='outline'
          colorScheme='red'
          aria-label='Call Sage'
          fontSize='20px'
          icon={<DeleteIcon />}
          onClick={deleteTicket}
        />
        <EditModal ticketId={`${id}`} open={onOpen} close={closeModal} isOpen={isOpen} />

      </Stack>
    </>
  )
}

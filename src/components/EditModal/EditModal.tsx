import { Button, Container, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import NewTicketForm from '../NewTicketForm/NewTicketForm';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useApi } from '../../hooks/useApi';
import { useState } from 'react';
import { ResponseTicketType, TicketType } from '../../@Types/Ticket';

export interface IModalController {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  ticketId: string;
}

export function EditModal({open, close, isOpen, ticketId}: IModalController) {
  const [ ticketData, setTicketData ] = useState<ResponseTicketType | null>(null)

  const useReq = useApi()
  const { isLoading, error, data } = useQuery('getCategories', async () => {
    const response = await useReq.getTicketById(ticketId)

    response.length > 0 && setTicketData(response[0])

  })

  return (
    <>
      {/* <Button onClick={open}>Open Modal</Button> */}

      <Modal size={'6xl'} closeOnOverlayClick={false} isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent p={'12'}>
          <ModalHeader>Editar Ticket #{`${ticketData && ticketData.id}`}</ModalHeader>
          <ModalCloseButton />
            {!ticketData && <NewTicketForm isEditing={true} />}
           { ticketData && <NewTicketForm isEditing={true} ticketToUpdate={ticketData} />}
          <ModalFooter>
            <Button onClick={close}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

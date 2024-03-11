import { Heading } from "@chakra-ui/react";
import NewTicketForm from "../../components/NewTicketForm/NewTicketForm";

export function NewTicket() {
  return (
    <>
      <Heading mb='10'>Cadastrar Novo Ticket</Heading>
      <NewTicketForm isEditing={false}/>
    </>
  )
}

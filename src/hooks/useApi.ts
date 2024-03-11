import { ICategory } from './../@Types/Category';
import { ResponseTicketType, TicketType } from './../@Types/Ticket';
import { IResponseTicket, ITicket } from "../@Types/Ticket"
import { api } from "../lib/api"
import { ICategoryResponse } from '../@Types/Category';
import { AxiosError } from 'axios';

export const useApi = () => ({
  getTickets: async (): Promise<IResponseTicket> => {
    try {
      const response = await api.get("/v1")

      return response.data
    } catch (error: any) {
      return error.response.status
    }
  },

  getTicketById: async (ticketId: string): Promise<ResponseTicketType[]> => {
    try {
      const response = await api.get(`/v1/id/${ticketId}`)

      return response.data
    } catch (error: any) {
      return error.response.status
    }
  },

  registerTicket: async (ticket: TicketType): Promise<number> => {
    try {
      const response = await api.post("/v1", ticket, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      })
      return response.status
    } catch (error: any) {
      return error.response.status
    }
  },

  updateTicket: async (ticketId: string, ticket: TicketType): Promise<number> => {
    try {
      const response = await api.put(`/v1/id/${ticketId}`, ticket, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
      })
      return response.status
    } catch (error: any) {
      return error.response.status
    }

  },

  deleteTicket: async (ticketId: string): Promise<number> => {
    try {
      const response = await api.delete(`/v1/${ticketId}`)

      return response.status
    } catch (error: any) {
      console.error(error)
      return error.response
    }
  },

  getCategories: async (): Promise<ICategoryResponse> => {
    try {
      const response = await api.get("/v2/categories")

      return response.data
    } catch (error: any) {
      return error.response.status
    }
  },

  registerCategory: async (category: ICategory) => {
    try {
      const response = await api.post("/v2/categories", category, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      })
      return response.status
    } catch (error: any) {
      return error.response.status
    }
  },

  getTicketsTableauPreview: async (ticketNumber: string) => {
    try {
      const response = await api.get(`/v1/natura/${ticketNumber}`)

      return response.data

    } catch (error: any) {

      console.error(error)
    }
  }
})
export interface ITicket {
  ticket: ResponseTicketType
}

export type TicketType = {
  inicio_atendimento: string
  chamado: string
  data_entrada: string
  data_resolucao: string
  tempo_chamado_fila: string
  sla_estourado: string
  categoria_problema: string
  pais: string
  tipo_solicitacao: string
  status: string
  quem_resolveu: string
  outras_equipes: string
  detalhes_resolucao: string
  subcategoria: string
  person_id: string
}

export interface ResponseTicketType extends TicketType{
  id: string;
}

export interface IResponseTicket {
  totalPages?: number
  tableAtendimentoEquipeResult: ResponseTicketType[]
}

export interface ITicketPreview {
  CHAMADO: string
  DT_ABERTURA: number //conversão
  DT_FECHAMENTO: number //conversão
  CLASSE: string
  STATUS: string
  LOCALIDADE: string //conversão
  SLA_VIOLADO: number //conversão
  TEMPO_NA_FILA: number //conversão
}

export interface IResponseTicketPreview {
  tableNaturaResult: ITicketPreview[]
}
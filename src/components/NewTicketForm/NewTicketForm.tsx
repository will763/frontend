import React, { useContext, useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Select,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  Text,
  FormHelperText,
  InputRightElement,
  Checkbox,
  Center,
  Stack,
  useCheckbox,
  chakra,
  FormErrorMessage,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import { Select as ReactSelect, ChakraStylesConfig } from 'chakra-react-select'
import { useNavigate } from 'react-router-dom'
import { IResponseTicketPreview, ResponseTicketType, TicketType } from '../../@Types/Ticket'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useToast } from '@chakra-ui/react'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { FiPlusCircle } from 'react-icons/fi'
import { EditCategorys } from '../EditCategorys/EditCategorys'
import { useApi } from '../../hooks/useApi'
import { ICategory, ICategoryResponse, ICategorySelectOptions } from '../../@Types/Category'

import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

type Inputs = {
  inicio_atendimento: string
  chamado: string
  data_entrada: string
  data_resolucao: string
  sla_estourado: string
  categoria_problema: string
  pais: string
  tipo_solicitacao: string
  status: string
  outras_equipes: string
  detalhes_resolucao: string
  subcategoria: string
  person_id: string
}

export interface IFormTicketProps {
  isEditing: boolean;
  ticketToUpdate?: ResponseTicketType
}

export default function NewTicketForm({isEditing, ticketToUpdate}: IFormTicketProps) {
  const navigate = useNavigate()
  const useReq = useApi()
  const toast = useToast()
  let emptyCategoryList = [{ categoria: '' }]



  const CONVERT_TO_MILISECONDS = 1000

  const [resolvedCalc, setResolvedCalc] = useState('Não Disponível')

  const [isLoadingg, setIsloadingg] = useState(false)

  const [ categorySelectOptionsList, setCategorySelectOptionsList ] = useState<ICategorySelectOptions[]>([])

  const { userLogged } = useContext(AuthContext)
  const [categoryList, setCategoryList] =
    useState<ICategory[]>(emptyCategoryList)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    resetField,
    setValue,
    getValues,
    reset,
  } = useForm<Inputs>()

  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
    useCheckbox()

    let counter = 0

  const { isLoading, error, data } = useQuery('getCategories', async () => {
    const response = await useReq.getCategories()



    response && setCategoryList(response.tableCategoriesResult)

    if (counter < 1) {

      response.tableCategoriesResult.map((categoryObject) => {
        const selectConfig = {
          value: categoryObject.categoria,
          label: categoryObject.categoria
        }

        setCategorySelectOptionsList( categorySelectOptionsList => [...categorySelectOptionsList, selectConfig] )
      })

      counter++
    }
  })

  function verifyTicket(ticketNumber: number) {
    if (ticketNumber === 201) {
      toast({
        title: 'Ticket criado',
        status: 'success',
        duration: 2000,
        isClosable: true,
        onCloseComplete: () => navigate('/home'),
      })
    } else if (ticketNumber === 200){
      toast({
        title: 'Ticket Atualizado',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const tempoNaFila = getTimetoSolvedTicket(
      data.data_entrada,
      data.data_resolucao
    )

    const entryDateString = `${data.data_entrada.substring(
      6,
      10
    )}-${data.data_entrada.substring(3, 5)}-${data.data_entrada.substring(
      0,
      2
    )} ${data.data_entrada.substring(11, 16)}:00`

    const resolvedDateString = `${data.data_resolucao.substring(
      6,
      10
    )}-${data.data_resolucao.substring(3, 5)}-${data.data_resolucao.substring(
      0,
      2
    )} ${data.data_resolucao.substring(11, 16)}:00`

    const startTicketResolution = `${data.inicio_atendimento.substring(
      6,
      10
    )}-${data.inicio_atendimento.substring(3, 5)}-${data.inicio_atendimento.substring(
      0,
      2
    )} ${data.inicio_atendimento.substring(11, 16)}:00`

    const newTicket: TicketType = {
      inicio_atendimento: startTicketResolution,
      chamado: data.chamado,
      data_entrada: entryDateString,
      data_resolucao: resolvedDateString,
      sla_estourado: data.sla_estourado,
      categoria_problema: data.categoria_problema,
      pais: data.pais,
      tipo_solicitacao: data.tipo_solicitacao,
      status: data.status,
      quem_resolveu: userLogged.displayName,
      outras_equipes: data.outras_equipes ? data.outras_equipes : '',
      tempo_chamado_fila: tempoNaFila,
      detalhes_resolucao: data.detalhes_resolucao,
      subcategoria: data.subcategoria,
      person_id: data.person_id,
    }

    if (isEditing && ticketToUpdate) {
      useReq.updateTicket(ticketToUpdate.id, newTicket).then((response) => verifyTicket(response))
    }

    useReq.registerTicket(newTicket).then((response) => verifyTicket(response))
  }

  useEffect(() => {
    if (watch('chamado')) {
      if (watch('chamado').length === 7) {
        setIsloadingg(true)
        reset((formValues) => ({
          ...formValues,
        }))

        useReq
          .getTicketsTableauPreview(watch('chamado'))
          .then((response: IResponseTicketPreview) => {
            if (response) {
              let dataResolucao = new Date(
                response.tableNaturaResult[0].DT_FECHAMENTO
                  ? response.tableNaturaResult[0].DT_FECHAMENTO *
                    CONVERT_TO_MILISECONDS
                  : new Date().getTime()
              )
              let dataResolucaoFormated = `${(
                '00' + dataResolucao.getDate()
              ).slice(-2)}/${('00' + (dataResolucao.getMonth() + 1)).slice(
                -2
              )}/${dataResolucao.getFullYear()} ${(
                '00' + dataResolucao.getHours()
              ).slice(-2)}:${('00' + dataResolucao.getMinutes()).slice(-2)}`

              console.log(dataResolucaoFormated)
              setValue('data_resolucao', dataResolucaoFormated)

              let dataAbertura = new Date(
                response.tableNaturaResult[0].DT_ABERTURA *
                  CONVERT_TO_MILISECONDS
              )
              let dataAberturaFormated = `${(
                '00' + dataAbertura.getDate()
              ).slice(-2)}/${('00' + (dataAbertura.getMonth() + 1)).slice(
                -2
              )}/${dataAbertura.getFullYear()} ${(
                '00' + dataAbertura.getHours()
              ).slice(-2)}:${('00' + dataAbertura.getMinutes()).slice(-2)}`

              setValue('data_entrada', dataAberturaFormated)

              setValue('status', response.tableNaturaResult[0].STATUS)

              setValue('tipo_solicitacao', response.tableNaturaResult[0].CLASSE)

              if (response.tableNaturaResult[0].SLA_VIOLADO > 0) {
                setValue('sla_estourado', 'Sim')
              } else {
                setValue('sla_estourado', 'Não')
              }

              switch (
                response.tableNaturaResult[0].LOCALIDADE.substring(0, 2)
              ) {
                case 'BR':
                  setValue('pais', 'Brasil')
                  break

                case 'MX':
                  setValue('pais', 'Mexico')
                  break

                case 'AR':
                  setValue('pais', 'Argentina')
                  break

                case 'CL':
                  setValue('pais', 'Chile')
                  break

                case 'PE':
                  setValue('pais', 'Peru')
                  break

                case 'MY':
                  setValue('pais', 'Malásia')
                  break

                case 'CO':
                  setValue('pais', 'Colômbia')
                  break

                default:
                  setValue('pais', 'País Não Encontrado')
                  break
              }

              setIsloadingg(false)

              setResolvedCalc(
                getTimetoSolvedTicket(
                  dataAberturaFormated,
                  dataResolucaoFormated
                )
              )
            } else {
              setIsloadingg(false)

              toast({
                title: 'Ticket Não encontrado',
                status: 'error',
                duration: 8000,
                isClosable: true,
              })
            }
          })
          .catch((err) => {
            console.log('bateu no erro')
            console.error(err)
          })
      }
    }
  }, [watch('chamado')])

  function getTimetoSolvedTicket(data_entrada: string, data_resolucao: string) {
    const entryDateString = `${data_entrada.substring(
      6,
      10
    )}-${data_entrada.substring(3, 5)}-${data_entrada.substring(
      0,
      2
    )}T${data_entrada.substring(11, 16)}:00`

    const resolvedDateString = `${data_resolucao.substring(
      6,
      10
    )}-${data_resolucao.substring(3, 5)}-${data_resolucao.substring(
      0,
      2
    )}T${data_resolucao.substring(11, 16)}:00`

    const entryDate = Date.parse(entryDateString) //'2022-12-01 T00:00:00' '2022-12-30 20:38:00'
    const resolvedDate = Date.parse(resolvedDateString)
    const timeToSolved = resolvedDate - entryDate

    const solvedHours = (timeToSolved / (1000 * 60 * 60)) % 24
    const solvedMinutes = (timeToSolved / (1000 * 60)) % 60
    const solvedSeconds = (timeToSolved / 1000) % 60
    const timeInString = `${('00' + Math.trunc(solvedHours)).slice(-2)}:${(
      '00' + Math.trunc(solvedMinutes)
    ).slice(-2)}:00`

    console.log(timeToSolved)
    console.log(solvedHours)

    return timeInString
  }

  function resetFieldOptions() {
    resetField('categoria_problema')
  }

  return (
    <>
      {isLoadingg ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl w={'30%'} mb={8}>
            <FormLabel htmlFor='inicio-atendimento'>Início do atendimento</FormLabel>
            <Input
                defaultValue={ticketToUpdate && ticketToUpdate.inicio_atendimento}
                _placeholder={{ color: 'facebook.200' }}
                bg='blue.100'
                id='data_entrada'
                as={InputMask}
                mask='**/**/**** **:**'
                maskChar={null}
                placeholder='28/11/2022 23:33'
                {...register('inicio_atendimento', { required: true })}

              />
          </FormControl>
          <FormControl width={'30%'} isInvalid={!!errors.chamado}>
            <Center>
              <FormLabel htmlFor='chamado'>Chamado</FormLabel>
              <InputGroup size='sm'>
                <InputLeftAddon
                  bg='gray.50'
                  _dark={{
                    bg: 'gray.800',
                  }}
                  color='gray.500'
                  rounded='md'
                >
                  #
                </InputLeftAddon>
                <Input
                  defaultValue={ticketToUpdate && ticketToUpdate.chamado}
                  _placeholder={{ color: 'facebook.200' }}
                  bg='blue.100'
                  id='chamado'
                  placeholder='4509363'
                  {...register('chamado', {
                    required: true,
                    minLength: {
                      value: 7,
                      message: 'Um ticket possui pelo menos 7 dígitos',
                    },
                  })}
                />
              </InputGroup>
            </Center>
            <FormErrorMessage>
              {errors.chamado && errors.chamado.message}
            </FormErrorMessage>
          </FormControl>
          <Flex>
            <FormControl mr='5%' w={'40%'}>
              <FormLabel htmlFor='data_entrada'>Data de Entrada</FormLabel>
              <Input
                defaultValue={ticketToUpdate && ticketToUpdate.data_entrada}
                _placeholder={{ color: 'facebook.200' }}
                bg='blue.100'
                id='data_entrada'
                as={InputMask}
                mask='**/**/**** **:**'
                maskChar={null}
                placeholder='28/11/2022 23:33'
                {...register('data_entrada', { required: true })}
              />
            </FormControl>
            <FormControl mr='5%' w={'40%'}>
              <FormLabel htmlFor='data_resolucao'>Data de Resolução</FormLabel>
              <Input
                defaultValue={ticketToUpdate && ticketToUpdate.data_resolucao}
                _placeholder={{ color: 'facebook.200' }}
                bg='blue.100'
                id='data_resolucao'
                as={InputMask}
                mask='**/**/**** **:**'
                maskChar={null}
                placeholder='29/11/2022 09:05'
                {...register('data_resolucao', { required: true })}
              />
            </FormControl>
            <Stack>
              <Text textAlign='center' fontWeight='semibold'>
                Tempo que o Chamado Permaneceu na Fila
              </Text>
              <Center>
                <Text color='red.400' fontSize='sm'>
                  {resolvedCalc === 'Não Disponível'
                    ? resolvedCalc
                    : resolvedCalc.substring(0, 5)}
                </Text>
              </Center>
            </Stack>
          </Flex>
          <Flex mt={8} gap={3}>
            <FormControl>
              <FormLabel htmlFor='sla_estourado'>SLA Estourado?</FormLabel>
              <Select
                defaultValue={ticketToUpdate && ticketToUpdate.sla_estourado}
                id='sla_estourado'
                autoComplete='sla_estourado'
                placeholder='Selecione...'
                focusBorderColor='brand.400'
                shadow='sm'
                size='sm'
                w='full'
                rounded='md'
                bg='blue.100'
                {...register('sla_estourado', { required: true })}
              >
                <option>Sim</option>
                <option>Não</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='pais'>País</FormLabel>
              <Select
                defaultValue={ticketToUpdate && ticketToUpdate.pais}
                id='pais'
                autoComplete='pais'
                placeholder='Selecione...'
                focusBorderColor='brand.400'
                shadow='sm'
                size='sm'
                w='full'
                rounded='md'
                bg='blue.100'
                {...register('pais', { required: true })}
              >
                {getValues('pais') ? (
                  <option>{getValues('pais')}</option>
                ) : (
                  <>
                    <option>Argentina</option>
                    <option>Brasil</option>
                    <option>Chile</option>
                    <option>México</option>
                    <option>Colômbia</option>
                    <option>Peru</option>
                    <option>Malásia</option>
                  </>
                )}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='tipo_solicitacao'>
                Tipo de Solicitação
              </FormLabel>
              <Select
                defaultValue={ticketToUpdate && ticketToUpdate.tipo_solicitacao}
                id='tipo_solicitacao'
                autoComplete='tipo_solicitacao'
                placeholder='Selecione...'
                focusBorderColor='brand.400'
                shadow='sm'
                size='sm'
                w='full'
                rounded='md'
                bg='blue.100'
                {...register('tipo_solicitacao', { required: true })}
              >
                {getValues('tipo_solicitacao') ? (
                  <option>{getValues('tipo_solicitacao')}</option>
                ) : (
                  <>
                    <option>Erro</option>
                    <option>Solicitação</option>
                  </>
                )}
              </Select>
            </FormControl>
          </Flex>
          <Flex mt={1} gap={3}>
            <FormControl>
              <Flex align='center' mt='2'>
                <FormLabel htmlFor='categoria_problema'>
                  Categoria/Problema
                </FormLabel>

                {categoryList ? (
                  <EditCategorys
                    resetCategoryField={resetFieldOptions}
                    tableCategoriesResult={categoryList}
                    setListCategory={setCategoryList}
                  />
                ) : (
                  <></>
                )}
              </Flex>
              <ReactSelect
                id='categoria_problema'
                placeholder='Selecione...'
                focusBorderColor='brand.400'
                size='sm'
                options={categorySelectOptionsList}
                chakraStyles={
                  {
                    dropdownIndicator: (provided, state) => ({
                    background: state.isFocused ? "blue.300" : "blue.100",
                  }),
                  option: (provided, state) => ({
                    background: state.isFocused ? "blue.300" : "blue.100",
                  }),
                  container: (provided, state) => ({
                    background: "blue.100",
                    rounded: 'lg',
                    shadow: 'sm',
                    w: 'full',
                    size: 'sm'
                  }),
                }
                }

              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='status'>Status</FormLabel>
              <Select
                defaultValue={ticketToUpdate && ticketToUpdate.status}
                id='status'
                autoComplete='status'
                placeholder='Selecione...'
                focusBorderColor='brand.400'
                shadow='sm'
                size='sm'
                w='full'
                rounded='md'
                bg='blue.100'
                {...register('status', { required: true })}
              >
                {getValues('status') ? (
                  <option>{getValues('status')}</option>
                ) : (
                  <>
                    <option>Aguardando Fornecedor</option>
                    <option>Aguardando Resposta do Usuário Final</option>
                    <option>Aguardando Usuário Final</option>
                    <option>Encaminhado</option>
                    <option>Resolvido</option>
                    <option>Em Andamento</option>
                  </>
                )}
              </Select>
            </FormControl>
          </Flex>
          <Flex my={2} gap={3}>
            <FormControl width={'30%'}>
              <FormLabel htmlFor='quem_resolveu'>Quem Resolveu</FormLabel>
              <Text>{userLogged.displayName}</Text>
            </FormControl>
            <FormControl w='40%'>
              <FormLabel htmlFor='detalhes_resolucao'>
                Detalhes da Resolução
              </FormLabel>
              <Textarea
                defaultValue={ticketToUpdate && ticketToUpdate.detalhes_resolucao}
                id='detalhes_resolucao'
                _placeholder={{ color: 'facebook.200' }}
                bg='blue.100'
                placeholder='Cadastro retornado para rascunho - falta aceite de termos.'
                rows={3}
                maxLength={153}
                shadow='sm'
                focusBorderColor='brand.400'
                fontSize={{
                  sm: 'sm',
                }}
                {...register('detalhes_resolucao', { required: true })}
              />
            </FormControl>
          </Flex>
          <Flex my={2} gap={3}>
            <FormControl>
              <FormLabel htmlFor='subcategoria'>Subcategoria</FormLabel>
              <Input
                defaultValue={ticketToUpdate && ticketToUpdate.subcategoria}
                _placeholder={{ color: 'facebook.200' }}
                bg='blue.100'
                id='subcategoria'
                placeholder=''
                {...register('subcategoria')}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='person_id'>Person ID</FormLabel>
              <Input
                defaultValue={ticketToUpdate && ticketToUpdate.person_id}
                _placeholder={{ color: 'facebook.200' }}
                bg='blue.100'
                id='person_id'
                placeholder=''
                {...register('person_id')}
              />
            </FormControl>
          </Flex>

          {!isEditing && <chakra.label
            display='flex'
            flexDirection='row'
            alignItems='center'
            gridColumnGap={2}
            cursor='pointer'
            {...htmlProps}
          >
            <input {...getInputProps()} />
            <Flex
              alignItems='center'
              justifyContent='center'
              border='2px solid'
              borderColor='blue.500'
              w={4}
              h={4}
              {...getCheckboxProps()}
            >
              {state.isChecked && <Box w={2} h={2} bg='blue.500' />}
            </Flex>
            <Text color='gray.700' {...getLabelProps()}>
              Foi enviado para outras Equipes?
            </Text>
          </chakra.label>}




          {(state.isChecked || isEditing) && (
            <Flex my={2} gap={3}>
              <FormControl>
                <FormLabel htmlFor='outras_equipes'>Outras Equipes</FormLabel>
                <Input
                  defaultValue={ticketToUpdate && ticketToUpdate.outras_equipes}
                  _placeholder={{ color: 'facebook.200' }}
                  bg='blue.100'
                  id='outras_equipes'
                  placeholder='TD-ACCT-SS-MDM'
                  {...register('outras_equipes')}
                />
              </FormControl>
            </Flex>
          )}

          <Button
            w='10rem'
            mt='12'
            colorScheme='blue'
            variant='solid'
            type='submit'
          >
            Registrar Ticket
          </Button>
        </form>
      )}
    </>
  )
}

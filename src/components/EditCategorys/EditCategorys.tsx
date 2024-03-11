import {
  Button,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Flex,
  IconButton,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FiPlusCircle } from 'react-icons/fi'
import { ICategory, ICategoryResponse } from '../../@Types/Category'
import { useApi } from '../../hooks/useApi'

type Inputs = {
  categoria: string
}

interface Props {
  tableCategoriesResult: ICategory[]
  setListCategory: React.Dispatch<React.SetStateAction<ICategory[]>>
  resetCategoryField: () => void;

}

export function EditCategorys({ tableCategoriesResult, setListCategory, resetCategoryField }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const [categoryList, setCategoryList] = useState<ICategory[]>(tableCategoriesResult)
  const useReq = useApi()
  const toast = useToast()

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors, isSubmitting },
    resetField
  } = useForm<Inputs>()

  const saveCategory: SubmitHandler<Inputs> = async (data: ICategory) => {
    const response = await useReq.registerCategory(data)

    if (response === 201) {
      setListCategory((tableCategoriesResult) => [...tableCategoriesResult, data])
      toast({
        title: "Nova categoria criada",
        status: "success",
        duration: 2000,
        isClosable: true
      })
    } else {
      toast({
        title: "Esta categoria já existe",
        status: "error",
        duration: 2000,
        isClosable: true
      })
    }
    resetField('categoria')
  }

  function OpenAndResetOptionsField() {
    onOpen()
    resetCategoryField()
  }

  return (
    <>
      <Flex align='center' mt='-2'>
        <IconButton
          variant='unstyled'
          colorScheme='blue'
          aria-label='Call Sage'
          fontSize='20px'
          icon={<FiPlusCircle />}
          onClick={OpenAndResetOptionsField}
        />
        <Text ml='-4' fontSize='sm'>
          Editar Categorias
        </Text>
      </Flex>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => onClose()}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastrar Nova Categoria</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={isOpen ? handleSubmit(saveCategory) : () => {}}>
            <ModalBody pb={6}>
              <Stack>
                <FormControl mr='5%' mb='8'>
                  <FormLabel htmlFor='categoria'>
                    Insira apenas categorias que não existam
                  </FormLabel>
                  <Input
                    _placeholder={{ color: 'facebook.200' }}
                    bg='blue.100'
                    id='categoria'
                    placeholder='Nova Categoria'
                    {...register('categoria', { required: true })}
                  />
                </FormControl>
                <Stack maxHeight='200px' overflowY='scroll'>
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
                </Stack>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' colorScheme='blue' mr={3}>
                Save
              </Button>
              <Button onClick={() => onClose()}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}


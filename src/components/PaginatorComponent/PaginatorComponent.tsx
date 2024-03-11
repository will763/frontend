import {PropsWithChildren} from 'react'
import { Stack, Text } from "@chakra-ui/react";

import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
} from "@ajna/pagination";

export interface IPaginatorProps {
  pagesQuantity: number;
  currentPage: number;
  handlePaginator: (nextPage: number) => void;
}


export function PaginatorComponent({currentPage, handlePaginator, pagesQuantity}: IPaginatorProps) {
  return (
    //@ts-nocheck
    <Pagination
              pagesCount={pagesQuantity}
              currentPage={currentPage}
              onPageChange={handlePaginator}
            >
              <PaginationContainer align='center' justify='space-between' w='full' p={4}>
                <PaginationPrevious>{'<<'}Página Anterior</PaginationPrevious>
                <Stack direction={'row'}>
                  <Text>
                  {currentPage} de 8
                  </Text>
                </Stack>
                <PaginationNext>Próxima Página {'>>'}</PaginationNext>
              </PaginationContainer>
            </Pagination>
  )
}

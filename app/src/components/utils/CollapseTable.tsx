import { Box, useDisclosure } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,

    //Grid
    Grid,
    GridItem,
    //Modal
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useColorModeValue,
    
  } from '@chakra-ui/react'

  import { TriangleDownIcon } from '@chakra-ui/icons'
 

export function CollapseEx() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    //const { isOpen, onToggle } = useDisclosure()

    const displayTicketsInfo=()=>{
        console.log("goodd");
        onOpen()
    }
  
    return (
      <>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Tickets</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <TableContainer>
                    <Table colorScheme='teal'>
                        <Thead>
                            <Tr>
                                <Th>Type</Th>
                                <Th>Price</Th>
                                <Th>Status </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>DEFAULT</Td>
                                <Td>1 KLAY</Td>
                                <Td>2/100</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>  
                </ModalBody>
            </ModalContent>
        </Modal>
    
        <Box textAlign="left" w='100%' fontSize="xl">
            <Grid w='100%' minH="100vh" templateColumns='repeat(3, 1fr)' p={3}>
                <GridItem w='100%' />
                <GridItem w='100%' >
                <Box w="100%"
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <TableContainer>
                        <Table variant='striped' colorScheme='teal'>
                            <TableCaption>Events  Statistical</TableCaption>
                            <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Contract</Th>
                                <Th isNumeric>Sells ( KLAY) </Th>
                                <Th>Action</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            <Tr>
                                <Td>Neuve</Td>
                                <Td>AZERTYUWXCVJCVBNT345678</Td>
                                <Td isNumeric>100</Td>
                                <Td>
                                    <Button onClick={displayTicketsInfo} size="xs">
                                        <TriangleDownIcon />
                                    </Button>
                                </Td>
                            </Tr>
                            </Tbody>
                            <Tfoot>
                            <Tr>
                                <Th>To convert</Th>
                                <Th>into</Th>
                                <Th isNumeric>multiply by</Th>
                                <Th isNumeric>Action</Th>
                            </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
                </GridItem>
                <GridItem w='100%' />
            </Grid>
        </Box>
      </>
    )
  }

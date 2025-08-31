import { Box, useDisclosure } from '@chakra-ui/react'
import React , { useState, useEffect } from 'react';
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
    
  } from '@chakra-ui/react';
import { useWeb3 } from '../../contexts/Web3Context';

import { TriangleDownIcon } from '@chakra-ui/icons';
import { readAllTicketOwners } from '../../databases/crudTicketsOwner';
import { readAllTickets } from '../../databases/crudTicket';
import { readEvents } from '../../databases/crudEvent';
 
interface TicketOwner {
    contract_address: string;
    owner_adress: string;
    token_id:string;
    ticket_key:string;
    ticket_id:string;
}


interface EventType{
    contract_address:string;
    period:string;
    title:string;
    place:string;
    deployer:string;
  }

  type TicketType = 'GOLD' | 'SILVER' | 'DEFAULT';  

export function Sales() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [ticketsOwners, setTicketsOwners]=useState<{key:string,val:TicketOwner}[]>([]);
    const _account= (useWeb3()).account;
    const _provider=(useWeb3())._provider;
    const [events, setEvents]=useState<{key:string,val:EventType}[]>();
    
    const [tickets, setTickets]=useState<{val:{eventId:"",type: TicketType,places_limit: number, price:number},key:string}[]>([
        {val: {
          eventId: '',
          type: 'DEFAULT',
          places_limit: 0,
          price: 0,
        },
        key: ''
        }
      ])
    const getAllTickets=async()=>{
        const _tickets=await readAllTickets();
        setTickets(_tickets);
      }
    useEffect(()=>{
        getEvents()
        loadTickets()
        getAllTickets()
     
    },[_account])
    
    const getEvents=async ()=>{
        const _events=await readEvents();
        setEvents(_events);
    }
    
    const loadTickets= async ()=>{
      try {
        setTicketsOwners([]);
        if(_provider!=undefined){
          let ticketOwners:{val:TicketOwner,key:string }[]=[{val:{contract_address:"",owner_adress:"",token_id:"", ticket_key:"", ticket_id:""},key:""}]
          ticketOwners= await readAllTicketOwners();
          //const _ticketsOwners=ticketOwners.filter((ticketOwner)=>ticketOwner.val.owner_adress===_account);
          
          setTicketsOwners(ticketOwners);
        }
      
  
      } catch (error) {
        console.log("error when loading ticket owners", error)
      }
    }
    //const { isOpen, onToggle } = useDisclosure()

    const displayTicketsInfo=async (eventId:string)=>{
        //console.log("goodd");
        const _tickets=await readAllTickets();
        const __tickets=  _tickets?.filter((ticket) => ticket?.val?.eventId ===eventId);
        setTickets(__tickets)

        //setTimeout(() => {
            onOpen()
        //}, 5000);
        
    }
  
    return (
      <>
         <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
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
                                    <Th>Place limit</Th>
                                    <Th>Price</Th>
                                    <Th>saled</Th>
                                    <Th>total ("ETH")</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                    {tickets?.map((ticket, index) =>(
                                        <Tr key={index}>
                                            <Td>{ticket?.val?.type}</Td>
                                            <Td>{ticket?.val?.places_limit}</Td> 
                                            <Td>{ticket?.val?.price}</Td>
                                            
                                            <Td>{
                                                (ticketsOwners?.filter((ticketsOwner)=> ticketsOwner?.val?.ticket_id == ticket.key)).length
                                            }
                                            </Td>
                                            <Td>{
                                                (ticketsOwners?.filter((ticketsOwner)=> ticketsOwner?.val?.ticket_id == ticket.key)).length*ticket?.val?.price
                                            }
                                            </Td>
                                                   
                                        </Tr>
                                    )) 
                                    }
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
                               
                                <Th>Action</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            {events?.filter((event) => event?.val?.contract_address?.length>1  && event.val.deployer ===_account)
                             .reverse().map((event,index)=>(
                                // ticketsOwners?.filter((ticketsOwner)=> ticketsOwner?.val?.contract_address == event?.val?.contract_address)
                                    // .map((ticketsOwner)=>(
                                        <Tr key={index}>
                                            <Td>{event?.val.title}</Td>
                                            <Td>{event?.val?.contract_address}</Td>
                                           
                                            <Td>
                                                <Button onClick={()=>{displayTicketsInfo(event?.key)}} size="xs">
                                                    <TriangleDownIcon />
                                                </Button>
                                            </Td>
                                        </Tr>           
                                        // )
                                    // )
                             ))}
                           
                            </Tbody>
                            <Tfoot>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Contract</Th>
                                
                                <Th>Action</Th>
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

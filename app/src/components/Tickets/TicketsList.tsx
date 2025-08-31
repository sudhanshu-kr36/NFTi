import {
  Box,
  Button,
  Heading,
  Text,
  GridItem,
  AlertStatus,
  Spinner,
  Stack,
  HStack
} from '@chakra-ui/react';
import React , {useState, useEffect , useRef} from 'react';
import { Grid } from '@chakra-ui/react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EventTicket from './TicketForm';
import html2canvas from 'html2canvas';
import handleImageUpload from '../../IpfsClient';

import { storeEvent, readEvents } from '../../databases/crudEvent';
import {ethers} from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';
import { purchaseTicket, isDeployer } from '../../scripts/deploy';
import { readAllTickets } from '../../databases/crudTicket';
import { storeTicketOwner } from '../../databases/crudTicketsOwner';
import {CustomAlert} from '../utils/Alert';
import generateRandomString from '../utils/randomString';
import { readAllTicketOwners } from '../../databases/crudTicketsOwner';
import { PlusSquareIcon , DragHandleIcon} from '@chakra-ui/icons';

type TicketType = 'GOLD' | 'SILVER' | 'DEFAULT';

interface TicketOption {
  eventId:string
  type: TicketType;
  places_limit: number;
  price:number;
}

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

export default function BuyTicket() {
  const [alertMessage, setAlertMessage]= useState<string>('');
  const [alertStatus, setAlertStatus]= useState<AlertStatus>("info");
  const [displayAlert, setDisplayAlert]=useState<boolean>(false);
  const [displaySpinner, setDisplaySpinner]=useState<boolean>(false);
  const [events, setEvents]=useState<{key:string,val:EventType}[]>();
  const [tickets, setTickets]=useState<{val:{eventId:"",type: TicketType,places_limit: number, price:number},key:string}[]>([
    {val: {
      eventId: '',
      type: 'GOLD',
      places_limit: 100,
      price: 50,
    },
    key: 'default-ticket'
    }
  ])
  const boxRefs = useRef<{ key: string; element: HTMLDivElement | null }[]>([]);
  const [ticketsOwners, setTicketsOwners]=useState<{key:string,val:TicketOwner}[]>([]);
  const _displayAlert =()=>{
    setDisplayAlert(true);
    setTimeout(()=>{
      setDisplayAlert(false);
    },5000)
  }
  const _provider=(useWeb3())._provider;
  const account=(useWeb3()).account;
  
  const signer=(useWeb3()).signer;
  const getEvents=async ()=>{
    const _events=await readEvents();
    //console.log("the events", _events);
    setEvents(_events);
  }
  const getAllTickets=async()=>{
    const _tickets=await readAllTickets();
    setTickets(_tickets);
  }
  const random_string=generateRandomString()

  useEffect(()=>{
      loadTicketOwners()
  },[account])

  const loadTicketOwners= async ()=>{
    try {
      setTicketsOwners([]);
      if(_provider!=undefined){
        let ticketOwners:{val:TicketOwner,key:string }[]=[{val:{contract_address:"",owner_adress:"",token_id:"", ticket_key:"", ticket_id:""},key:""}]
        ticketOwners= await readAllTicketOwners();
       
        
        setTicketsOwners(ticketOwners);
      }
    

    } catch (error) {
      console.log("error when loading ticket owners", error)
    }
  }
  const _purchaseTicket=async (_id:string,ticket_key:string,amount:string,type:string,contract_address:string,ticket_id:string)=>{
    //let's get the contract instance
    setDisplaySpinner(true);
    try {
      
     
    if(contract_address.length>1){
          //const boxElement = boxRefs.current.find((ref) => ref.key === type)?.element;
          console.log("the box refs ", boxRefs.current)
          console.log("the id ", _id)
          const boxElement = boxRefs.current.find((ref) => ref.key === _id)?.element;
          const ticketElement=boxElement?.firstChild as HTMLElement;
      //const boxElement = document.getElementById('ticket-box-'+type);
          if (ticketElement) {
                html2canvas(ticketElement).then(async (canvas: HTMLCanvasElement) => {
                    const ticketImage = canvas.toDataURL('image/png');
                    // Do something with the ticket image, such as save or display it
                    try {
                      handleImageUpload(ticketImage).then((cid:string)=>{
                        console.log("the cid ====", cid);
                        let uri="https://ipfs.io/ipfs/"+cid;
                        
                       
                        purchaseTicket(_provider,uri,type,amount,contract_address).then((result)=>{
                            console.log("the result ", result);
                            if(result?.status==1){
                              storeTicketOwner({ticket_id:ticket_id,contract_address:contract_address,owner_adress:account!,token_id:result.tokenId,ticket_key:ticket_key})
                              setAlertMessage("Nft contract purchased successfully");
                              setAlertStatus("success")
                              _displayAlert();
                              loadTicketOwners();
                            }
                            else{
                              setAlertMessage("Oups something went wrong !");
                              setAlertStatus("error");
                              _displayAlert();
                            }
                            setDisplaySpinner(false);
                        })
                      })
                    } catch (error) {
                      console.log(error)
                      console.log("Error when uploading to file to ipfs")
                      setDisplaySpinner(false);
                      setAlertMessage("Oups something went wrong !");
                      setAlertStatus("error")
                      _displayAlert();
                    }
                });
           }
           else{
            console.log("can't find ticket element");
            setDisplaySpinner(false);
            setAlertMessage("Oups something went wrong !");
            setAlertStatus("error")
            _displayAlert();
           }
    }else{
      console.log("can't get contract_address");
      setDisplaySpinner(false);
      setAlertMessage("Oups something went wrong !");
      setAlertStatus("error")
      _displayAlert();
    }
  }
    catch (error) {
      setDisplaySpinner(false);
      console.log("errror when deploying", error)
      setAlertMessage("Oups something went wrong !");
      setAlertStatus("error")
      _displayAlert();
    }
    
  }
  useEffect(()=>{
    getEvents()
    getAllTickets()
  },[])
  
  return (
    <>
    {displaySpinner && (
      <>
      <Spinner/><span>wait for transaction</span>
      </>
    )
    }
    {displayAlert && (
      <CustomAlert message={alertMessage} status={alertStatus} />
    )
    }
    <Stack spacing={8}  w={"100%"} px={12}>
       
      
        {
          <Text fontSize='xs' textAlign="center" color={'gray.400'}>If the list is empty then you're the only seller now and you can't buy your own ticket! </Text>
        /* <Stack align={'center'}>
            <Heading fontSize={'xl'}>TICKETS MARKET</Heading>
            <Text fontSize='xs' color={'gray.600'}>If the list is empty then you're the only seller now and you can't buy your own ticket! </Text>
        </Stack> */}
        <Box textAlign="left" w='100%' fontSize="xl">
              {events ?(
                <>
                
                {events?.filter((event) => event?.val?.contract_address?.length>1  && event.val.deployer !==account)
                .reverse().map((event,index)=>(
                  
                  <div key={index}>
                    <br />
                    <Grid templateColumns='repeat(3, 1fr)' gap={2}>
                        <GridItem key={event?.key} w='100%' colSpan={3}   >
                          <Heading fontSize='1xl'>{event?.val?.title}</Heading>
                          <Text fontSize='xs'>Contract address: {event.val.contract_address}</Text>
                          
                        </GridItem>
                        {tickets?.filter((ticket) => ticket?.val?.eventId === event.key)
                        .map((ticket,_index) => (
                          
                          <GridItem key={ticket?.key} w='100%'  >
                            <div  key={_index} style={{backgroundColor:'transparent', width: '100%' }}  ref={(ref) => { boxRefs.current.push({ key: ticket?.key, element: ref }) ; }} id={'ticket-box-'+ticket?.val?.type} >
                              <EventTicket _key={random_string+_index.toString()} price={ticket?.val?.price} id={""}  eventName={event.val.title} ticketType={ticket?.val?.type} placeLimit={ticket?.val?.places_limit} date={event?.val?.period} contract_address={event.val.contract_address} place={event?.val?.place} owner={account} />
                              {
                                (ticketsOwners?.filter((ticketsOwner)=> ticketsOwner?.val?.ticket_id == ticket.key)).length
                                ==ticket.val.places_limit?(
                                  <Grid w='100%'  templateColumns='repeat(2, 1fr)'>
                                    <GridItem w='100%' >
                                      <Button disabled colorScheme='red' >Sold Out</Button> 
                                    </GridItem>
                                    <GridItem w='100%'  >
                                      <Text fontSize={'sm'}> Available: {ticket.val.places_limit-(ticketsOwners?.filter((ticketsOwner)=> ticketsOwner?.val?.ticket_id == ticket.key)).length}</Text>
                                    </GridItem>
                                  </Grid>
                                  
                                ):(
                                  <>
                                  <Grid w='100%'  templateColumns='repeat(2, 1fr)'>
                                    <GridItem w='100%' >
                                      <Button colorScheme='blue' bg={'blue.500'} onClick={()=>{_purchaseTicket(ticket.key,random_string+_index.toString(),(ticket.val.price).toString(),ticket.val.type,event.val.contract_address,ticket?.key)}}><PlusSquareIcon/>&nbsp; Get Ticket </Button>
                                    </GridItem>
                                    <GridItem w='100%'  >
                                      <Text fontSize={'sm'}> Available: {ticket.val.places_limit-(ticketsOwners?.filter((ticketsOwner)=> ticketsOwner?.val?.ticket_id == ticket.key)).length}</Text>
                                    </GridItem>
                                  </Grid>

                                  </>
                                  )
                              }
                              
                            </div>
                          </GridItem>
                        
                        ))}
                      
                    </Grid>
                  </div>
                ))}

                </>
              ):(
                <Stack align={'center'}>
                   
                    <Text fontSize='xs' color={'gray.600'}>If the list is empty then you're the only seller now and you can't buy your own ticket! </Text>
                </Stack> 
              )}
        </Box>
  
    </Stack>
  
    </>
  );
}

export  function DeployerTickets() {
  
  const [events, setEvents]=useState<{key:string,val:EventType}[]>();
  const [tickets, setTickets]=useState<{val:{eventId:"",type: TicketType,places_limit: number, price:number},key:string}[]>([
    {val: {
      eventId: '',
      type: 'GOLD',
      places_limit: 100,
      price: 50,
    },
    key: 'default-ticket'
    }
  ])
    
  const _provider=(useWeb3())._provider;
  const account=(useWeb3()).account;
  
  const signer=(useWeb3()).signer;
  const getEvents=async ()=>{
    const _events=await readEvents();
    console.log("the events", _events);
    setEvents(_events);
  }
  const getAllTickets=async()=>{
    const _tickets=await readAllTickets();
    setTickets(_tickets);
  }


  useEffect(()=>{
    getEvents()
    getAllTickets()
  },[account])
  
  return (
    <Stack  mx={'auto'} w={"100%"} px={12}>
      <Box textAlign="left" w='100%' fontSize="xl" >
            {events &&(
              <>
              <Text fontSize='xs'  textAlign="center" color={'gray.400'}>If the list is empty this mean you didn't create any event yet </Text>
              {events?.filter((event) => event?.val?.contract_address?.length>1  && event.val.deployer ===account).reverse()
              .map((event,index)=>(
                <div key={index}>
                  <br />
                  <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                      <GridItem key={event?.key} w='100%' colSpan={3}   >
                        
                        <Heading fontSize='1xl'>{event?.val?.title}</Heading>
                        <Text fontSize='xs'>Contract address: {event.val.contract_address}</Text>
                      </GridItem>
                      {tickets?.filter((ticket) => ticket?.val?.eventId === event.key)
                      .map((ticket,_index) => (
                        
                        <GridItem key={ticket?.key} w='100%'  >
                          <div key={_index} style={{width:"100%"}}>
                            <EventTicket  price={ticket?.val?.price}  id={""} eventName={event.val.title} ticketType={ticket?.val?.type} placeLimit={ticket?.val?.places_limit} date={event?.val?.period} contract_address={""} place={event?.val?.place} owner={""} />
                          </div>
                        </GridItem>
                      
                      ))}
                    
                  </Grid>
                </div>
              ))}

              </>
            )}
      </Box>
    </Stack>
  );
}
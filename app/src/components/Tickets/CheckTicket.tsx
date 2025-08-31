import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  VStack,
  Link,
  Select,
  useColorModeValue,
  Tag,
  TagCloseButton,
  TagLabel,
  GridItem,
  AlertStatus,
  Spinner,
  Image
} from '@chakra-ui/react';
import React , {useState, useRef, useEffect } from 'react';
import { Grid } from '@chakra-ui/react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EventTicket from './TicketForm';
import html2canvas from 'html2canvas';
import handleImageUpload from '../../IpfsClient';


import { storeEvent, readEvents } from '../../databases/crudEvent';
import {ethers} from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';
import { purchaseTicket, loadBuyerTickets } from '../../scripts/deploy';
import { readAllTickets } from '../../databases/crudTicket';
import {CustomAlert} from '../utils/Alert';
import { readAllTicketOwners, updateTicketOwner } from '../../databases/crudTicketsOwner';
import { QrReader } from 'react-qr-reader';

interface TicketOwner {
  contract_address: string;
  owner_adress: string;
  token_id:string;
  ticket_key:string;
  ticket_id:string;
  is_checked?:boolean;
}


type TicketType = 'GOLD' | 'SILVER' | 'DEFAULT';

interface TicketOption {
  eventId:string
  type: TicketType;
  places_limit: number;
  price:number;
}

interface EventType{
  contract_address:string;
  period:string;
  title:string;
  place:string;
  deployer:string;
}

interface TicketOwner {
  contract_address: string;
  owner_adress: string;
  token_id:string;
  ticket_key:string;
  ticket_id:string;
  is_checked?:boolean;
}

export  function CheckTicket() {
  const [alertMessage, setAlertMessage]= useState<string>('');
  const [alertStatus, setAlertStatus]= useState<AlertStatus>("info");
  const [displayAlert, setDisplayAlert]=useState<boolean>(false);
  const [displaySpinner, setDisplaySpinner]=useState<boolean>(false);
  const [eventContract, setEventContract] = useState<string>('');
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const [ticketKey, setTicketKey] = useState<string>('');
  const video = useRef<HTMLVideoElement>(null);
  var  ref = useRef(null);
  const [delayScan , setDelayScan] = useState(500);
  const [uris, setUris]=useState<string[]>([""]);
  const _provider=(useWeb3())._provider;
  const [qrScanner, setQrScanner] = useState<typeof QrReader>();
  const [ticketsOwners, setTicketsOwners]=useState<{key:string,val:TicketOwner}[]>([]);
  const [_ticketOwner, setTickeOwner]=useState<{val:TicketOwner,key:string}>({val:
    {contract_address:"",owner_adress:"",token_id:"", ticket_key:"", ticket_id:""},key:""});
  const [events, setEvents]=useState<{key:string,val:EventType}[]>();
  const _displayAlert =()=>{
    setDisplayAlert(true);
    setTimeout(()=>{
      setDisplayAlert(false);
    },5000)
  }
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  let mediaStreams: MediaStream[] = [];
  const [cameraActive, setCameraActive] = useState(false);


  const getEvents=async ()=>{
    
    const _events=await readEvents();
    setEvents(_events);
  }
  const stopCamera = () => {
     // Start the camera stream
    console.log("stop cameras called")
    // Get all media streams currently active in the browser
    navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        if (device.kind === 'videoinput') {
          navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            mediaStreams.push(stream);
          });
        } else if (device.kind === 'audioinput') {
          navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            mediaStreams.push(stream);
          });
        }
      });
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
    if(mediaStreams.length>1){
      console.log("we get all medias");
      mediaStreams.forEach((stream) => { 
        console.log("the current stream === ", stream.getTracks());
        stream.getTracks().forEach((track) => track.stop());
      });
    }


    // if (mediaStreamRef.current) {
    //   console.log("stop camera called 2");
    //   mediaStreamRef.current.getTracks().forEach(track => track.stop());
    //   mediaStreamRef.current = null;
    // }
  };
  const _account= (useWeb3()).account;
  const [scannerActive, setScannerActive] = useState(false);
  //const qrReader:typeof QrReader = React.createRef();

  useEffect(() => {
    // Check if the camera is active when the component mounts
    checkCameraAccess();

    // Listen for the user's media devices (camera) changes
    navigator.mediaDevices.ondevicechange = () => {
      checkCameraAccess();
    };

    return () => {
      // Clean up the event listener when the component unmounts
      navigator.mediaDevices.ondevicechange = null;
    };
  }, []);

  useEffect(()=>{
    getEvents()
  },[_account])

  const validateTicket= async () => {
    console.log('validate called');
    setDisplaySpinner(true);
    try {
      if(_ticketOwner?.val.contract_address.length>1){
        _ticketOwner.val.is_checked=true
        await updateTicketOwner(_ticketOwner?.key,_ticketOwner?.val);
        //setTickeOwner(_ticketOwner=>_ticketOwner.val.is_checked=true);
        setAlertMessage("Chicket validated");
        //_loadUris();
        setAlertStatus("success")
        _displayAlert()
        setDisplaySpinner(false);
      }else{
        setAlertMessage("oups can't find corresponding ticket ");
        setAlertStatus("error")
        _displayAlert()
        setDisplaySpinner(false);
      }
    } catch (error) {

      setAlertMessage("Oups something went wrong !");
      setAlertStatus("error")
      _displayAlert()
      setDisplaySpinner(false);
      console.log("error : ", error )
      
    }
  }

  const checkCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Camera access is active
      setCameraActive(true);
      
      // Close the camera stream immediately to free up resources
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (error) {
      // Camera access is not active
      setCameraActive(false);
    }
  };

  const _findTicketInfos=async()=>{

  }
  
  const  _loadUris=async()=>{
    //console.log("load uris called ")
    console.log("load uris called==== ", ticketKey)
    {setUris([])}
    if(!scannerActive)
    {
      
      setDisplaySpinner(true);
      const _uris: string[]=[]
      try {
        
        if( ticketKey){
          console.log("load uris called ")
          let ticketOwners:{val:TicketOwner,key:string}[]=[{val:{contract_address:"",owner_adress:"",token_id:"", ticket_key:"", ticket_id:""},key:""}]
          ticketOwners= await readAllTicketOwners();
          const _ticketsOwners: typeof ticketOwners=[];
          await Promise.all(ticketOwners.map((ticketOwner)=>{
            if( ticketOwner.val.ticket_key ==ticketKey)
            {
              setOwnerAddress(ticketOwner.val.owner_adress)
              setEventContract(ticketOwner.val.contract_address)
              console.log("finded ", ticketOwner);
              _ticketsOwners.push(ticketOwner)
              //return ticketOwner
            }
          }));
          //console.log("the ticket owners" , ticketOwners)
          //const _ticketsOwners= await Promise.all(ticketOwners.filter((ticketOwner)=> ));
          
          if(_ticketsOwners)
          {
            const _ownerAddress= _ticketsOwners[0].val.owner_adress
            const _eventContract= _ticketsOwners[0].val.contract_address
            if( _ticketsOwners[0].val.contract_address.length>5){

            
            setTickeOwner(_ticketsOwners[0]);
            const currentUris= await loadBuyerTickets(_provider,_eventContract, _ownerAddress, _ticketsOwners[0]?.val?.token_id.toString())
            // setEventContract('null');
            // setOwnerAddress('null');
            // const contractElement=document.getElementById("contract_")as HTMLInputElement;
            // if(contractElement){
            //   contractElement.value='';
            // }
            //setUris([]);
            //console.log("the event contract ", eventContract.toString());
            //console.log("the owner address ", ownerAddress.toString());
            if(currentUris && currentUris.length>0 )
            {
              console.log("the current urils ", currentUris)
              
              await Promise.all(
                currentUris?.map((currentUri)=>{
                  if(currentUri!==null){
                    _uris.push(currentUri);
                  }
                  
                })
              );
              setAlertMessage("Chicket(s) finded");
              setAlertStatus("success")
              _displayAlert()
              setUris(_uris);
            }else{
              setAlertMessage("no ticket finded for this event");
              setAlertStatus("error")
              _displayAlert()
            }
          }else{
            setAlertMessage("no ticket finded for this event");
            setAlertStatus("error")
            _displayAlert()
          }
          }else
          {
            setAlertMessage("no ticket finded for this event");
              setAlertStatus("error")
              _displayAlert()
          }
        
          setDisplaySpinner(false);
          
        }
      } catch (error) {
        setAlertMessage("Oups something went wrong !");
        setAlertStatus("error")
        _displayAlert()
        setDisplaySpinner(false);
        console.log("error : ", error )
      }
    }
    
    
    
    
  
  }
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
    <Box textAlign="left" w='100%' fontSize="xl">
    <Grid w='100%' minH="100vh" p={3}>
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} >
        <Stack spacing={4} w={'full'} maxW={'md'}>
        <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Verify Attendee</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Scan Qr code ✌️
            </Text>
          </Stack>
          <Box w="100%"
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
           {scannerActive && (
            <Stack spacing={4} w={'100%'}>
           
              <QrReader
                  scanDelay={delayScan} 
                  //videoId={videoId}
                  onResult={async (result, error) => {
                      if (!!result) {
                      //handleScan(result);
                      //console.log("the result ==== ", result)
                      try {
                        var resultText={_key:""};
                        resultText=JSON.parse((result.getText()).toString())
                        console.log("the scan result ", resultText);
                        if(resultText._key.length>5  ){
                      
                          setTicketKey(resultText?._key)
                          setTimeout(()=>{
                            setScannerActive(false);
                            checkCameraAccess();
                          },2000)
                          
                          
                          
                        }
                        
                      } catch (error) {
                        console.log("the erooottt ", error)
                        //setScannerActive(false);
                      }
                      
                      }
            
                      if (!!error) {
                          //console.log("error==== ", error);
                      }
                    }}
                  //onScan={handleScan}
                  //style={{ width: '100%' }}
                  constraints={{ facingMode: 'user' }}
                />
                      
            </Stack>
             )} 
            <Stack spacing={10}>
                {!scannerActive && (
                  
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    onClick={()=>setScannerActive(true)}
                    _hover={{
                      bg: 'blue.500',
                    }}>
                    scan 
                  </Button>
                )}
                {ticketKey.length>5 && !scannerActive && (
                  <>
                  <FormControl id="_ticket_key">
                  <FormLabel>Ticket Key</FormLabel>
                    <Input type="text" value={ticketKey} id='ticket_key_' onChange={(event)=>{setTicketKey(event.target.value)}} readOnly/>
                  </FormControl>
                  
                  <Button
                      bg={'red.400'}
                      color={'white'}
                      onClick={()=>_loadUris()}
                      _hover={{
                        bg: 'red.500',
                      }}>
                      check ticket 
                  </Button>
                  </>
                 )}
              </Stack>   
          </Box>
        
        </Stack>
      </Flex>
      <Flex flex={1} h={'100%'}>
        <VStack  align='stretch' >
        {uris && uris[0]?.length>1 &&(
          <>
            {uris.map((uri,index)=>{
             
            return(
              <Box boxSize='sm' key={index}>
                <Image src={uri}  />
                {_ticketOwner?.val?.is_checked==true? (
                  <Text fontSize="xl" textAlign="center" my={2} bg={"red.500"} >
                     {" ALREADY VERIFIED"}<br/>
                  </Text>   
                ):(
                  <>
                  <Text fontSize="xl" textAlign="center" my={4} bg={"green.500"} >
                    {" VALIDATION REQUIRED "} <br/>
                  </Text>

                  {events &&(
                    events?.filter((event) => event?.val.deployer.toLocaleLowerCase() == _account?.toLocaleLowerCase() && event?.val?.contract_address == _ticketOwner?.val?.contract_address).length>0 &&(
                      <Button onClick={()=>{validateTicket()}}>valid</Button>
                    ))}
                 
                 </>
                )}
                
              </Box>
            )
          })}
          </> 
        )}
        </VStack >
        </Flex>
      </Stack>
    </Grid>
</Box>
</>
  );
}
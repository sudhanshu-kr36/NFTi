import {
  Box,
  Image,
  Stack,
  Grid,
  Text,
  Button,
  Heading,
  //card
  Card, CardHeader, CardBody, CardFooter,
  Divider
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons'

import React , { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { loadOwnerTickets } from '../../scripts/deploy';
import { readAllTicketOwners } from '../../databases/crudTicketsOwner';
import { ethers } from "ethers";


interface TicketOwner {
  contract_address: string;
  owner_adress: string;
  token_id:string;
  ticket_key:string;
  ticket_id:string;
}

export default function MyTickets() {
 
  const [uris, setUris]=useState<string[]>([""]);
  const [ticketsOwners, setTicketsOwners]=useState<{key:string,val:TicketOwner}[]>([]);
  const _account= (useWeb3()).account;
  const _provider=(useWeb3())._provider;
  
  useEffect(()=>{
   
    loadTickets()
   
  },[_account])

  useEffect(()=>{
    _loadUris();
   
  },[ticketsOwners])

  const loadTickets= async ()=>{
    try {
      setTicketsOwners([]);
      if(_provider!=undefined){
        let ticketOwners:{val:TicketOwner,key:string }[]=[{val:{contract_address:"",owner_adress:"",token_id:"", ticket_key:"", ticket_id:""},key:""}]
        ticketOwners= await readAllTicketOwners();
        const _ticketsOwners=ticketOwners.filter((ticketOwner)=>ticketOwner.val.owner_adress===_account);
        
        setTicketsOwners(_ticketsOwners);
      }
    

    } catch (error) {
      console.log("error when loading ticket owners", error)
    }
  }

  const download = (imageUrl: string) => {
    fetch(imageUrl, {
      method: "GET",
      headers: {},
    })
      .then(response => {
        response.arrayBuffer().then(function(buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); // Change the filename and extension as needed
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const  _loadUris=async()=>{
    if(ticketsOwners.length>0){
      const _uris: string[]=[]
      const uniqueCombinations = new Set<string>();

      await Promise.all(

        ticketsOwners.map(async (ticketOwner) => {
          const combination = `${ticketOwner.val.contract_address}-${ticketOwner.val.owner_adress}`;
      
          if (!uniqueCombinations.has(combination)) {
            uniqueCombinations.add(combination);
      
            const currentUris = await loadOwnerTickets(ticketOwner.val.contract_address, _provider);
            console.log("the uris", currentUris);
      
            currentUris?.forEach((ownedNft) => {
              _uris.push(ownedNft);
            });
          }
        })
        // ticketsOwners.map(async (ticketOwner)=>{
        //   const currentUris= await loadOwnerTickets(ticketOwner.val.contract_address, _provider)
        //   console.log("the uris", currentUris)
        //   currentUris?.map((ownedNft)=>{
             
        //       _uris.push(ownedNft);
        //   })
        // })
        
       
        );
      setUris(_uris);
  }
  }

  
  

  
  return (
    <Stack  mx={'auto'} w={"100%"} px={12}>
          {/* <Stack align={'center'}>
              <Heading fontSize={'xl'}>YOUR TICKETS LIST</Heading>
              <Text fontSize={'xs'} color={'gray.600'}>
              If the list is empty this mean you d'ont buy any ticket yet !
              </Text>
          </Stack> */}
          <Box textAlign="left" w='100%' fontSize="xl">
            
          {uris ?(
            
            <>
            <Grid templateColumns='repeat(3, 1fr)' gap={3}>
              {uris.reverse().map((uri,index)=>{
                return(
                  <>
                    <Card key={index} maxW='sm'>
                    <CardBody>
                      <Image  src={uri} />
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Button
                        //as="a" // Render as anchor
                        colorScheme='blue' bg={'blue.500'}
                        //download={"achille.jpg"}
                        size='xs'
                        onClick={e => download(uri)}
                      ><DownloadIcon/> &nbsp; Download</Button>
                    </CardFooter>
                    </Card>
                  </>  
                )
              })}
              </Grid>
            </> 
          ):( <Stack align={'center'}>
            <Text fontSize={'xs'} color={''}>
             If the list is empty this mean you d'ont buy any ticket yet !
            </Text>
        </Stack>)}
          </Box>
    </Stack>)

}
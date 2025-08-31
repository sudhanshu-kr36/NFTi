import { Box, Button, Divider, Flex, Heading, Text, Grid, GridItem, Center } from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, AtSignIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import generateRandomString from '../utils/randomString';

import QRCode from 'react-qr-code';
type TicketProps = {
  id: string;
  eventName: string;
  ticketType: string;
  placeLimit: number;
  date: string;
  contract_address: string;
  place: string;
  price: number;
  owner?:string;
  _key?:string;
};

export default function EventTicket({ id, eventName, ticketType, placeLimit, date, contract_address, place, price, owner,_key }: TicketProps) {
  const ticketRef = useRef<HTMLElement>(null);
  
 const qrString= JSON.stringify(
       {
       '_key':_key
      }
     )
  const getBackgroundColor = () => {
    if (ticketType === 'GOLD') return "url('big_gold_bg.png')";
    if (ticketType === 'SILVER') return "url('big_silver_bg.png')";
    if (ticketType === 'DEFAULT') return "url('big_default_bg.png')";
    return 'black';
  };

  const getBorderColor = () => {
    if (ticketType === 'GOLD') return "#FDC500";
    if (ticketType === 'SILVER') return "#0097B2";
    if (ticketType === 'DEFAULT') return "#737373";
    return "#737373";
  };

  const handleCheckIn = () => {
    const boxElement = document.getElementById('ticket-box');
    if (boxElement) {
      html2canvas(boxElement).then((canvas: HTMLCanvasElement) => {
        const ticketImage = canvas.toDataURL('image/png');
        // Do something with the ticket image, such as save or display it
        console.log('Ticket Image:', ticketImage);
      });
    }
  };
  return (
    
    // <Box id={id} border='2px' borderWidth="1px" h='285' bg={getBackgroundColor()} borderRadius="lg" p={6} maxW="md" mx="auto" width="100%" borderColor={'yellow.100'}>
    //   <Heading size="md" textAlign="center" mb={4}>
    //     {eventName}
    //   </Heading>
    //   <Text fontWeight="bold" textAlign="center" fontSize="sm" mb={4}>
    //     {ticketType}
    //   </Text>
    //   <Text fontSize="sm" textAlign="center" my={4}>
    //     Place Limit: {placeLimit}
    //   </Text>
    //   <Divider my={6} />
    //   <Grid templateColumns='repeat(3, 1fr)' gap={2}>
    //     <GridItem w='100%' colSpan={2} >
    //       <Flex fontSize="sm" align="center" mb={2}>
    //         <CalendarIcon boxSize={5} mr={2} />
    //         <Text>{date}</Text>
    //       </Flex>
    //       {/* <Flex align="center" mb={2}>
    //             <TimeIcon boxSize={5} mr={2} />
    //             <Text>{time}</Text>
    //         </Flex> */}
    //       <Flex fontSize="sm" align="center" mb={4}>
    //         <AtSignIcon boxSize={5} mr={2} />
    //         <Text>{place}</Text>
    //       </Flex>
    //       <Flex fontSize="sm" align="center" mb={4}>
    //         <HamburgerIcon boxSize={5} mr={2} />
    //         <Text>{price} KLAY</Text>
    //       </Flex>
    //     </GridItem>
    //     <GridItem w='100%' >
    //       <Flex fontSize="xs" align="right" mb={4}>
    //         <QRCode value={ `title:${eventName}, type: ${ticketType}, date: ${date}, time: ${time},place:${place} buyer:${owner}`} size={70} />
    //       </Flex>
    //     </GridItem>
    //   </Grid>

    //   {/*       
    //   <Button size="lg" colorScheme="blue" w="100%" onClick={handleCheckIn}>
    //     Check-In
    //   </Button> */}

    // </Box>
    <Box
      id={id}
      
      h={290}
      bgPosition="center"
      bgRepeat="no-repeat"
      ///backgroundImage="url('gold_bg.png')"
      backgroundImage={getBackgroundColor()}
      //bgColor={"yellow"}
      p={6}
      maxW="md"
      mx="auto"
      width="100%"
      
      
    >
      <Grid templateColumns='repeat(2, 1fr)' gap={2}>
      <GridItem w='100%'  >
          <>
          <Heading size="sm" textAlign="left" mb={4} color="white">
            {eventName}
          </Heading>
          <Flex fontSize="xs" align="left" mb={4}>
            
            <Text color="white"><AtSignIcon boxSize={2} mr={2} color="white" />{place}</Text>
          </Flex>
          <Flex fontSize="xx-small" align="left" mb={2}>
            
            <Text color="white"><CalendarIcon boxSize={2} mr={2} color="white" />{date}</Text>
          </Flex>
          
         
          </>
          
        </GridItem> 
      </Grid>
      <Divider my={2} />
      <Grid templateColumns='repeat(3, 1fr)' gap={2}>
      <GridItem w='100%' bgColor={"wihite"}  >
          <Flex w="90px" h='90px' fontSize="xs" >
              <Center h='100% ' w='100%' bg='white'>
                <QRCode   bgColor={"white"} fgColor={"black"} value={qrString}  size={85}/>
              </Center>
              
              {/* <QRCode value={ `title:${eventName}, type: ${ticketType}, date: ${date}, time: ${time},place:${place} buyer:${owner}`} size={70} /> */}
           </Flex>
        </GridItem> 
        <GridItem w='100%' >
            
         
        </GridItem>
        <GridItem w='100%' h='10%'>
        <Text fontWeight="bold" textAlign="right" fontSize="xl" mb={4} color="white">
            {ticketType}
          </Text>
        <Text fontSize="xs" textAlign="right" my={4} color="white">
            Place Limit: {placeLimit}<br/>
            <Text color="white">{price} ETH</Text>
          </Text>
          
        </GridItem>
        
      </Grid>

      {/*       
    //   <Button size="lg" colorScheme="blue" w="100%" onClick={handleCheckIn}>
    //     Check-In
    //   </Button> */}
    </Box>
  );
}

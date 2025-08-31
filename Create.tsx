import {
  Flex,
  Box,
  FormField,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Container,
  VStack,
  HStack,
  Icon,
  InputGroup,
  InputElement,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
export default function AddEvent() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventPlace, setEventPlace] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async () => {
    // Validate required fields
    if (!eventTitle || !eventDate || !eventTime || !eventPlace) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Combine date and time
    const dateTime = new Date(`${eventDate}T${eventTime}`);
    
    // Create event object
    const eventData = {
      title: eventTitle,
      dateTime: dateTime,
      place: eventPlace
    };
    
    console.log('Creating event:', eventData);
    
    // Reset form
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventPlace('');
    setIsLoading(false);
    
    toast({
      title: 'Event Created! 🎉',
      description: 'Your NFT event has been created successfully',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={bgGradient}
      p={4}
      position="relative"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="100px"
        h="100px"
        borderRadius="full"
        bg={useColorModeValue('blue.100', 'blue.800')}
        opacity={0.3}
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="15%"
        w="150px"
        h="150px"
        borderRadius="full"
        bg={useColorModeValue('purple.100', 'purple.800')}
        opacity={0.3}
        filter="blur(40px)"
      />

      <Container maxW="lg" centerContent>
        <Box
          w="full"
          bg={cardBg}
          boxShadow="2xl"
          rounded="3xl"
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
          backdropFilter="blur(10px)"
        >
          {/* Header Section */}
          <Box
            bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
            p={8}
            textAlign="center"
          >
            <VStack gap={3}>
              <Box
                bg="white"
                p={3}
                borderRadius="full"
                boxShadow="lg"
              >
                <Icon as={Sparkles} w={8} h={8} color="purple.500" />
              </Box>
              <Heading fontSize="3xl" color="white" fontWeight="bold">
                Create NFT Event
              </Heading>
              <Text fontSize="lg" color="white" opacity={0.9}>
                Transform your event into a unique digital experience ✨
              </Text>
            </VStack>
          </Box>

          {/* Form Section */}
          <Box p={8}>
            <VStack gap={6} align="stretch">
              <FormField isRequired>
                <FormLabel 
                  color={useColorModeValue('gray.700', 'gray.200')}
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  Event Title
                </FormLabel>
                <InputGroup>
                  <InputElement left>
                    <Icon as={Sparkles} color="gray.400" />
                  </InputElement>
                  <Input
                    placeholder="Enter your amazing event title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    border="2px"
                    borderColor="transparent"
                    _hover={{ borderColor: 'blue.200' }}
                    _focus={{
                      borderColor: 'blue.400',
                      bg: useColorModeValue('white', 'gray.600'),
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                    }}
                    rounded="xl"
                    h="50px"
                    fontSize="md"
                  />
                </InputGroup>
              </FormField>

              <HStack gap={4} align="flex-start">
                <FormField isRequired flex="1">
                  <FormLabel 
                    color={useColorModeValue('gray.700', 'gray.200')}
                    fontWeight="semibold"
                    fontSize="sm"
                  >
                    Event Date
                  </FormLabel>
                  <InputGroup>
                    <InputElement left>
                      <Icon as={Calendar} color="gray.400" />
                    </InputElement>
                    <Input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      border="2px"
                      borderColor="transparent"
                <FormControl isRequired flex="1">
                  <FormLabel 
                    color={useColorModeValue('gray.700', 'gray.200')}
                    fontWeight="semibold"
                    fontSize="sm"
                  >
                    Event Time
                  </FormLabel>
                  <InputGroup>
                    <InputElement left>
                      <Icon as={Clock} color="gray.400" />
                    </InputElement>
                    <Input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      border="2px"
                      borderColor="transparent"
                      _hover={{ borderColor: 'blue.200' }}
                      _focus={{
                        borderColor: 'blue.400',
                        bg: useColorModeValue('white', 'gray.600'),
                        boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                      }}
                      rounded="xl"
                      h="50px"
                    />
                  </InputGroup>
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel 
                  color={useColorModeValue('gray.700', 'gray.200')}
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  Event Location
                </FormLabel>
                <InputGroup>
                  <InputElement left>
                    <Icon as={MapPin} color="gray.400" />
                  </InputElement>
                  <Input
                    placeholder="Where will the magic happen?"
                    value={eventPlace}
                    onChange={(e) => setEventPlace(e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    border="2px"
                    borderColor="transparent"
                    _hover={{ borderColor: 'blue.200' }}
                    _focus={{
                      borderColor: 'blue.400',
                      bg: useColorModeValue('white', 'gray.600'),
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                    }}
                    rounded="xl"
                    h="50px"
                    fontSize="md"
                  />
                </InputGroup>
              </FormControl>

              <Divider my={2} />
              <Box my={2} borderBottom="1px solid" borderColor={borderColor} />
              <Button
                bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
                color="white"
                _hover={{
                  bgGradient: 'linear(to-r, blue.500, purple.600, pink.500)',
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl'
                }}
                _active={{ transform: 'translateY(0)' }}
                size="lg"
                h="60px"
                fontWeight="bold"
                onClick={handleSubmit}
                loading={isLoading}
                loadingText="Creating Your NFT..."
                transition="all 0.3s"
                rounded="xl"
                fontSize="lg"
                boxShadow="lg"
              >
                🚀 Create NFT Event
              </Button>

              <Text
                textAlign="center"
                fontSize="sm"
                color={useColorModeValue('gray.500', 'gray.400')}
                mt={4}
              >
                Your event will be minted as a unique NFT on the blockchain
              </Text>
            </VStack>
          </Box>
        </Box>
      </Container>
    </Flex>
  );
}
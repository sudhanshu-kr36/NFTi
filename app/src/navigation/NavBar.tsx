import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Stack,
  Heading,
  useDisclosure,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Link as ReachLink, useLocation } from "react-router-dom"; // ✅ import useLocation
import { motion } from "framer-motion";
import { useWeb3 } from "../contexts/Web3Context";
import { ColorModeSwitcher } from "../components/utils/ColorModeSwitcher";

const MotionBox = motion(Box);

export default function FrontPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useWeb3().account;
  const location = useLocation(); // ✅ get current route

  const cardBg = useColorModeValue("white", "gray.800");
  const navBg = useColorModeValue("gray.100", "gray.900");
  const hoverBg = useColorModeValue("gray.200", "gray.700");

  const features = [
    { title: "Create Event", desc: "Host events with NFT-based tickets.", img: "/event.gif" },
    { title: "Buy Tickets", desc: "Purchase secure NFT tickets easily.", img: "/ticket.gif" },
    { title: "Check Tickets", desc: "Verify attendees instantly.", img: "/verify.gif" },
  ];

  return (
    <Box>
      {/* 🌐 Navbar */}
      <Box bg={navBg} px={4} boxShadow="sm">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          {/* Menus */}
          <HStack spacing={8} alignItems={"center"}>
            <HStack as={"nav"} spacing={6} display={{ base: "none", md: "flex" }}>
              <Menu>
                <MenuButton px={3} py={1} rounded={"md"} _hover={{ bg: hoverBg }}>
                  <DragHandleIcon /> Events
                </MenuButton>
                <MenuList>
                  <MenuItem as={ReachLink} to="/create-event">
                    Create
                  </MenuItem>
                  <MenuItem as={ReachLink} to="/my-events">
                    My Events
                  </MenuItem>
                  <MenuItem as={ReachLink} to="/sales">
                    Sales
                  </MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton px={3} py={1} rounded={"md"} _hover={{ bg: hoverBg }}>
                  <DragHandleIcon /> Tickets
                </MenuButton>
                <MenuList>
                  <MenuItem as={ReachLink} to="/buy-ticket">
                    Marketplace
                  </MenuItem>
                  <MenuItem as={ReachLink} to="/my-tickets">
                    My Tickets
                  </MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton px={3} py={1} rounded={"md"} _hover={{ bg: hoverBg }}>
                  <DragHandleIcon /> Check Tickets
                </MenuButton>
                <MenuList>
                  <MenuItem as={ReachLink} to="/check-tickets">
                    Attendee
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
          {/* User Profile + Theme Switch */}
          <Flex alignItems={"center"} gap={3}>
            <Menu>
              <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"}>
                <Avatar size={"sm"} />
              </MenuButton>
              <MenuList>
                <MenuItem>Account: {address || "Not Connected"}</MenuItem>
              </MenuList>
            </Menu>
            <ColorModeSwitcher justifySelf="flex-end" />
          </Flex>
        </Flex>
      </Box>

      {/* 🎉 Hero Section → Show only on homepage */}
      {location.pathname === "/" && (
        <Flex
          minH={"80vh"}
          align={"center"}
          justify={"center"}
          direction="column"
          textAlign="center"
          px={6}
          bgGradient="linear(to-r, purple.500, pink.400)"
          color="white"
        >
          <Heading fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
            Dynamic NFT Ticketing Platform 🎟️
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} maxW="600px" mb={6}>
            Create, sell, and verify event tickets with blockchain-powered security.  
            Add GIFs, animations, and engaging UI to make your events unforgettable.
          </Text>
          <Button
            as={ReachLink}
            to="/create-event"
            size="lg"
            colorScheme="blackAlpha"
            bg="white"
            color="black"
            _hover={{ bg: "gray.200" }}
          >
            🚀 Create Your Event
          </Button>
        </Flex>
      )}
    </Box>
  );
}

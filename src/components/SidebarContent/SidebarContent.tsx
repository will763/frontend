import { BoxProps, useColorModeValue, Flex, Text, CloseButton, Box, Image } from "@chakra-ui/react";
import { useContext } from "react";
import { IconType } from "react-icons";
import {
  FiHome,
  FiLogOut,
  FiPlus
} from 'react-icons/fi';
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { NavItem } from "../NavItem/NavItem";

import logoSysmap from "../../assets/logo_sysmap.png"

interface LinkItemProps {
  type: string
  name: string;
  icon: IconType;
  path: string;
}

interface LogoutItemProps {
  type: string
  name: string;
  icon: IconType;
  logout: () => void;
  path?: string;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

  const { signOut } = useContext(AuthContext)
  const LinkItems: Array<LinkItemProps | LogoutItemProps> = [
    { type: 'link', name: 'Home', icon: FiHome, path: '/home' },
    { type: 'link', name: 'Cadastrar Ticket', icon: FiPlus, path: '/newticket' },
    // { type: 'link', name: 'Explore', icon: FiCompass, path: '' },
    // { type: 'link', name: 'Favourites', icon: FiStar, path: '' },
    { type: 'logout', name: 'Sair', icon: FiLogOut, logout: signOut},
  ];

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          <Image src={logoSysmap} /> 
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => { 
      return (
        <NavItem key={link.name} icon={link.icon} path={link.path} onClick={signOut}>
          {link.name}
        </NavItem>
      )})}
    </Box>
  );
};
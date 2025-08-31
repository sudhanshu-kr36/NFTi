import { useToast } from "@chakra-ui/react";  
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Web3ContextProps {
  account?: string;
  signer?: ethers.JsonRpcSigner;
  _provider?: ethers.BrowserProvider;
}

type Web3ContextProviderProps = {
  children: React.ReactNode;
};

const Web3Context = createContext<Web3ContextProps>({});

const Web3Provider: React.FC<Web3ContextProviderProps> = ({ children }) => {
  const toast = useToast();

  const [account, setAccount] = useState<string>();
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
  const [_provider, setProvider] = useState<ethers.BrowserProvider | undefined>();

  const handleLogin = async () => {
    if (window.ethereum) {
      setProvider(provider);
      try {
        const accounts: string[] = await provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setSigner(await provider.getSigner());
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.warn('Ethereum provider not found. Please connect your wallet.');
      toast({
        title: "Error",
        description: "Failed to connect to wallet. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    handleLogin();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleLogin);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleLogin);
      }
    };
  }, [account]);

  return (
    <Web3Context.Provider value={{ account, signer, _provider }}>
      {children}
    </Web3Context.Provider>
  );
};

const useWeb3 = () => {
  return useContext(Web3Context);
};

export { Web3Provider, useWeb3 };

import { JsonRpcSigner, ethers } from "ethers";

import EventTicketNft from '../artifacts/contracts/EventTicketNft.sol/EventTicketNft.json'
import { EventTicketNft as types} from '../../../types/contracts/EventTicketNft'
import { Alchemy,Network,GetBaseNftsForOwnerOptions } from "alchemy-sdk";
import dotenv from 'dotenv/config'

// Configures the Alchemy SDK
const config = {
  apiKey: process.env.REACT_APP_ALCHEMY_SEPOLIA_API_KEY, // Replace with your API key
  network: Network.ETH_SEPOLIA, // Replace with your network
};

export  const deploy=async(signer:JsonRpcSigner|undefined,_eventName:string, _eventSymbol:string , _types:string[],_prices:ethers.BigNumberish[], _places:number[])=>{
  try {
    
  
  const factory = new ethers.ContractFactory(
    EventTicketNft.abi,
    EventTicketNft.bytecode,
    signer
  );
  let deployedContract= factory.deploy(_eventName,_eventSymbol,_types,_prices,_places);
  deployedContract=(await deployedContract).waitForDeployment()
  return deployedContract
  } catch (error) {
    console.log("error  when deploying the contract ==== ", error )   
  }
}

export const getContractInstance= async (address:string,provider:ethers.BrowserProvider|undefined)=>{
  const contract= new ethers.Contract(address, EventTicketNft.abi, provider);
  return contract
}

export const purchaseTicket=async (provider:ethers.BrowserProvider|undefined,uri:string,_type:string,amount:string,contract_address:string) =>{
  try {

    // Call the contract's payable function and send Ether
    //Get Contract
    let contract=await getContractInstance(contract_address,provider);  
    const signer= await provider?.getSigner();
    const connectedContract:types= contract.connect(signer!) as unknown as types;  
    const tx = await connectedContract.safeMint(uri,_type,{ value: ethers.parseEther(amount) });

    // Wait for the transaction to be mined and get the receipt
    const receipt = await tx.wait();
    let result={status:0, tokenId:"" };
    
    if(receipt?.status==1)
    {
      console.log("the receipt: ", receipt)
      //const event = receipt events.find((event) => event.event === "Transfer");
      result.tokenId = receipt?.logs[0].topics[3];
      result.status=receipt?.status;
      //result.tokenId=await contract.totalSupply();
    }
   
    return result
  
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

export const isDeployer= async (deployer_address:string, contract_address:string)=>{
  try {
    //Get Contract
    console.log("contract  address  ", contract_address)
    return true;

  } catch (error) {
    console.log("error calling isDeployer funciton", error)
  }
}

export const loadOwnerTickets= async (contract_address:string, provider:ethers.BrowserProvider|undefined) =>{
  
  try {
    const signer= await provider?.getSigner();

     // Call the balanceOf function to get the number of NFTs owned by the address
     let contract=await getContractInstance(contract_address,provider);  
     let owner_address=signer?signer.address:'';

    console.log("owner_address", owner_address.toLowerCase())

    const transferFilter = contract.filters.Transfer(null,owner_address.toLowerCase(),null);
    
    const transferEvents = await provider?.getLogs({
      address: contract_address,
      topics:  await transferFilter.getTopicFilter(),
      fromBlock: 0,
    });
    const tokenUriFunction = contract.getFunction("tokenURI");
    let tokenUris:string[]=[]
   
    
    // Using map to create an array of promises
    
    let resolveds=  transferEvents?.map(async (event) => {
      const tokenId = event.topics[3]; // The tokenId is the third topic
      const tokenIdInt = tokenId.toString();
      const tokenUri = await tokenUriFunction(tokenIdInt);
      
      return tokenUri;
    });
    
  if (resolveds) {
    tokenUris.push(...await Promise.all(resolveds));
  }

    return tokenUris
  } catch (error) {
    console.error('Error sending transaction:', error);
    //loadOwnerTickets(contract_address, provider)
    
  } 
}



export const loadBuyerTickets= async (provider:ethers.BrowserProvider|undefined, contract_address:string, owner_address:string, _token_id:string) =>{
  try {

    try {
      const signer= await provider?.getSigner();
  
       // Call the balanceOf function to get the number of NFTs owned by the address
       let contract=await getContractInstance(contract_address,provider);  
       let deployer_address=signer?signer.address:'';
  
      //console.log("deployer_address", owner_address.toLowerCase())
  
      const transferFilter = contract.filters.Transfer(null,owner_address.toLowerCase(),null);
      
      const transferEvents = await provider?.getLogs({
        address: contract_address,
        topics:  await transferFilter.getTopicFilter(),
        fromBlock: 0,
      });
      const tokenUriFunction = contract.getFunction("tokenURI");
      let tokenUris:string[]=[]
      //console.log("the transfer events ..... ", transferEvents)
      
      // Using map to create an array of promises
      
      let resolveds=  transferEvents?.map(async (event) => {
        const tokenId = event.topics[3]; // The tokenId is the third topic
        const tokenIdInt = tokenId.toString();
        if(tokenId ==_token_id)
        {
          const tokenUri = await tokenUriFunction(tokenIdInt);
          return tokenUri;
        }
        return null;
        //console.log("token uri ", tokenUri)
       
      });
      
    if (resolveds) {
      tokenUris.push(...await Promise.all(resolveds));
    }
      return tokenUris
    } catch (error) {
      console.error('Error sending transaction:', error);
      loadBuyerTickets(provider,contract_address, owner_address,_token_id)
      
    }
    // let contractAddresses=[]
    // contractAddresses.push(ethers.getAddress(contract_address.toLowerCase()))
    // const options: GetBaseNftsForOwnerOptions = {
    //   contractAddresses: contractAddresses,
    //   omitMetadata: false
    // };
    // let response = await alchemy.nft.getNftsForOwner(ethers.getAddress(owner_address.toLowerCase()), options)
    
  } catch (error) {
    console.error('Error sending transaction:', error);
  } 
}





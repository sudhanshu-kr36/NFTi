import { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-toolbox") ;
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
require('dotenv').config();

const networkUrl = process.env.REACT_APP_SEPOLIA_URL;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths:{
    artifacts: "./app/src/artifacts"
  },
  networks:{
    klaytn:{
      url:networkUrl,
      gasPrice: 250000000000,
      accounts : [`0x${privateKey}`]
    }
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6", 
  },
  
};

export default config;

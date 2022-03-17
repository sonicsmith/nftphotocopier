import "dotenv/config"
import Web3 from "web3"
import { abi } from "../contracts/NFTPhotocopier.json"

export default (tokenURI) => {
  console.log("Making call to mint NFT with", tokenURI)
}

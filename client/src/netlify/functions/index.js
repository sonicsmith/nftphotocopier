import "dotenv/config"
import Web3 from "web3"
import HDWalletProvider from "truffle-hdwallet-provider"
import ContractJson from "./../../contracts/NFTPhotocopier.json"

const getTokenURI = ({ contractAddress, tokenId }) => {
  const provider = new HDWalletProvider(
    MNEMONIC,
    `https://mainnet.infura.io/v3/${INFURA_KEY}`
  )
  const web3Instance = new Web3(provider)
  const contract = new web3Instance.eth.Contract(
    ContractJson.abi,
    contractAddress,
    { gasLimit: "1000000" }
  )
  return contract.methods.tokenURI(tokenId).call()
}

exports.handler = async (event) => {
  const { contractAddress, tokenId } = event.pathParameters
  return getTokenURI({ contractAddress, tokenId })
    .then((tokenURI) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ tokenURI }),
      }
    })
    .catch((e) => new Error(e))
}

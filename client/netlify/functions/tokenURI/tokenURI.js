require("dotenv/config")
const Web3 = require("web3")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const { abi } = require("./ERC721.json")

const getTokenURI = ({ contractAddress, tokenId }) => {
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: process.env.MNEMONIC,
    },
    providerOrUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  })
  const web3Instance = new Web3(provider)
  console.log("Creating contract instance", contractAddress)
  const contract = new web3Instance.eth.Contract(abi, contractAddress, {
    gasLimit: "1000000",
  })
  console.log("Getting tokenURI", contract)
  return contract.methods.tokenURI(tokenId).call()
}

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const { contractAddress, tokenId } = event.queryStringParameters
    const tokenURI = await getTokenURI({ contractAddress, tokenId })
    console.log(tokenURI)
    return {
      statusCode: 200,
      body: JSON.stringify({ tokenURI }),
    }
  } catch (error) {
    console.log(error)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

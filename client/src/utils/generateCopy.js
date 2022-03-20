import "dotenv/config"
import getWeb3 from "./getWeb3"
import ContractJSON from "../contracts/NFTPhotocopier.json"
import { CONTRACT_ADDRESS, MINT_CHARGE, POLYGON_NETWORK_ID } from "../constants"

let instance = null

const initialiseWeb3 = async () => {
  try {
    // Get network provider and web3 instance.
    const web3 = getWeb3()

    // Get the contract instance.
    const networkId = await web3.eth.net.getId()
    if (String(networkId) !== POLYGON_NETWORK_ID) {
      alert("Wrong Network")
    }
    instance = new web3.eth.Contract(ContractJSON.abi, CONTRACT_ADDRESS)
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`
    )
    console.error(error)
  }
}

export default async (tokenURI, { onConfirm, onSuccess, onError }) => {
  console.log("Making call to mint NFT with", tokenURI)
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({ res: "worked" })
  //   }, 3000)
  // })

  if (instance === null) {
    await initialiseWeb3()
  }

  const from = instance.givenProvider.selectedAddress

  try {
    await instance.methods
      .photocopyNft(tokenURI)
      .send({ from, value: MINT_CHARGE, gas: 300000 })
      .once("transactionHash", (payload) => {
        console.log("transactionHash", payload)
        onConfirm(payload)
      })
      .on("error", (payload) => {
        console.log("error", payload)
        onError(payload)
      })
      .then((receipt) => {
        console.log("Finished", receipt)
        onSuccess(receipt)
      })
  } catch (error) {
    onError(error)
  }
}

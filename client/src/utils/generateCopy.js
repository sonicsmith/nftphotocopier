import "dotenv/config"
import getWeb3 from "./getWeb3"
import ContractJSON from "../contracts/NFTPhotocopier.json"
import { CONTRACT_ADDRESS, MINT_CHARGE, POLYGON_NETWORK_ID } from "../constants"

let instance = null
let web3 = null

const initialiseWeb3 = async () => {
  try {
    // Get network provider and web3 instance.
    web3 = getWeb3()
    // Get the contract instance.
    const networkId = await web3.eth.net.getId()
    if (String(networkId) !== POLYGON_NETWORK_ID) {
      throw new Error("Wrong Network. Switch to Polygon")
    }
    instance = new web3.eth.Contract(ContractJSON.abi, CONTRACT_ADDRESS)
  } catch (error) {
    // Catch any errors for any of the above operations.
    throw new Error(
      `Failed to load web3, accounts, or contract. Check console for details.`
    )
  }
}

export default async (tokenURI, { onConfirm, onSuccess, onError }) => {
  if (instance === null) {
    try {
      await initialiseWeb3()
    } catch (e) {
      console.error(e)
      onError(e.message || e)
    }
  }

  const from = instance.givenProvider.selectedAddress
  const maxFeePerGas = web3.utils.toHex(web3.utils.toWei("35", "gwei"))

  try {
    await instance.methods
      .photocopyNft(tokenURI)
      .send({ from, value: MINT_CHARGE, maxFeePerGas })
      .once("transactionHash", (payload) => {
        console.log("transactionHash", payload)
        onConfirm(payload)
      })
      .on("error", (payload) => {
        console.error("error", payload)
        onError(
          "An error occured during copying. (This NFT may have already been copied)"
        )
      })
      .then((receipt) => {
        console.log("Finished", receipt)
        onSuccess(receipt)
      })
  } catch (error) {
    console.error("error", error)
    onError(
      "An error occured during copying. (This NFT may have already been copied)"
    )
  }
}

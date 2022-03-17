import React, { useEffect, useMemo, useState } from "react"
import { Box, Button, Text, TextInput } from "grommet"
import PreviewModal from "./components/PreviewModal"
// import NFTPhotocopierContract from "./contracts/NFTPhotocopier.json"
// import getWeb3 from "./getWeb3"

const boredApeUrl =
  "https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1"

export const App = () => {
  const [openseaUrl, setOpenseaUrl] = useState(boredApeUrl)
  const [showMintingModal, setShowMintingModal] = useState(false)
  const [tokenData, setTokenData] = useState()

  const isUrlValid = useMemo(() => {
    if (openseaUrl) {
      return (
        openseaUrl.startsWith("https://opensea.io/assets/0x") &&
        openseaUrl.split("/").length === 6
      )
    } else {
      return false
    }
  }, [openseaUrl])

  useEffect(() => {
    if (showMintingModal) {
      const urlPieces = openseaUrl.split("/")
      const contractaddress = urlPieces[4]
      const tokenId = urlPieces[5]
      fetch(
        `https://api.opensea.io/api/v1/asset/${contractaddress}/${tokenId}/?include_orders=false`
      )
        .then((res) => res.json())
        .then((data) => {
          setTokenData(data)
        })
    }
  }, [showMintingModal])

  return (
    <Box fill={true} background="dark-1" align="center" justify="center">
      <Box width={"50%"} align="center" justify="center">
        {showMintingModal && (
          <PreviewModal
            setShowMintingModal={setShowMintingModal}
            tokenData={tokenData}
          />
        )}
        <Text size={"4xl"} margin={"medium"}>
          NFT Photocopier
        </Text>
        <Text>Create your own bootleg NFT on Polygon for 5 MATIC</Text>
        <Text>Once an NFT is photocopied here, it can not be copied again</Text>
        <Text margin={"small"}>
          Enter the Opensea url for any Ethereum NFT below:
        </Text>
        <TextInput
          placeholder={boredApeUrl}
          value={openseaUrl}
          onChange={(event) => setOpenseaUrl(event.target.value)}
          margin={"medium"}
        />
        <Button
          margin={"medium"}
          primary
          label="Start"
          disabled={!isUrlValid}
          onClick={() => {
            setTokenData()
            setShowMintingModal(true)
          }}
        />
      </Box>
    </Box>
  )
}

export default App

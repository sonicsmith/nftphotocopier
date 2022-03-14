import React, { useEffect, useMemo, useState } from "react"
import { Box, Button, Image, Layer, Text, TextInput } from "grommet"
// import NFTPhotocopierContract from "./contracts/NFTPhotocopier.json"
// import getWeb3 from "./getWeb3"

const Modal = ({ setShowMintingModal, tokenData, mintToken }) => {
  return (
    <Layer
      onEsc={() => setShowMintingModal(false)}
      onClickOutside={() => setShowMintingModal(false)}
    >
      <Box
        pad={"small"}
        round={true}
        border={{ size: "small" }}
        background="dark-2"
      >
        {tokenData && (
          <Box justify="center" align="center">
            <Text size={"3xl"} margin={"medium"}>
              {tokenData.title}
            </Text>
            <Box padding={"medium"}>
              <Image fit="cover" src={tokenData.image} />
            </Box>
          </Box>
        )}
        <Box direction="row" justify="center" pad={"small"}>
          <Button
            primary
            label="Photocopy"
            onClick={mintToken}
            margin={"small"}
          />
          <Button
            primary
            label="Cancel"
            onClick={() => setShowMintingModal(false)}
            margin={"small"}
          />
        </Box>
      </Box>
    </Layer>
  )
}

export const App = () => {
  const [openseaUrl, setOpenseaUrl] = useState("")
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
        .then(({ name, image_url }) => {
          setTokenData({
            title: name,
            image: image_url,
          })
        })
    }
  }, [showMintingModal])

  const mintToken = () => {
    //
  }

  return (
    <Box fill={true} background="dark-1" align="center" justify="center">
      <Box width={"50%"} align="center" justify="center">
        {showMintingModal && (
          <Modal
            setShowMintingModal={setShowMintingModal}
            tokenData={tokenData}
            mintToken={tokenData}
          />
        )}
        <Text size={"4xl"} margin={"medium"}>
          NFT Photocopier
        </Text>
        <Text margin={"medium"}>Enter the Opensea url for the NFT below:</Text>
        <TextInput
          placeholder="https://opensea.io/assets/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/1"
          value={openseaUrl}
          onChange={(event) => setOpenseaUrl(event.target.value)}
          margin={"medium"}
        />
        <Button
          margin={"medium"}
          primary
          label="Start"
          disabled={!isUrlValid}
          onClick={() => setShowMintingModal(true)}
        />
      </Box>
    </Box>
  )
}

export default App

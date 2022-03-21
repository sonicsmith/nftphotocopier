import React, { useState } from "react"
import { Anchor, Box, Button, Image, Layer, Text, Notification } from "grommet"
import { Loading } from "./Loading"
import generateCopy from "../utils/generateCopy"
import "./PreviewModal.css"
import { CONTRACT_ADDRESS } from "../constants"

const getUrlFromTokenId = (tokenId) => {
  return `https://opensea.io/assets/matic/${CONTRACT_ADDRESS}/${tokenId}`
}

export default ({ setShowMintingModal, tokenData }) => {
  const [isCopying, setIsCopying] = useState(false)
  const [isCopyFinished, setIsCopyFinished] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [nftUrl, setNftUrl] = useState("")

  return (
    <Layer
      onEsc={() => setShowMintingModal(false)}
      onClickOutside={() => setShowMintingModal(false)}
      background={{ opacity: false }}
    >
      <Box
        pad={"small"}
        round={true}
        border={{ size: "small" }}
        background="dark-2"
      >
        <Box justify="center" align="center">
          {!tokenData && <Loading />}
          {tokenData && !tokenData.token_metadata && (
            <>
              <Text color={"red"}>Due to the format of this NFT,</Text>
              <Text color={"red"}>copying is unavialable at this time..</Text>
            </>
          )}
          {tokenData && tokenData.token_metadata && !isCopyFinished && (
            <>
              {isCopying ? (
                <Text size={"2xl"} margin={"medium"}>
                  Copying...
                </Text>
              ) : (
                <Text size={"2xl"} margin={"medium"}>
                  {tokenData.name ||
                    `${tokenData.collection.name} #${tokenData.token_id}`}
                </Text>
              )}
              <Box className={isCopying ? "effect" : ""} width="80%">
                <Image fit="cover" src={tokenData.image_url} />
              </Box>
            </>
          )}
        </Box>
        <Box>
          {!isCopyFinished && (
            <Text textAlign="center" margin={"small"}>
              [Photocopy charge: 1 MATIC]
            </Text>
          )}
          {nftUrl && (
            <>
              <Text textAlign="center" margin={"small"}>
                View your new NFT here:
              </Text>
              <Box justify="center" align="center">
                <Anchor href={nftUrl} label={"OpenSea"} />
              </Box>
            </>
          )}
        </Box>
        <Box direction="row" justify="center">
          <Button
            label={isCopying ? "Copying" : "Photocopy"}
            onClick={async () => {
              await generateCopy(tokenData?.token_metadata, {
                onConfirm: () => setIsCopying(true),
                onSuccess: ({ events }) => {
                  const tokenId = events?.Transfer?.returnValues?.tokenId
                  const url = getUrlFromTokenId(tokenId)
                  setNftUrl(url)
                  setIsCopyFinished(true)
                },
                onError: (message) => setErrorMessage(message),
              })
              setIsCopying(false)
            }}
            margin={"small"}
            disabled={!tokenData?.token_metadata || isCopying || isCopyFinished}
          />
          <Button
            label="Cancel"
            onClick={() => setShowMintingModal(false)}
            margin={"small"}
          />
        </Box>
      </Box>
      {isCopyFinished && (
        <Notification
          toast
          status={"normal"}
          title={"Success"}
          message={
            "Your NFT has been successfully copied. It is now avaliable in your account."
          }
          // onClose={() => setIsCopyFinished(false)}
        />
      )}
      {errorMessage && (
        <Notification
          toast
          status={"critical"}
          title={"Error"}
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </Layer>
  )
}

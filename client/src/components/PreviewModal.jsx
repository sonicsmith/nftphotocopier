import React, { useState } from "react"
import { Box, Button, Image, Layer, Text } from "grommet"
import { Loading } from "./Loading"
import generateCopy from "../methods/generateCopy"
import "./PreviewModal.css"

export default ({ setShowMintingModal, tokenData }) => {
  const [isCopying, setIsCopying] = useState()
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
          {tokenData && tokenData.token_metadata && (
            <>
              <Text size={"3xl"} margin={"medium"}>
                {tokenData.name ||
                  `${tokenData.collection.name} #${tokenData.token_id}`}
              </Text>
              <Box padding={"medium"} className={isCopying ? "copying" : ""}>
                <Image fit="cover" src={tokenData.image_url} />
              </Box>
            </>
          )}
        </Box>
        <Box direction="row" justify="center" pad={"small"}>
          <Button
            primary
            label="Photocopy"
            onClick={() => generateCopy(tokenData?.token_metadata)}
            margin={"small"}
            disabled={!tokenData?.token_metadata}
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

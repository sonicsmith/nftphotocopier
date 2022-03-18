import React, { useState } from "react"
import { Box, Button, Image, Layer, Text } from "grommet"
import { Loading } from "./Loading"
import generateCopy from "../utils/generateCopy"
import "./PreviewModal.css"

export default ({ setShowMintingModal, tokenData }) => {
  const [isCopying, setIsCopying] = useState(false)

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
              <Box className={isCopying ? "effect" : ""}>
                <Image fit="cover" src={tokenData.image_url} />
              </Box>
            </>
          )}
        </Box>
        <Box>
          <Text textAlign="center" margin={"small"}>
            [Photocopies cost 1 MATIC each]
          </Text>
        </Box>
        <Box direction="row" justify="center">
          <Button
            primary
            label={isCopying ? "Copying" : "Photocopy"}
            onClick={async () => {
              setIsCopying(true)
              const { res, err } = await generateCopy(tokenData?.token_metadata)
              if (res) {
                //
              } else {
                //
              }
              setIsCopying(false)
            }}
            margin={"small"}
            disabled={!tokenData?.token_metadata || isCopying}
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

import React, { useState } from "react"
import { Box, Button, Image, Layer, Text, Notification } from "grommet"
import { Loading } from "./Loading"
import generateCopy from "../utils/generateCopy"
import "./PreviewModal.css"

export default ({ setShowMintingModal, tokenData }) => {
  const [isCopying, setIsCopying] = useState(false)
  const [isCopyFinished, setIsCopyFinished] = useState(false)
  const [isError, setIsError] = useState(false)

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
            [Photocopying costs 1 MATIC]
          </Text>
        </Box>
        <Box direction="row" justify="center">
          <Button
            label={isCopying ? "Copying" : "Photocopy"}
            onClick={async () => {
              await generateCopy(tokenData?.token_metadata, {
                onConfirm: () => setIsCopying(true),
                onSuccess: () => setIsCopyFinished(true),
                onError: () => setIsError(true),
              })
              setIsCopying(false)
            }}
            margin={"small"}
            disabled={!tokenData?.token_metadata || isCopying}
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
          message={"Your NFT has been successfully copied"}
          onClose={() => setIsCopyFinished(false)}
        />
      )}
      {isError && (
        <Notification
          toast
          status={"critical"}
          title={"Error"}
          message={"An error occured during copying"}
          onClose={() => setIsError(false)}
        />
      )}
    </Layer>
  )
}

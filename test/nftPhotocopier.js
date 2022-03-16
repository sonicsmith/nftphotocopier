const NFTPhotocopier = artifacts.require("NFTPhotocopier")
const BN = web3.utils.BN

const FIVE_MATIC = "5000000000000000000"

let instance

contract("NFTPhotocopier token", (accounts) => {
  it("Should make first account an owner", async () => {
    instance = await NFTPhotocopier.deployed()
    const owner = await instance.owner()
    assert.equal(owner, accounts[0])
  })

  it("Should mint a token with correct owner", async () => {
    await instance.photocopyNft("theTokenURI", { value: FIVE_MATIC })
    const owner = await instance.ownerOf(1)
    assert.equal(owner, accounts[0])
  })

  it("Should mint a token with the correct TokenURI", async () => {
    await instance.photocopyNft("theNextTokenURI", { value: FIVE_MATIC })
    const tokenURI = await instance.tokenURI(2)
    assert.equal(tokenURI, "theNextTokenURI")
  })

  it("Should reject a mint when TokenURI is taken", async () => {
    try {
      await instance.photocopyNft("theTokenURI", { value: FIVE_MATIC })
    } catch (e) {
      assert.equal(e.reason, "Copy already exists")
    }
  })

  it("Should claim all contract balance", async () => {
    const startBalance = await web3.eth.getBalance(accounts[0])
    await instance.claimEarnings()
    const endBalance = await web3.eth.getBalance(accounts[0])
    const initial = new BN(startBalance)
    const final = new BN(endBalance)
    const amountClaimed = final.sub(initial).toString()
    assert.equal(amountClaimed, "9999912759941921553")
  })
})

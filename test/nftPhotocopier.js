const NFTPhotocopier = artifacts.require("NFTPhotocopier")
const BN = web3.utils.BN

const ONE_MATIC = "1000000000000000000"

let instance

contract("NFTPhotocopier token", (accounts) => {
  it("Should make first account an owner", async () => {
    instance = await NFTPhotocopier.deployed()
    const owner = await instance.owner()
    assert.equal(owner, accounts[0])
  })

  it("Should change cost price", async () => {
    await instance.setCopyPrice(ONE_MATIC)
    const newPrice = await instance.photocopyCost()
    assert.equal(newPrice, ONE_MATIC)
  })

  it("Should mint a token with correct owner", async () => {
    await instance.photocopyNft("theTokenURI", {
      value: ONE_MATIC,
      from: accounts[1],
    })
    const owner = await instance.ownerOf(1)
    assert.equal(owner, accounts[1])
  })

  it("Should mint a token with the correct TokenURI", async () => {
    await instance.photocopyNft("theNextTokenURI", {
      value: ONE_MATIC,
      from: accounts[1],
    })
    const tokenURI = await instance.tokenURI(2)
    assert.equal(tokenURI, "theNextTokenURI")
  })

  it("Should reject a mint when TokenURI is taken", async () => {
    try {
      await instance.photocopyNft("theTokenURI", {
        value: ONE_MATIC,
        from: accounts[1],
      })
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
    assert.equal(amountClaimed, "1999914237565298225")
  })
})

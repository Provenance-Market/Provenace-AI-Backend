const ProvNFT = artifacts.require('ProvNFT')

contract('ProvNFT', accounts => {
  const [owner, payee1, payee2] = accounts

  describe('Deployment', () => {
    it('should deploy smart contract properly', async () => {
      const provNFT = await ProvNFT.deployed(
        [
          '0x7e48cd33f9b90c7d07973278754e22b9245ee1b5',
          '0x6da55d9e5836e03c2b20ed9b7673ee07b5dd8ad9',
          '0xf81e5ac85e5f3badfb4ab58a4a7eef5e70d4b056',
        ],
        [33, 33, 33]
      )
      assert(provNFT.address !== '')
    })
  })

  describe('Minting', () => {
    beforeEach(async function () {
      this.contract = await ProvNFT.new([payee1, payee2], [50, 50])
    })

    it('should allow minting of a new NFT', async function () {
      const metadataURI = 'https://example.com/token_metadata/1'
      const result = await this.contract.mint(metadataURI, {
        value: web3.utils.toWei('0.01', 'ether'),
        from: owner,
      })

      console.log(result.logs)
      expect(result.logs).to.have.lengthOf(2)
      expect(result.logs[0].event).to.equal('TransferSingle')
      expect(result.logs[0].args.id.toNumber()).to.equal(0)
      expect(result.logs[0].args.from).to.equal(
        '0x0000000000000000000000000000000000000000'
      )
      expect(result.logs[0].args.to).to.equal(owner)
      expect(result.logs[0].args.value.toNumber()).to.equal(1)
      expect(result.logs[1].event).to.equal('URI')
      expect(result.logs[1].args.id.toNumber()).to.equal(0)
      expect(result.logs[1].args.value).to.equal(
        'https://example.com/token_metadata/1'
      )

      const uri = await this.contract.uri(0)
      expect(uri).to.equal(metadataURI)
    })
  })
})

import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
  //Get RPC-Provider
  let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL) 
  //Instantiate a wallet 
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
  //Get contract ABI from simpleStorage.abi
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  //Get contract Binary from simpleStorage.bin
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )
  //Interact with the compiled contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait...")
  const contract = await contractFactory.deploy()
  // const contract = await contractFactory.deploy({ gasPrice: 100000000000 })
  const deploymentReceipt = await contract.deployTransaction.wait()
  console.log(`Contract deployed to ${contract.address}`)


  // tx = {
  //   nonce: 10,
  //   gasPrice: 100000000000,
  //   gasLimit: 1000000,
  //   to: null,
  //   value: 0,

  let currentFavoriteNumber = await contract.retrieve()
  console.log(`Current Favorite Number: ${currentFavoriteNumber}`)
  console.log("Updating favorite number...")
  let transactionResponse = await contract.store(7)
  let transactionReceipt = await transactionResponse.wait()
  currentFavoriteNumber = await contract.retrieve()
  console.log(`New Favorite Number: ${currentFavoriteNumber}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
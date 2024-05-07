const {hre}=require("hardhat")
async function main()
{
    //const lockedAmount= hre.ethers.utils.parseEther("1");
    const amount = hre.ethers.utils.parseEther("1.0");
    //console.log(lockedAmount);
    console.log(amount)
}
// Call the main function to start the deployment process
main()
  .then(() => {
    console.log("Deployment completed successfully.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
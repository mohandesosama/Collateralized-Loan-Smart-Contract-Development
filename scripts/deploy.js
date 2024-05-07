const { lock } = require("ethers");
const hre = require("hardhat");

async function main() {

    const lockAmount = hre.ethers.parseEther("1.0");
    console.log(lockAmount);
    
    const CollateralizedLoan = await hre.ethers.getContractFactory("CollateralizedLoan");
    const collateralizedLoan = await CollateralizedLoan.deploy();
    console.log(`address of contract is ${await collateralizedLoan.getAddress()}`);
}

main()
    .then(() => {
        console.log("Deployment completed successfully.");
        process.exit(0);
    })
    .catch(error => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });

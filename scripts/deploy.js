const hre = require("hardhat");

async function main() {
    const currentTimeStampInSeconds = Math.round(Date.now()/1000);
    const ONE_YEARS_IN_SECONDS = 365 * 24 * 60 * 60 ;
    const unlockTime = currentTimeStampInSeconds + ONE_YEARS_IN_SECONDS;

    const lockAmount = hre.ethers.parseEther("1.0");
    
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

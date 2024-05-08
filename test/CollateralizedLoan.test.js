const { expect } = require("chai");
const hre =require("hardhat")
const { ethers } = require("ethers");

describe("CollateralizedLoan", function () {
  let CollateralizedLoan;
  let collateralizedLoan;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    CollateralizedLoan = await hre.ethers.getContractFactory("CollateralizedLoan");
    collateralizedLoan = await CollateralizedLoan.deploy();
  });

  it("Should deposit collateral", async function () {
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: hre.ethers.parseEther("1") });
    const loan = await collateralizedLoan.loans(addr1.address);
    expect(loan.borrower).to.equal(addr1.address);
    expect(loan.collateralAmount).to.equal(hre.ethers.parseEther("1"));
  });

  it("Should fund loan", async function () {
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: hre.ethers.parseEther("1") });
    await collateralizedLoan.connect(owner).fundLoan(addr1.address, { value: hre.ethers.parseEther("2") });
    const loan = await collateralizedLoan.loans(addr1.address);
    expect(loan.funded).to.equal(true);
  });

  it("Should repay loan", async function () {
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: hre.ethers.parseEther("1") });
    await collateralizedLoan.connect(owner).fundLoan(addr1.address, { value: hre.ethers.parseEther("2") });
    await collateralizedLoan.connect(addr1).repayLoan({ value: hre.ethers.parseEther("2.2") });

    // Confirm that the total amount due, including interest, is accurate
    const loan = await collateralizedLoan.loans(addr1.address);
    // Assuming loanAmount is a regular JavaScript number
    const totalAmountDue = loan.loanAmount + BigInt(loan.loanAmount) * BigInt(loan.interestRate) / 100n;
    expect(totalAmountDue).to.equal(hre.ethers.parseEther("2.2"));
    
    expect(loan.repaid).to.equal(true);
  });

  it("Should claim collateral", async function () {
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: hre.ethers.parseEther("1") });
    await collateralizedLoan.connect(owner).fundLoan(addr1.address, { value: hre.ethers.parseEther("2") });

    // Increase time to after due date
    await network.provider.send("evm_increaseTime", [3600 * 24 * 8]);

    // Claim collateral
    await collateralizedLoan.connect(owner).claimCollateral(addr1.address);
    const loan = await collateralizedLoan.loans(addr1.address);
    expect(loan.collateralAmount).to.equal(0);
  });
});

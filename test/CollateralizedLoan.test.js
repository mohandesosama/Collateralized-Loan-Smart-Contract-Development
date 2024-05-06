// test/CollateralizedLoan.test.js

const { expect } = require("chai");
const { ethers } = require("ethers");

describe("CollateralizedLoan", function () {
  let CollateralizedLoan;
  let collateralizedLoan;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    CollateralizedLoan = await ethers.getContractFactory("CollateralizedLoan");
    collateralizedLoan = await CollateralizedLoan.deploy();
    await collateralizedLoan.deployed();
  });

  it("Should deposit collateral", async function () {
    console.log("Testing: Should deposit collateral");
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: ethers.utils.parseEther("1") });
    const loan = await collateralizedLoan.loans(addr1.address);
    expect(loan.borrower).to.equal(addr1.address);
    expect(loan.collateralAmount).to.equal(ethers.utils.parseEther("1"));
  });

  it("Should fund loan", async function () {
    console.log("Testing: Should fund loan");
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: ethers.utils.parseEther("1") });
    await collateralizedLoan.connect(owner).fundLoan(addr1.address, { value: ethers.utils.parseEther("2") });
    const loan = await collateralizedLoan.loans(addr1.address);
    expect(loan.funded).to.equal(true);
  });

  it("Should repay loan", async function () {
    console.log("Testing: Should repay loan");
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: ethers.utils.parseEther("1") });
    await collateralizedLoan.connect(owner).fundLoan(addr1.address, { value: ethers.utils.parseEther("2") });
    await collateralizedLoan.connect(addr1).repayLoan({ value: ethers.utils.parseEther("2.2") });
    const loan = await collateralizedLoan.loans(addr1.address);
    expect(loan.repaid).to.equal(true);
  });

  it("Should claim collateral", async function () {
    console.log("Testing: Should claim collateral");
    await collateralizedLoan.connect(addr1).depositCollateral(3600, { value: ethers.utils.parseEther("1") });
    await collateralizedLoan.connect(owner).fundLoan(addr1.address, { value: ethers.utils.parseEther("2") });
    await network.provider.send("evm_increaseTime", [3600 * 24 * 8]); // increase time to after due date
    await collateralizedLoan.connect(owner).claimCollateral(addr1.address);
    const loan = await collateralizedLoan.loans(addr1.address);
    expect(loan.collateralAmount).to.equal(0);
  });
});

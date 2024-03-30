// In your test file
const { expect } = require('chai');

describe('CollateralizedLoan', function () {
  let CollateralizedLoan;
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    CollateralizedLoan = await ethers.getContractFactory('CollateralizedLoan');
    [owner, addr1, addr2] = await ethers.getSigners();
    contract = await CollateralizedLoan.deploy();
    await contract.deployed();
  });

  it('Should deposit collateral and request a loan', async function () {
    const duration = 3600; // Duration in seconds
    await expect(contract.connect(addr1).depositCollateral(duration)).to.emit(contract, 'LoanRequested');
  });

  // More test cases for funding a loan, repaying a loan, claiming collateral, and error handling
});
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract CollateralizedLoan {
    struct Loan {
        address borrower;
        uint256 collateralAmount;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 duration;
        uint256 dueDate;
        bool funded;
        bool repaid;
    }

    mapping(address => Loan) public loans;
    mapping(address => uint256) public lenders;

    event LoanRequested(address indexed borrower, uint256 loanAmount, uint256 dueDate);
    event LoanFunded(address indexed lender, address indexed borrower, uint256 loanAmount);
    event LoanRepaid(address indexed borrower, uint256 amountRepaid);
    event CollateralClaimed(address indexed lender, address indexed borrower, uint256 amount);

    function depositCollateral(uint256 _duration) external payable {
        require(msg.value > 0, "Collateral amount must be greater than 0");
        loans[msg.sender] = Loan({
            borrower: msg.sender,
            collateralAmount: msg.value,
            loanAmount: msg.value * 2,
            interestRate: 10, // 10% interest rate
            duration: _duration,
            dueDate: block.timestamp + _duration,
            funded: false,
            repaid: false
        });
        emit LoanRequested(msg.sender, loans[msg.sender].loanAmount, loans[msg.sender].dueDate);
    }

    function fundLoan(address _borrower) external payable {
        Loan storage loan = loans[_borrower];
        require(loan.loanAmount > 0, "Loan request not found");
        require(!loan.funded, "Loan already funded");
        require(msg.value == loan.loanAmount, "Incorrect loan amount");
        loan.funded = true;
        lenders[msg.sender] += msg.value;
        emit LoanFunded(msg.sender, _borrower, msg.value);
    }

    function repayLoan() external payable {
        Loan storage loan = loans[msg.sender];
        require(loan.funded, "Loan not funded yet");
        require(!loan.repaid, "Loan already repaid");
        uint256 totalAmount = loan.loanAmount + (loan.loanAmount * loan.interestRate / 100);
        require(msg.value == totalAmount, "Incorrect repayment amount");
        loan.repaid = true;
        payable(msg.sender).transfer(loan.collateralAmount);
        emit LoanRepaid(msg.sender, msg.value);
    }

    function claimCollateral(address _borrower) external {
        Loan storage loan = loans[_borrower];
        require(block.timestamp > loan.dueDate && !loan.repaid, "Loan not yet due or already repaid");
        require(loan.funded, "Loan not funded yet");
        uint256 amount = loan.collateralAmount;
        loan.collateralAmount = 0;
        payable(msg.sender).transfer(amount);
        emit CollateralClaimed(msg.sender, _borrower, amount);
    }
}

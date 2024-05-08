# Collateralized Loan Smart Contract Development
## Deploy evidence on Sepolia fork on Remix

Deploy link [View the contract on sepolia testnet](https://sepolia.etherscan.io/tx/0x11912ced8d411d04c9146adf6d356fccb93d8d037c2436f5c3e99c195034031e)

Transaction ID: 0x11912ced8d411d04c9146adf6d356fccb93d8d037c2436f5c3e99c195034031e

## Sample output of the test cases 
```cmd
  CollateralizedLoan
    ✔ Should deposit collateral
    ✔ Should fund loan
    ✔ Should repay loan
    ✔ Should claim collateral

  Lock
    Deployment
      ✔ Should set the right unlockTime
      ✔ Should set the right owner
      ✔ Should receive and store the funds to lock
      ✔ Should fail if the unlockTime is not in the future
    Withdrawals
      Validations
        ✔ Should revert with the right error if called too soon
        ✔ Should revert with the right error if called from another account
        ✔ Shouldn't fail if the unlockTime has arrived and the owner calls it
      Events
        ✔ Should emit an event on withdrawals
      Transfers
        ✔ Should transfer the funds to the owner


  13 passing (628ms)
```

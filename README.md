# fabric-student-record
The student-record sample demonstrates:

Connecting a client application to a Fabric blockchain network.
Submitting smart contract transactions to update ledger state.
Evaluating smart contract transactions to query ledger state.
Handling errors in transaction invocation.

#About the running sample
For a more detailed walk-through of the application code and client API usage, refer to the Running a  [Fabric Application tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html) in the main Hyperledger Fabric documentation.

#Smart Contract
The smart contract (in folder chaincode-js) implements the following functions to support the application:

CreateStudent
ReadStudent
UpdateStudent
ReadallStudent
#Student Records Fields
- First Name
- Last Name
- Email
- Mobile
- Address
- City
## Running the sample

The Fabric test network is used to deploy and run this sample. Follow these steps in order:

1. Create the test network and a channel (from the `test-network` folder).
   ```
   ./network.sh up createChannel -c mychannel -ca
   ```

1. Deploy one of the smart contract implementations (from the `test-network` folder).
   ```
   # To deploy the JavaScript chaincode implementation
   ./network.sh deployCC -ccn basic -ccp ../student-basic/chaincode-js/ -ccl javascript

  
   ```

1. Run the application (from the `student-basic` folder).
   ```
   # To run the javascript sample application
   cd cli-nodejs-application
   npm install
   npm start

  
   ```

## Clean up

When you are finished, you can bring down the test network (from the `test-network` folder). The command will remove all the nodes of the test network, and delete any ledger data that you created.

```
./network.sh down
```

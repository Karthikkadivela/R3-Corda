# Nonfungible house token  sample cordapp 

This CorDapp provides a basic example to create, issue and perform a token exchange of fungible and non-fungible token in 
Corda utilizing the Token SDK.

## Pre-Requisites
For development environment setup, please refer to: [Setup Guide](https://docs.corda.net/getting-set-up.html).
## Usage
### Running the CorDapp

Open a terminal and go to the project root directory and type: (to deploy the nodes using bootstrapper)
```
./gradlew clean deployNodes
```
Then type: (to run the nodes)
```
./build/nodes/runnodes
```

### Interacting with the nodes

First go to the shell of PartyA and issue some USD to Party C. We will need the fiat currency to exchange it for the house token.

    start FiatCurrencyIssueFlow currency: USD, amount: 100000000, recipient: PartyC

We can now go to the shell of PartyC and check the amount of USD issued. 

    run vaultQuery contractStateType: com.r3.corda.lib.tokens.contracts.states.FungibleToken

Once we have the USD issued to PartyC, we can Create and Issue the HouseToken to PartyB. Goto PartyA's shell to create and issue the house token.

    start HouseTokenCreateAndIssueFlow owner: PartyB, valuation: 10000 USD, noOfBedRooms: 2, constructionArea: 1000sqft, additionInfo: NA, address: Mumbai

We can now check the issued house token in PartyB's vault. 

    run vaultQuery contractStateType: com.r3.corda.lib.tokens.contracts.states.NonFungibleToken

we can check PartyB's vault to view the `EvolvableToken`

    run vaultQuery contractStateType: HouseState

Goto PartyB's shell to initiate the token sale where houseId would be the linear id of the non-fungible token.

    start HouseSaleInitiatorFlow houseId: <XXXX-XXXX-XXXX-XXXXX>, buyer: PartyC

Run the below commands in PartyB and PartyC's shell to verify the same

    // Run on PartyB's shell
    run vaultQuery contractStateType: com.r3.corda.lib.tokens.contracts.states.FungibleToken
    // Run on PartyC's shell
    run vaultQuery contractStateType: com.r3.corda.lib.tokens.contracts.states.NonFungibleToken

<<<<<<< HEAD
## Accounts

### What are accounts?

The Accounts CorDapp allows a CorDapp developer to split a Corda node's vault up into logical sub-vaults.<br>
Not all states stored in a node's vault need to be allocated to an account. Only those states which are held by PublicKeys assigned to an account ID are held by accounts.

<li>An account on a node is just a collection of PublicKeys which have been all assigned to the same UUID, which is the linearId of the AccountInfo state</li>
<li>These PublicKeys can then be used to participate in ContractStates and that's how Corda determines which account a ContractState belongs to.</li>
<li>When the transaction containing said ContractState is committed to the ledger, we can then say that ContractState is owned or participated in by the account that the PublicKey is allocated to. </li>
<li>When you wish to query the vault it is possible to specify from which account you wish to query states from.</li>

<img src="https://github.com/GD-MSRIT/R3Corda-AIF/blob/main/docs/figures/account1.png" width="750px" height="300px"><br><br>
### AccountInfo state

The base building block for the Accounts CorDapp is the AccountInfo state. It is a ContractState, so can be shared with other nodes and contains basic information about an account:

<li>Account host (Party) which is used to map PublicKeys to a host node</li>
<li>Account name (String) which is usually a human readable string to identify the account. It must be unique at the account host level but may not be unique at the network level.</li>
<li>Account ID (UUID) which is a 128-bit random ID that should be unique at the network level. The account ID is used by Corda to map PublicKeys to accounts.</li>
<br>
There is a one-to-many relationship between node to account: a Corda node can host many accounts and this is depicted particularly well by the image below-<br>

<img src="https://github.com/GD-MSRIT/R3Corda-AIF/blob/main/docs/figures/account2.png" width="350px" height="450px"><br><br>

The image shows that a node can host many accounts and that:

<li>an account hosted by a node can transact with an account hosted by another node</li>
<li>two accounts hosted by the same node can transact with each other</li>
<li>an account hosted by a node can transact with a regular Corda node</li>

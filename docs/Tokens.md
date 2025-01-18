### Tokens SDK in Corda

#### Two parts inside the the SDK (Two .jar files)
<li> Contracts, which contains the base token types, states and contracts needed to create a token, including token type definitions for fiat and digital currencies.</li>
<li> Workflows, which contains the flows for issuing, moving, redeeming tokens, and selection workflows, which allow a party to select which source of fungible tokens they will use to pay with in a transaction. </li>

#### Types of Tokens
<li><b>Fungible tokens</b> are represented by the FungibleToken class and can be split and merged – just as the assets they represent, like money or stocks - can be split and merged.</li>
<li><b>Non-fungible tokens</b> are represented by the NonFungibleTokens state, and cannot be split and merged - just as the assets they represent, like physical diamonds or a house – cannot be split and merged.</li>
<li><b>Evolvable assets</b> change over time - not just in value, but in other ways, such as the condition of a car, or size of a house. These tokens are represented by the EvolvableTokenType</li>
<li><b>Non-evolvable assets</b> have no way of changing over time. While the markets may fluctuate, a US dollar bill does not change into a different state. It cannot evolve into a 1 Euro coin.</li>

| Asset |	Fungibility	| Evolvability	| On / off ledger asset |
| :---              |    :----  |   :---  |  :---  | 
|US Dollar|	Fungible|	Non-evolvable	|Off-ledger asset|
|Ledger-native coin|	Fungible	|Non-evolvable	|On-ledger asset|
|Diamonds	|Non-Fungible|	Evolvable|	Off-ledger asset|

Reference link : https://corda.net/blog/introduction-to-token-sdk-in-corda/

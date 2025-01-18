# Corda MirrorTable

### Parties

This CordApp assumes there are 4 parties:

* **EKI Energy Systems** - creates and maintains the stock state and pays dividends to shareholders after some time passes.
* **Shareholder** - receives stock.
* **Bank** - issues fiat tokens.
* **Observer** - monitors all the stocks by keeping a copy of of transactions whenever a stock is created or updated. (In reality, this might be a financial regulatory authority like the SEC.)

### Running the CorDapp

Open a terminal and go to the project root directory and type: (to deploy the nodes using bootstrapper)
```
./gradlew.bat clean build deployNodes  
```
Then type: (to run the nodes)
```
./build/nodes/runnodes
```
##### 1. IssueMoney : To issue Fiat currency to ShareHolder, On Bank Node
>On bank node, execute <br>`start IssueMoney currency: USD, amount: 500000, recipient: ShareHolder`

##### 2. IssueStock - Stock Issuer
>On company EKI Company node, execute <br>`start CreateAndIssueEKIFlow symbol: TEST, name: "Stock, SP500", currency: USD, price: 10 USD, issueVol: 500, notary: Notary`

##### 3. Notification Flow : Executed on observer node

>Executed on observer node, execute <br>`flow start NotificationFlowInitiator symbol: TEST, name: "Stock, SP500", currency: USD, price: 10, investor: ShareHolder`

##### 4. Acceptance Flow Intiator : Executed on ShareHolder node

>Executed on ShareHolder node, execute <br>`flow start AcceptanceRequestFlowInitiator name: EKISystems, symbol: TEST, total_price: 50.00, no_of_shares: 5, company: Company`

##### 5. Acceptance Flow Responder : Executed on Company node

>Executed on ShareHolder node, execute <br>`flow start AcceptanceValidateFlowInitiator linearId: "from previous step"`

##### 6. Swap Contract intiated on Company end

>Executed on Company node, execute <br>`flow start MoveStockIntiator symbol: TEST, quantity: 5, recipient: ShareHolder, total_price: 50 USD`

##### 7. MirrorState on ShareHolder End
`flow start MirrorFlowInitiator investor_name: Karthik, symbol: TEST, no_of_shares: 50, holder: Company`

##### 8. Get token balances - Any node
Query the balances of different nodes. This can be executed at anytime.
> Get stock token balances
<br>`start GetStockBalance symbol: TEST`

>Get fiat token balances
<br>`start GetFiatBalance currencyCode: USD`

### To run the spring boot server of different nodes

> Company
<br>`./gradlew.bat runCompanyServer`
<br> Access at localhost:50100

> ShareHolder
<br>`./gradlew.bat runShareHolderServer`
> <br> Access at localhost:50200

> ShareHolder
<br>`./gradlew.bat runBankServer`
<br> Access at localhost:50300

> ShareHolder
<br>`./gradlew.bat runObserverServer`
> <br> Access at localhost:50400

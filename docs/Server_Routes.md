# Corda endpoints
This documentation specifies all the available endpoints in the corda network for the project.

## Available routes 

### Company Node
- <b>GET</b>`    <company_route>/getStockBalance`
    ```
    http://localhost:52232/getStockBalance
    ```
    <b>Description</b> : To get company shares balance

    <b>Body</b> : None

    <b>Sample Output</b> :
    ```
    You currently have 400 TEST stocks
    ```

- <b>GET</b>`    <company_route>/getFiatCurrencyBalance`
    ```
    http://localhost:52232/getFiatCurrencyBalance
    ```
    <b>Description</b> : To get Fiat Currency balance

    <b>Body</b> : None

    <b>Sample Output</b> :
    ```
    You currently have 100 USD
    ```
- <b>POST</b>`    <company_route>/createCompanyShares`
    ```
    http://localhost:52232/createCompanyShares
    ```
    <b>Description</b> : To issue company shares

    <b>Body</b> : symbol( `String` ) | name( `String` ) | currency( `String` ) | price( `Int` ) | issueVal( `Int` )

    <b>Sample Input</b> :
    ```
    {  
        "symbol":"TEST",
        "name":"Stock, SP500",
        "currency": "USD",
        "price":10,
        "issueVal":400
    }
    ```
    <b>Sample Output</b> :
    ```
    Generated 400 TEST stocks with price: 10.00 USD USD
    Transaction ID: 95955D814045852E86BC86E565F327EE2B3801C6F9433FE5BFD5471C751F3E83
    ```
- <b>POST</b>`    <company_route>/acceptance`
    ```
    http://localhost:52232/acceptance
    ```
    <b>Description</b> : To accept investor's request to buy shares

    <b>Body</b> : Raw string input of request Id 

    <b>Sample Input</b> :
    ```
    8bc1fea9-0b28-4315-8b7b-57be21f15a96
    ```
    <b>Sample Output</b> :
    ```
    SignedTransaction(id=A9B73BBE7F3FA1ACEF718EC779D36027CB5F7A271A9461874D64E21E438CF028)
    ```
- <b>POST</b>`    <company_route>/swap?inv_id={investor_id}`
    ```
    http://localhost:52232/swap?inv_id=2
    ```
    <b>Description</b> : To swap company shares and fiat currency

    <b>Body</b> : symbol( `String` )  | quantity( `Int` ) | total_price( `Int` )

    <b>Sample Input</b> :
    ```
    {
        "symbol": "TEST", 
        "quantity": 50, 
        "total_price": 20
    }
    ```
    <b>Sample Output</b> :
    ```
    Issued 50 TEST stocks to ShareHolder1.
    Transaction ID: F19822C43FA759353BD0728DE28094661211D6E5B7A6AC0DC85B59DFE8D07825
    ```

### ShareHolder Node
- <b>GET</b>`    <shareHolder_route>/getStockBalance`
    ```
    http://localhost:50002/getStockBalance
    ```
    <b>Description</b> : To get company shares balance

    <b>Body</b> : None

    <b>Sample Output</b> :
    ```
    You currently have 40 TEST stocks
    ```

- <b>GET</b>`    <shareHolder_route>/getFiatCurrencyBalance`
    ```
    http://localhost:50002/getFiatCurrencyBalance
    ```
    <b>Description</b> : To get Fiat Currency balance

    <b>Body</b> : None

    <b>Sample Output</b> :
    ```
    You currently have 1000000 USD
    ```
- <b>POST</b>`    <shareHolder_route>/proposal?comp_id={company_id}`
    ```
    http://localhost:50002/proposal?comp_id=1
    ```
    <b>Description</b> : To send request of company shares to company via trustee

    <b>Body</b> : company_name( `String` ) | symbol( `String` ) | total_price( `Float` ) | no_of_shares( `String` )

    <b>Sample Input</b> :
    ```
    {  
        "company_name":"EKISystems",
        "symbol":"TEST",
        "total_price":50.00,
        "no_of_shares":"5"
    }
    ```
    <b>Sample Output</b> :
    ```
    Acceptance State Request has been sent to: Company1
    Case Id: 8bc1fea9-0b28-4315-8b7b-57be21f15a96
    ```

### Observer Node
- <b>POST</b>`    <observer_route>/notifyInvestors?inv_id={inverstor_id}`
    ```
    http://localhost:50105/notifyInvestors?inv_id=2
    ```
    <b>Description</b> : To send notification to investors

    <b>Body</b> : symbol( `String` ) | name( `String` ) | price( `Int` ) | currency( `String` )

    <b>Sample Input</b> :
    ```
    {  
        "symbol":"TEST",
        "name":"Stock, SP500",
        "currency": "USD",
        "price":10
    }
    ```
    <b>Sample Output</b> :
    ```
    SignedTransaction(id=25D42571BE99E7032B3131F8EBD03AFCB788CDD96F6AB4B3650A7C09CF88CBAA)
    ```


### Bank Node
- <b>POST</b>`    <bank_route>/issueUSD`
    ```
        http://localhost:50103/issueUSD
    ```
    To issue USD to shareholder

    Body : currency( `String` ) | qty( `String` )

    Sample Input :
    ```
    {
        "currency":"USD",
        "qty":500000
    }
    ```
    Sample Output :
    ```
   Issued to ShareHolder1 500000 USD for stock issuance.
    Transaction ID: C5A6EDF8209A6BA98792446241284E51BF579A87DE9ADB9388BD6E5E890B165C
    ```

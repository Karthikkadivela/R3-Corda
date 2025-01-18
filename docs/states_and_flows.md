### Defining Contract, Flows and States
#### Parties
<li>Bank</li>
<li>Stakeholders (Investor)</li>
<li>EKI Energy Systems (Company)</li>
<li>AIF (Trustee)</li>

#### States
<li><b>EKI state</b> - Represents the details of a share - company name, symbol, total supply, price for each share.</li>
<li><b>Notification state </b>- Represents the information to be broadcasted to all Investors from the Trustee - company name, symbol, currency, price for each share.</li>
<li><b>Acceptance state </b>- Represents the request made by an investor to EKI - Investor name, Company name, number of shares requested.</li>

#### Flows
<li><b>CreateAndIssueStock</b> - Initiated by the company to create a share.</li>
<li><b>IssueMoney</b> - Initiated by the bank to transfer fiat currency to the investor.</li>
<li><b>NotificationFlow</b> - Initiated by the trustee to broadcast information about available shares to the investor.</li>
<li><b>InitiateAcceptance</b> - Initiated by the investor to create an Acceptance state.</li>
<li><b>ClaimAcceptance</b> - Initiated by "InitiateAcceptance" flow.</li>
<li><b>InitiateSwap</b> - Initiated by the company with the signature of the Trustee</li>
<li><b>GetTokenBalance</b> - Can be intiated on any node to query token balances</li>

#### Steps
<li>Self issual of EKIstate by the company.</li>
<li>Issual of fiat currency by the bank to the investor.</li>
<li>Trustee broadcasts notification to all investors using the Noitification state.</li>
<li>Interested investor issues an Acceptance state.</li>
<li>Acceptance state(Evolvable) is updated by the approval of the company, a SwapContract is initiated at the Company's end.</li>
<li>The log of transactions will we queried at the Trustee's end to form mirror table</li>
<li>Retrieve all the transactions to form the Mirrortable.</li>
<br><br>

<img src="https://github.com/GD-MSRIT/R3Corda-AIF/blob/main/docs/figures/flow_diagram1.png" width="800px" height="500px">

### Module Architecture

#### Name of the module
Private Equity Funding Solution Using Blockchain Technology (R3 Corda)

#### Purpose of the module
<ol>
<li>The most common form of ownership in a company is common shares. A share allows its holder to participate in the ownership and decision-making of the company based on the percentage of common shares held by that shareholder. </li>
<li>A capitalization table or a cap table is a document, like a spreadsheet or a database table, that contains the details of who has ownership in a company. It lists all the securities or shares in a company including stock and shows the equity capitalization for a company. </li>
<li>Since cap tables are manually maintained, there is frequently a discrepancy between the cap table and the firm's share register, and these errors in the spreadsheet might later snowball into significant problems for the company if they are ignored.</li>
<li>Cap Tables stored on a centralized database table or a spreadsheet can be prone to serious attacks.</li>
<li>Thus, a Corda based platform which brings companies and investors together for private equity funding is proposed. A secure version of cap table, i.e. Mirror tables will be used to provide the functionalities of cap tables. A Mirror table is to a cap table what a stable coin is to a fiat currency.</li>
<li>The interactions between the company, investors and trustee will be recorded onto distributed ledgers through smart contracts.</li>
<li>The platform also opens up more possibilities for increasing stakeholder participation because it makes it easy to manage communications with investors and empowers more people to participate in an ethical economy.</li>
</ol>

#### Design Goals 
<ol>
<li>Security: The design should ensure the security of the cap table data and protect it from unauthorized access or tampering.</li>
<li>Reliability: The module should be reliable and provide 24/7 uptime to ensure that the cap table data is always accessible to authorized parties.</li>
<li>Compliance: The module should comply with legal and regulatory requirements, especially regarding private equity funding and the handling of sensitive financial information.</li>
<li>Scalability: The module should be scalable to accommodate the growth of the company and the increasing number of investors.</li>
<li>Usability: The design should be user-friendly and intuitive to enable easy interaction between the company, investors, and trustees.</li>
<li>Efficiency: The module should be designed to optimize the processing of transactions and minimize delays and errors in the cap table management process.</li>
<li>Flexibility: The design should be flexible to accommodate future changes in business requirements and regulatory frameworks.</li>
</ol>

#### Architecture

##### Frontend
The frontend will be built using React JS, which will interact with the backend via RESTful APIs. React JS provides a flexible and scalable way to create user interfaces for web applications.<br>

##### Backend
The backend will be built using Java and Corda, which will handle the business logic, storage, and smart contract functionalities. The Corda nodes will communicate with each other using the Corda messaging protocol. The Corda node will use the Corda vault to store state information, including the Mirror table. The backend will be divided into the following services:
<ul>
<li><b>Authentication and Authorization: </b>This service will handle the authentication and authorization of users, ensuring that only authorized users can access the platform.</li>

<li><b>Investor Management: </b>This service will handle investor management functionalities, such as creating and managing investor profiles, managing investments, and providing investment-related reports.</li>

<li><b>Company Management: </b>This service will handle company management functionalities, such as creating and managing company profiles, managing funding rounds, and providing company-related reports.</li>

<li><b>Smart Contract Management: </b>This service will handle the deployment, execution, and management of smart contracts.</li>

<li><b>Mirror Table: </b>The Mirror table will be implemented as a separate service, which will handle the functionalities of the cap table. The Mirror table will store the details of who has ownership in a company, and it will show the equity capitalization for a company.</li>

<li><b>Node JS Gateway: </b>The Node JS Gateway will act as a bridge between the frontend and the backend, providing a unified API layer for the frontend to interact with the backend.</li>

</ul>

##### Tools and Technologies

###### Technologies:
 <ul>
<li>Java: Java is a popular, high-level, object-oriented programming language that is platform-independent and widely used in a variety of applications, including web, mobile, desktop, and enterprise applications.</li>
<li>Java Virtual Machine (JVM): Corda runs on the JVM, which is a platform-independent execution environment that enables Java-based applications to run on different platforms.</li>
<li>Spring Boot: Spring Boot is an open-source framework used to develop microservices and web applications in Corda projects.</li>
<li>Corda: Corda is a distributed ledger technology that offers secure and efficient sharing of data between parties and  is designed to support complex transactions and offers features such as privacy, scalability, and interoperability.</li>
</ul>
<br>

###### Tools:
 <ul>
<li>Gradle: Gradle is a build automation tool used in Corda projects to manage dependencies, build, test and package applications.</li>
<li>IntelliJ Idea: IntelliJ IDEA is a popular Java IDE with advanced features for efficient, high-quality code development.</li>
<li>Corda Network Map Service: Corda Network Map Service is a tool used to manage and provide information about nodes and their locations in a Corda network.</li>
 </ul>
 
<img src="https://github.com/GD-MSRIT/R3Corda-AIF/blob/main/docs/figures/flow_diagram1.png" width="800px" height="500px"><br><br>

#### Data Flow

The company would  issue new shares as the first step. The company specifies the name of the company, symbol of the token, total supply and the price of each share. The shares are implemented as Fungible tokens.
<br><br>
The second step would be the issue of USDC by the Bank to the Shareholder. The bank specifies the amount of USDC to be issued and the party to whom it should be issues.
<br><br>
Once the company issues shares as tokens, the Trustee broadcasts this information to the investors. 
<br><br>
Investors can then participate in the crowdfunding campaign by sending a request to the Company conveying their interest to buy the shares. The Trustee monitors this by adding its signature to the request transaction.
<br><br>
The company views the list of requests made and decides to sell it to one of the interested shareholders. Once the company accepts the request, a corresponding number of tokens are transferred from the company’s vault to the investor’s vault. Its equivalent USDC is transferred from the investor’s vault to the company's vault. The Trustee monitors this by adding its signature to the swap transactions.
<br><br>
The Mirrortable is updated by fetching the details form the transactions logged priorly.
<br><br>
<img src="https://github.com/GD-MSRIT/R3Corda-AIF/blob/main/docs/figures/sequence_dia.png" width="800px" height="450px"><br><br>

#### Performance

##### Expected performance of the module:
<ul>
<li>The platform should be able to handle a large number of simultaneous users without experiencing significant slowdowns or downtime. </li> 
<li>The platform should have a fast response time to user requests, with pages and features loading quickly and without lag or delay. </li>
<li>The platform should be able to process transactions quickly and efficiently, with minimal delay or error rates. </li>
<li>The platform should be able to handle large amounts of data, both in terms of storage capacity and processing power. </li>
<li>The platform should be designed with scalability in mind, so that it can easily handle increases in user demand and transaction volume. </li>
<li>The platform should have strong security measures in place to protect user data and prevent unauthorized access or attacks. </li>
<li>The platform should have regular performance monitoring and optimization processes in place to ensure that it continues to meet performance requirements over time. </li>
</ul>

##### Performance metrics to measure the module's performance:
<ul>
<li>Transaction throughput: measures the number of transactions the module can handle within a given time period. </li>
<li>Response time: measures the time it takes for the module to respond to a user's request. </li>
<li>Security: measures the module's ability to protect against attacks on the cap table and ensure data privacy. </li>
<li>User satisfaction: measures user satisfaction with the module's performance and functionality. </li>
</ul>

#### Scalability
<ul>
 <li>The module will be designed to allow for horizontal scaling, meaning additional resources can be added to increase capacity as needed.
</li>
 <li>This may include adding more nodes to the network or increasing the capacity of the existing nodes to handle increased traffic.</li>
</ul>

##### Scalability metrics to measure the module's scalability:
<ul>
<li><b>Network latency:</b> measures the time it takes for data to travel across the network. As the network grows, latency may increase, and this metric can help identify when additional resources are needed to reduce latency and maintain performance.
 </li>
 <li><b>Node capacity:</b> measures the capacity of each node in the network to handle transactions. As the number of transactions grows, additional nodes may be needed to maintain performance.
</li>
 <li><b>Data throughput:</b> measures the amount of data that can be processed by the network within a given time period. This metric can help identify bottlenecks and determine if additional resources are needed to maintain performance.
</li>
 <li><b>Resource utilization: </b>measures the utilization of resources such as CPU, memory, and storage. This metric can help identify when additional resources are needed to support increased demand.
</li>
 <li><b>Transaction processing time: </b>measures the time it takes for transactions to be processed. As the number of transactions grows, this metric can help determine if additional resources are needed to maintain acceptable processing times.</li>
 </ul>
 
 #### Security
 
 ##### Security measures implemented in the module:
 <li>Use of Corda's permissioned blockchain technology, which only shares information with the parties involved in the transaction, to enhance data privacy and prevent unauthorized access.</li>
 <li>Implementation of smart contracts to automate transactions and eliminate the need for intermediaries, reducing the risk of human error and fraudulent activities.</li>
<li>Use of a Mirror table as the blockchain version of the cap table to provide 24/7 uptime, international wallet support, and integration with smart contracts, while the off-chain cap table provides legal compliance.</li>
 <li>Use of multi-factor authentication to prevent unauthorized access to user accounts and reduce the risk of identity theft.</li>
 
 ##### Potential security vulnerabilities and how they will be addressed:
<li><b>Smart contract vulnerabilities: </b>Smart contracts may contain coding errors or be susceptible to hacking, which can lead to unauthorized access to sensitive data. To address this, smart contracts will be thoroughly tested and audited to ensure they are free of coding errors and vulnerabilities.
</li>
<li><b>Malicious attacks on the platform: </b>The platform may be targeted by hackers seeking to steal sensitive data or disrupt operations. To address this, the module will be regularly monitored for suspicious activity, and measures such as firewalls and intrusion detection systems can be implemented to prevent unauthorized access.
</li>
<li><b>User authentication vulnerabilities:</b> User authentication mechanisms may be compromised, leading to unauthorized access to user accounts and sensitive data. To address this, multi-factor authentication will be implemented to prevent unauthorized access to user accounts.</li>

#### Testing

##### Test plan

<li><b>Unit testing:</b> Conduct unit testing on individual components of the platform to ensure that they meet the functional requirements and are free of defects.</li>
<li><b>Integration testing:</b> Test the integration of the different components of the platform to ensure that they work together seamlessly.</li>
<li><b>Functional testing:</b> Conduct functional testing to ensure that the platform meets the functional requirements.</li>

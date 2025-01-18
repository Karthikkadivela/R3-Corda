## Oracles in Corda
### A bridge between Corda Network and the Outside world

### What are Oracles?
<li> Oracles in Corda are Corda Nodes running Corda Services, which links the Corda Network to the outside world. </li>
<li> They are not generally participants in a business transaction but provide network services. </li>
 <li>It consists of flows and services. The flows are used for communicating with the transacting nodes while the service is the oracle service.</li>

### Approaches to implementing oracles

| Using Commands|	Using attachments	| 
| :---              |    :----  |
|Fact is embedded in the transaction itself.|	Fact is a separate object to the transaction and is referred to by hash.|
|Oracle then acts as a co-signer to the entire transaction.|  Nodes download attachments from peers at the same time as they download transactions|
| Used for continuously changing data, like a stock price|   Used for static data such as PDFs.|
|Very small data |  Large data |

### Implementing oracle services

#### First approach 

<li>The sender sends the transaction to the oracle.</li>
<li>The oracle inserts a command with the fact and signs the transaction.</li>
<li>The oracle sends the transaction back to the sender.</li>

#### Second approach
<li>  The creator of the transaction asks the oracle for the fact.</li>
<li>  The creator insert a command with that fact into the transaction.  </li>
<li>  They then send it to the oracle for signing.   </li>
<li> Oracle checks that the command has the correct data and signs if so. </li>
<br>
First approach means that the oracle has to be the first entity to sign the transaction, which might impose ordering constraints we don’t want to deal with. It is recommended to get all parties to sign in parallel. Thus, the second approach is mostly used.
<br>
<br>
<br>
Reference link : https://docs.r3.com/en/tutorials/corda/4.8/os/supplementary-tutorials/oracles.html

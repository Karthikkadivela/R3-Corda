package com.template.webserver;

import com.template.flows.*;
import com.template.webserver.model.*;
import liquibase.util.grammar.Token;
import net.corda.core.contracts.Amount;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.messaging.CordaRPCOps;
import net.corda.core.transactions.SignedTransaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import net.corda.core.flows.*;

import java.math.BigDecimal;
import java.util.Currency;

/**
 * Define your API endpoints here.
 */
@CrossOrigin(origins= {"*"}, maxAge = 4800, allowCredentials = "false")
@RestController
@RequestMapping("/") // The paths for HTTP requests are relative to this base path.
public class Controller {
    private final CordaRPCOps proxy;
    private final static Logger logger = LoggerFactory.getLogger(Controller.class);

    public Controller(NodeRPCConnection rpc) {
        this.proxy = rpc.proxy;
    }

    @GetMapping(value = "/templateendpoint", produces = "text/plain")
    private String templateendpoint() {
        return "Define an endpoint here.";
    }

    @GetMapping(value = "/getStockBalance", produces = "text/plain")
    private String shares(@RequestParam(defaultValue = "MST") String Symbol){
        try {
            String result = proxy.startTrackedFlowDynamic(QueryBalanceFlow.GetStockBalance.class,Symbol).getReturnValue().get();
            return result;
        } catch (Exception e) {
            return "Error";
        }
    }

    @GetMapping(value = "/getFiatCurrencyBalance", produces = "text/plain")
    private String fiatCurrency(){
        try {
            String result = proxy.startTrackedFlowDynamic(QueryBalanceFlow.GetFiatBalance.class,"USD").getReturnValue().get();
            return result;
        } catch (Exception e) {
            return "Error";
        }
    }

//    @GetMapping(value = "/createCompanyShares", produces = "text/plain")
//    private String createShares(){
//
//            CordaX500Name partyX500Name = CordaX500Name.parse("O=Notary,L=London,C=GB");
//            Party notary = proxy.notaryPartyFromX500Name(partyX500Name);
//
//            Currency t = Currency.getInstance("USD");
//            Amount<Currency> usd = new Amount<>(10,t);
//            // symbol: TEST, name: "Stock, SP500", currency: USD, price: 10 USD, issueVol: 500, notary: Notary
//        try {
//            String result = proxy.startTrackedFlowDynamic(CreateAndIssueEKIFlow.class, "TEST", "Stock, SP500", "USD", usd, 500, notary).getReturnValue().get();
//            // Return the response.
//            return result;
//        }catch (Exception e){
//            return "Error: " + e;
//        }
//
//    }

    @PostMapping(value = "/createCompanyShares", produces = "text/plain")
    private String createShares(@RequestBody SampleModel obj){

        CordaX500Name partyX500Name = CordaX500Name.parse("O=Notary,L=London,C=GB");
        Party notary = proxy.notaryPartyFromX500Name(partyX500Name);

        Currency t = Currency.getInstance(obj.getCurrency());
        Amount<Currency> usd = new Amount<>(obj.getPrice()*100,t);
        // symbol: TEST, name: "Stock, SP500", currency: USD, price: 10 USD, issueVol: 500, notary: Notary
        try {
            String result = proxy.startTrackedFlowDynamic(CreateAndIssueEKIFlow.class, obj.getSymbol(), obj.getName(), obj.getCurrency(), usd, obj.getIssueVal(), notary).getReturnValue().get();
            // Return the response.
            System.out.println(result);
            return result;
        }catch (Exception e){
            return "Error: " + e;
        }

    }

    @PostMapping(value = "/issueUSD", produces = "text/plain")
    private String issueMoney(@RequestBody issueUSDModel obj ){
        CordaX500Name partyX500Name = CordaX500Name.parse("O=ShareHolder1,L=New York,C=US");
        Party shareHolder = proxy.wellKnownPartyFromX500Name(partyX500Name);

//        Currency t = Currency.getInstance(obj.getCurrency());
        Long quantity = new Long(obj.getQty());
        // start IssueMoney currency: USD, amount: 500000, recipient: ShareHolder
        try {
            String result = proxy.startTrackedFlowDynamic(IssueMoney.class, obj.getCurrency(), quantity, shareHolder).getReturnValue().get();
            // Return the response.
            return result;
        }catch (Exception e){
            return "Error:-> " + e;
        }
    }

    @PostMapping(value = "/notifyInvestors", produces = "text/plain")
    private String notification(@RequestBody ShareDetailsModel obj,@RequestParam(defaultValue = "2") String inv_id){

        CordaX500Name partyX500Name = CordaX500Name.parse("O=ShareHolder1,L=New York,C=US");;
        Party shareHolder;
        if (inv_id == "2")
            partyX500Name = CordaX500Name.parse("O=ShareHolder1,L=New York,C=US");
        else if(inv_id == "3")
            partyX500Name = CordaX500Name.parse("O=ShareHolder2,L=New York,C=US");
        else if(inv_id == "4")
            partyX500Name = CordaX500Name.parse("O=ShareHolder3,L=New York,C=US");

        shareHolder = proxy.wellKnownPartyFromX500Name(partyX500Name);
        // flow start NotificationFlowInitiator symbol: TEST, name: "Stock, SP500", currency: USD, price: 10, investor: ShareHolder
        try {
            String result = proxy.startTrackedFlowDynamic(NotificationFlow.NotificationFlowInitiator.class, obj.getSymbol(), obj.getName(), obj.getCurrency(), obj.getPrice(), shareHolder).getReturnValue().get().toString();
            // Return the response.
            return result;
        }catch (Exception e){
            return "Error: " + e;
        }
    }

    @PostMapping(value = "/proposal", produces = "text/plain")
    private String proposal(@RequestBody AcceptanceInitiateModel obj,@RequestParam(defaultValue = "1") String comp_id){
        CordaX500Name partyX500Name = CordaX500Name.parse("O=Company1,L=London,C=GB");
        Party company;

        System.out.println("comp ID: "+comp_id);

        if(comp_id == "1")
            partyX500Name = CordaX500Name.parse("O=Company1,L=London,C=GB");
        else if(comp_id == "2")
            partyX500Name = CordaX500Name.parse("O=Company2,L=London,C=GB");

        company = proxy.wellKnownPartyFromX500Name(partyX500Name);
        System.out.println(company);

        CordaX500Name partyX500Name1 = CordaX500Name.parse("O=Observer,L=New York,C=US");
        Party observer = proxy.wellKnownPartyFromX500Name(partyX500Name1);

        // flow start AcceptanceRequestFlowInitiator name: EKISystems, symbol: TEST, total_price: 50.00, no_of_shares: 5, company: Company, observer: Observer
        try {
            String result = proxy.startTrackedFlowDynamic(AcceptanceRequestFlow.AcceptanceRequestFlowInitiator.class, obj.getCompany_name(), obj.getSymbol(), obj.getTotal_price(), obj.getNo_of_shares(), company, observer).getReturnValue().get();
            // Return the response.
            System.out.println(result);
            return result;
        }catch (Exception e){
            return "Error: " + e;
        }
    }

    @PostMapping(value = "/acceptance", produces = "text/plain")
    private String acceptance(@RequestBody String acceptanceId){
        UniqueIdentifier uniqueID = UniqueIdentifier.Companion.fromString(acceptanceId);

//        System.out.println(uniqueID);

        // flow start AcceptanceValidateFlowInitiator linearId: "from previous step"
        try {
            String result = proxy.startTrackedFlowDynamic(AcceptanceValidateFlow.AcceptanceValidateFlowInitiator.class, uniqueID).getReturnValue().get().toString();
            // Return the response.
//            return "The proposal "+acceptanceId+" has been accepted";
            System.out.println(result);
            return result;
        }catch (Exception e){
            return "Error: " + e +"   "+uniqueID;
        }
    }

    @PostMapping(value = "/swap", produces = "text/plain")
    private String Swap(@RequestBody SwapModel obj,@RequestParam(defaultValue = "2") String inv_id){
        CordaX500Name partyX500Name = CordaX500Name.parse("O=ShareHolder1,L=New York,C=US");
        Party shareHolder;
        int inv_id1 = Integer.parseInt(inv_id);
        System.out.println(Integer.parseInt(inv_id));

        if(inv_id1 == 2)
        {
            partyX500Name = CordaX500Name.parse("O=ShareHolder1,L=New York,C=US");
            System.out.println(inv_id);
        }
        else if(inv_id1 == 3)
        {
            partyX500Name = CordaX500Name.parse("O=ShareHolder2,L=New York,C=US");
            System.out.println(inv_id);
        }
        else if(inv_id1 == 4)
        {
            partyX500Name = CordaX500Name.parse("O=ShareHolder3,L=New York,C=US");
            System.out.println(inv_id);
        }


        shareHolder = proxy.wellKnownPartyFromX500Name(partyX500Name);

        Currency t = Currency.getInstance("USD");
        Amount<Currency> usd = new Amount<>(obj.getTotal_price()*100,t);
        // flow start MoveStockIntiator symbol: TEST, quantity: 5, recipient: ShareHolder, total_price: 50 USD
        try {
            String result = proxy.startTrackedFlowDynamic(MoveStockIntiator.Initiator.class, obj.getSymbol(), obj.getQuantity(), shareHolder, usd ).getReturnValue().get().toString();
            // Return the response.
            return result;
        }catch (Exception e){
            return "Error: " + e;
        }
    }

    @PostMapping(value = "/mirrorTable", produces = "text/plain")
    private String mirror(@RequestBody MirrorTableModel obj){
        UniqueIdentifier uniqueID = new UniqueIdentifier();
        CordaX500Name partyX500Name = CordaX500Name.parse("O=Company1,L=London,C=GB");
        Party company = proxy.wellKnownPartyFromX500Name(partyX500Name);

        Party observer = proxy.wellKnownPartyFromX500Name(CordaX500Name.parse("O=Observer,L=New York,C=US"));

        // flow start MirrorFlowInitiator investor_name: Karthik, symbol: TEST, no_of_shares: 50, holder: Company
        try {
            String result = proxy.startTrackedFlowDynamic(MirrorFlow.MirrorFlowInitiator.class, obj.getInvestor_name(), obj.getSymbol(), obj.getNo_of_shares(), company,observer).getReturnValue().get().toString();
            // Return the response.
            return result;
        }catch (Exception e){
            return "Error: " + e;
        }
    }
}
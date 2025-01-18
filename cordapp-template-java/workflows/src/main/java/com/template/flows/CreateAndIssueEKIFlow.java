package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.r3.corda.lib.tokens.contracts.states.FungibleToken;
import com.r3.corda.lib.tokens.workflows.flows.rpc.CreateEvolvableTokens;
import com.r3.corda.lib.tokens.workflows.flows.rpc.IssueTokens;
import com.r3.corda.lib.tokens.workflows.utilities.FungibleTokenBuilder;
import com.template.states.EKIState;
import net.corda.core.contracts.Amount;
import net.corda.core.contracts.TransactionState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.node.services.IdentityService;
import net.corda.core.transactions.SignedTransaction;

import java.math.BigDecimal;
import java.util.*;

@InitiatingFlow
@StartableByRPC
public class CreateAndIssueEKIFlow extends FlowLogic<String> {
    private String symbol;
    private String name;
    private String currency;
    private Amount<Currency> price;
    private int issueVol;

    // Using NetworkmapCache.getNotaryIdentities().get(0) is not encouraged due to multi notary is introduced
    private Party notary;

    public CreateAndIssueEKIFlow(String symbol, String name, String currency, Amount<Currency> price, int issueVol, Party notary) {
        this.symbol = symbol;
        this.name = name;
        this.currency = currency;
        this.price = price;
        this.issueVol = issueVol;
        this.notary = notary;
    }

    @Override
    @Suspendable
    public String call() throws FlowException {

        // Sample specific - retrieving the hard-coded observers
        IdentityService identityService = getServiceHub().getIdentityService();
        List<Party> observers = getObserverLegalIdenties(identityService);
        System.out.println(observers);
        List<FlowSession> obSessions = new ArrayList<>();
        for(Party observer : observers){
            obSessions.add(initiateFlow(observer));
        }

        Party company = getOurIdentity();

        // Construct the output StockState
        final EKIState stockState = new EKIState(
                new UniqueIdentifier(),
                company,
                symbol,
                name,
                currency,
                price
        );

        // The notary provided here will be used in all future actions of this token
        TransactionState<EKIState> transactionState = new TransactionState<>(stockState, notary);

        // Using the build-in flow to create an evolvable token type -- Stock
        subFlow(new CreateEvolvableTokens(transactionState, observers));

        // Indicate the recipient which is the issuing party itself here
        //new FungibleToken(issueAmount, getOurIdentity(), null);
        FungibleToken stockToken = new FungibleTokenBuilder()
                .ofTokenType(stockState.toPointer())
                .withAmount(issueVol)
                .issuedBy(getOurIdentity())
                .heldBy(getOurIdentity())
                .buildFungibleToken();

        // Finally, use the build-in flow to issue the stock tokens. Observer parties provided here will record a copy of the transactions
        SignedTransaction stx = subFlow(new IssueTokens(Arrays.asList(stockToken), observers));
        return "\nGenerated " + this.issueVol + " " + this.symbol + " stocks with price: "
                + this.price + " " + this.currency + "\nTransaction ID: "+ stx.getId();
    }
    public static List<Party> getObserverLegalIdenties(IdentityService identityService){
        List<Party> observers = new ArrayList<>();
        for(String observerName : Arrays.asList("Observer", "Shareholder1")){
            Set<Party> observerSet = identityService.partiesFromName(observerName, false);
//            if (observerSet.size() != 1) {
//                final String errMsg = String.format("Found %d identities for the observer.", observerSet.size());
//                throw new IllegalStateException(errMsg);
//            }
            observers.add(observerSet.iterator().next());
        }
        return observers;
    }
}

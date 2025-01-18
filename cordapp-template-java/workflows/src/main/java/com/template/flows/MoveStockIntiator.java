package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.r3.corda.lib.tokens.contracts.states.FungibleToken;
import com.r3.corda.lib.tokens.contracts.types.TokenPointer;
import com.r3.corda.lib.tokens.contracts.types.TokenType;
import com.r3.corda.lib.tokens.workflows.flows.move.MoveTokensUtilities;
import com.r3.corda.lib.tokens.workflows.flows.rpc.MoveFungibleTokens;
import com.r3.corda.lib.tokens.workflows.flows.rpc.MoveFungibleTokensHandler;
import com.r3.corda.lib.tokens.workflows.internal.flows.distribution.UpdateDistributionListFlow;
import com.template.flows.utilities.CustomQuery;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.identity.CordaX500Name;
import com.template.states.EKIState;
import kotlin.Unit;
import net.corda.core.contracts.Amount;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Currency;
import java.util.List;

@InitiatingFlow
@StartableByRPC
public class MoveStockIntiator {
    @InitiatingFlow
    @StartableByRPC
    public static class Initiator extends FlowLogic<String> {
        private final String symbol;
        private final Long quantity;
        private final Party recipient;
        private final Amount<Currency> total_price;

        public Initiator(String symbol, Long quantity, Party recipient, Amount<Currency> total_price) {
            this.symbol = symbol;
            this.quantity = quantity;
            this.recipient = recipient;
            this.total_price = total_price;
        }

        @Override
        @Suspendable
        public String call() throws FlowException {

                // Obtain a reference to a notary we wish to use.
                //** Explicit selection of notary by CordaX500Name - argument can by coded in flows or parsed from config (Preferred)*/
                final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB"));

                /* Get the UUID from the houseId parameter */
            StateAndRef<EKIState> stateAndRef = getServiceHub().getVaultService().
                    queryBy(EKIState.class).getStates().stream()
                    .filter(sf->sf.getState().getData().getSymbol().equals(symbol)).findAny()
                    .orElseThrow(()-> new IllegalArgumentException("FungibleEKIState=\""+symbol+"\" not found from vault"));

                EKIState eki = stateAndRef.getState().getData();
                Amount<TokenType> amount = new Amount<>(quantity, eki.toPointer(EKIState.class));
            //PartyAndAmount partyAndAmount = new PartyAndAmount(holder, amount);

            //use built in flow to move fungible tokens to holder
                subFlow(new MoveFungibleTokens(amount,recipient));

                /* Build the transaction builder */
                TransactionBuilder txBuilder = new TransactionBuilder(notary);

        /* Create a move token proposal for the house token using the helper function provided by Token SDK. This would
        create the movement proposal and would be committed in the ledgers of parties once the transaction in finalized */
//                MoveTokensUtilities.addMoveFungibleTokens(txBuilder, getServiceHub(), recipient, getOurIdentity(), EKIState.class);

                /* Initiate a flow session with the buyer to send the house valuation and transfer of the fiat currency */
                FlowSession buyerSession = initiateFlow(recipient);

                /* Send the house valuation to the buyer */
                buyerSession.send(total_price);

                /* Receive inputStatesAndRef for the fiat currency exchange from the buyer, these would be inputs to the fiat currency exchange transaction */
                List<StateAndRef<FungibleToken>> inputs = subFlow(new ReceiveStateAndRefFlow<>(buyerSession));

                /* Receive output for the fiat currency from the buyer, this would contain the transferred amount from buyer to yourself */
                List<FungibleToken> moneyReceived = buyerSession.receive(List.class).unwrap(value -> value);

                /* Create a fiat currency proposal for the house token using the helper function provided by Token SDK */
                MoveTokensUtilities.addMoveTokens(txBuilder, inputs, moneyReceived);

                /* Sign the transaction */
                SignedTransaction initialSignedTrnx = getServiceHub().signInitialTransaction(txBuilder, getOurIdentity().getOwningKey());

                /* Call the CollectSignaturesFlow to receive signature of the buyer */
                SignedTransaction signedTransaction = subFlow(new CollectSignaturesFlow(initialSignedTrnx, Arrays.asList(buyerSession)));

                /* Call finality flow to notarise the transaction */
                SignedTransaction stx = subFlow(new FinalityFlow(signedTransaction, Arrays.asList(buyerSession)));

                /* Distribution list is a list of identities that should receive updates. For this mechanism to behave correctly we call the UpdateDistributionListFlow flow */
                subFlow(new UpdateDistributionListFlow(stx));

            return "\nIssued "+this.quantity +" " +this.symbol+" stocks to "
                    + this.recipient.getName().getOrganisation() + ".\nTransaction ID: "+stx.getId();

        }
    }

//    @InitiatedBy(Initiator.class)
//    public static class Responder extends FlowLogic<Unit>{
//
//        private FlowSession counterSession;
//
//        public Responder(FlowSession counterSession) {
//            this.counterSession = counterSession;
//        }
//
//        @Suspendable
//        @Override
//        public Unit call() throws FlowException {
//            // Simply use the MoveFungibleTokensHandler as the responding flow
//            return subFlow(new MoveFungibleTokensHandler(counterSession));
//        }
//    }
}

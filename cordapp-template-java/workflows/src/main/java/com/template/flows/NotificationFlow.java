package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.template.contracts.NotificationContract;
import com.template.states.NotificationState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.math.BigDecimal;
import java.util.*;
//import java.util.concurrent.Flow;

public class NotificationFlow {

    @InitiatingFlow
    @StartableByRPC
    public static class NotificationFlowInitiator extends FlowLogic<SignedTransaction>{

        private final String symbol;
        private final String name;
        private final String currency;
        private final BigDecimal price;

        private Party investor;

        public NotificationFlowInitiator(String symbol, String name, String currency, BigDecimal price, Party investor) {
            this.symbol = symbol;
            this.name = name;
            this.currency = currency;
            this.price = price;
            this.investor = investor;
        }
        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {

            final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

            UniqueIdentifier uniqueID = new UniqueIdentifier();
            NotificationState newNotification = new NotificationState(this.symbol, this.name, this.currency, this.price, this.getOurIdentity(), this.investor, uniqueID);

            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(newNotification)
                    .addCommand(new NotificationContract.Commands.Issue(),
                            Arrays.asList(getOurIdentity().getOwningKey(),investor.getOwningKey()));

            txBuilder.verify(getServiceHub());

            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            FlowSession otherPartySession = initiateFlow(investor);
            final SignedTransaction fullySignedTx = subFlow(
                    new CollectSignaturesFlow(partSignedTx, Arrays.asList(otherPartySession)));


            return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession)));
        }
    }

    @InitiatedBy(NotificationFlowInitiator.class)
    public static class NotificationFlowResponder extends FlowLogic<Void>{

        private FlowSession counterpartySession;

        public NotificationFlowResponder(FlowSession counterpartySession) {
            this.counterpartySession = counterpartySession;
        }

        @Override
        @Suspendable
        public Void call() throws FlowException{

            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterpartySession) {
                @Override
                @Suspendable
                protected void checkTransaction(SignedTransaction stx) throws FlowException {
                    /*
                     Additional Transaction checks can be done here.
                     * */
                }
            });

            //Stored the transaction into data base.
            subFlow(new ReceiveFinalityFlow(counterpartySession, signedTransaction.getId()));

            return null;
        }
    }


}

package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.template.contracts.AcceptanceContract;
import com.template.states.AcceptanceState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AcceptanceRequestFlow {
    @InitiatingFlow
    @StartableByRPC
    public static class AcceptanceRequestFlowInitiator extends FlowLogic<String> {

        private Party company;

        private Party observer;
        private final String name;
        private final String symbol;
        private final BigDecimal total_price;
        private final String no_of_shares;


        public AcceptanceRequestFlowInitiator(String name, String symbol, BigDecimal total_price, String no_of_shares,Party company,Party observer) {
            this.name = name;
            this.symbol = symbol;
            this.total_price = total_price;
            this.no_of_shares = no_of_shares;
            this.company = company;
            this.observer = observer;
        }

        @Suspendable
        @Override
        public String call() throws FlowException {
            //notary
            /** Explicit selection of notary by CordaX500Name - argument can by coded in flows or parsed from config (Preferred)*/
            final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB"));
            UniqueIdentifier uniqueID = new UniqueIdentifier();
            //Initiate Corporate Records validation
            AcceptanceState acceptanceState = new AcceptanceState(this.symbol,this.name,this.no_of_shares,this.total_price,this.company,getOurIdentity(),false,uniqueID,observer);

            //Build transaction
            final TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(acceptanceState)
                    .addCommand(new AcceptanceContract.Commands.Propose(),
                            Arrays.asList(getOurIdentity().getOwningKey(),company.getOwningKey(),observer.getOwningKey()));

            // Verify that the transaction is valid.
            txBuilder.verify(getServiceHub());

            // Sign the transaction.
            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            // Send the state to the counterparty, and receive it back with their signature.
//            FlowSession otherPartySession = initiateFlow(company);
//            FlowSession observerSession = initiateFlow(observer);
            List<FlowSession> otherSession = new ArrayList<>();
            otherSession.add(initiateFlow(company));
            otherSession.add(initiateFlow(observer));
//            final SignedTransaction fullySignedTx = subFlow(
//                    new CollectSignaturesFlow(partSignedTx, Arrays.asList(otherPartySession), CollectSignaturesFlow.Companion.tracker()));
//
//            // Notarise and record the transaction in both parties' vaults.
//            subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession)));

            final SignedTransaction fullySignedTx = subFlow(
                    new CollectSignaturesFlow(partSignedTx, otherSession, CollectSignaturesFlow.Companion.tracker()));

            subFlow(new FinalityFlow(fullySignedTx, otherSession));

            return "Acceptance State Request has been sent to: " + acceptanceState.getCompany().getName().getOrganisation()
                    +"\nCase Id: "+ acceptanceState.getLinearId();
        }
    }

    @InitiatedBy(AcceptanceRequestFlowInitiator.class)
    public static class AcceptanceRequestFlowResponder extends FlowLogic<Void> {
        //private variable
        private FlowSession counterpartySession;

        //Constructor
        public AcceptanceRequestFlowResponder(FlowSession counterpartySession) {
            this.counterpartySession = counterpartySession;
        }

        @Suspendable
        @Override
        public Void call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterpartySession) {
                @Suspendable
                @Override
                protected void checkTransaction(SignedTransaction stx) throws FlowException {
                }
            });
            //Stored the transaction into data base.
            subFlow(new ReceiveFinalityFlow(counterpartySession, signedTransaction.getId()));
            return null;
        }
    }
}
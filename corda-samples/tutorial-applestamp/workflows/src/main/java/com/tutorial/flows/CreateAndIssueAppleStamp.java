package com.tutorial.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.tutorial.contracts.AppleStampContract;
import com.tutorial.states.AppleStamp;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.util.Arrays;

public class CreateAndIssueAppleStamp {

    @InitiatingFlow
    @StartableByRPC
    public static class CreateAndIssueAppleStampInitiator extends FlowLogic<SignedTransaction> {

        private String stampDescription;
        private Party holder;

        public CreateAndIssueAppleStampInitiator(String stampDescription, Party holder) {
            this.stampDescription = stampDescription;
            this.holder = holder;
        }

        @Suspendable
        @Override
        public SignedTransaction call() throws FlowException {


            final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB"));


            UniqueIdentifier uniqueID = new UniqueIdentifier();
            AppleStamp newStamp = new AppleStamp(this.stampDescription, this.getOurIdentity(), this.holder, uniqueID);


            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(newStamp)
                    .addCommand(new AppleStampContract.Commands.Issue(),
                            Arrays.asList(getOurIdentity().getOwningKey(), holder.getOwningKey()));


            txBuilder.verify(getServiceHub());


            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);


            FlowSession otherPartySession = initiateFlow(holder);
            final SignedTransaction fullySignedTx = subFlow(
                    new CollectSignaturesFlow(partSignedTx, Arrays.asList(otherPartySession)));


            return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession)));
        }
    }

    @InitiatedBy(CreateAndIssueAppleStampInitiator.class)
    public static class CreateAndIssueAppleStampResponder extends FlowLogic<Void> {

        //private variable
        private FlowSession counterpartySession;

        public CreateAndIssueAppleStampResponder(FlowSession counterpartySession) {
            this.counterpartySession = counterpartySession;
        }

        @Override
        @Suspendable
        public Void call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterpartySession) {
                @Override
                @Suspendable
                protected void checkTransaction(SignedTransaction stx) throws FlowException {

                }
            });


            subFlow(new ReceiveFinalityFlow(counterpartySession, signedTransaction.getId()));
            return null;
        }
    }
}


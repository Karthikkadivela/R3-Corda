package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.template.contracts.MirrorContract;
import com.template.states.MirrorState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.util.Arrays;

public class MirrorFlow {
    @InitiatingFlow
    @StartableByRPC
    public static class MirrorFlowInitiator extends FlowLogic<SignedTransaction> {

        private String investor_name;
        private String symbol;
        private String no_of_shares;
        private Party holder;
        private Party observer;

        public MirrorFlowInitiator(String investor_name, String symbol, String no_of_shares, Party holder, Party observer) {
            this.investor_name = investor_name;
            this.symbol = symbol;
            this.no_of_shares = no_of_shares;
            this.holder = holder;
            this.observer = observer;
        }

        @Suspendable
        @Override
        public SignedTransaction call() throws FlowException {

            /* Obtain a reference to a notary we wish to use.
            /** Explicit selection of notary by CordaX500Name - argument can by coded in flows or parsed from config (Preferred)*/
            final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB"));

            //Building the output AppleStamp state
            UniqueIdentifier uniqueID = new UniqueIdentifier();
            MirrorState newStamp = new MirrorState(this.investor_name, this.no_of_shares, this.symbol, this.getOurIdentity(), this.holder, uniqueID);

            //Compositing the transaction
            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(newStamp)
                    .addCommand(new MirrorContract.Commands.Issue(),
                            Arrays.asList(getOurIdentity().getOwningKey(), holder.getOwningKey()));

            // Verify that the transaction is valid.
            txBuilder.verify(getServiceHub());

            // Sign the transaction.
            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            // Send the state to the counterparty, and receive it back with their signature.
            FlowSession otherPartySession = initiateFlow(holder);
            final SignedTransaction fullySignedTx = subFlow(
                    new CollectSignaturesFlow(partSignedTx, Arrays.asList(otherPartySession)));

            // Notarise and record the transaction in both parties' vaults.
            return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession)));
        }
    }

    @InitiatedBy(MirrorFlowInitiator.class)
    public static class MirrorFlowResponder extends FlowLogic<Void> {

        //private variable
        private FlowSession counterpartySession;

        public MirrorFlowResponder(FlowSession counterpartySession) {
            this.counterpartySession = counterpartySession;
        }

        @Override
        @Suspendable
        public Void call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterpartySession) {
                @Override
                @Suspendable
                protected void checkTransaction(SignedTransaction stx) throws FlowException {
                    /*
                     * SignTransactionFlow will automatically verify the transaction and its signatures before signing it.
                     * However, just because a transaction is contractually valid doesn’t mean we necessarily want to sign.
                     * What if we don’t want to deal with the counterparty in question, or the value is too high,
                     * or we’re not happy with the transaction’s structure? checkTransaction
                     * allows us to define these additional checks. If any of these conditions are not met,
                     * we will not sign the transaction - even if the transaction and its signatures are contractually valid.
                     * ----------
                     * For this hello-world cordapp, we will not implement any additional checks.
                     * */
                }
            });

            //Stored the transaction into data base.
            subFlow(new ReceiveFinalityFlow(counterpartySession, signedTransaction.getId()));
            return null;
        }
    }
}

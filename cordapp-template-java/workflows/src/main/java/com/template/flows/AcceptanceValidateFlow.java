package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.template.contracts.AcceptanceContract;
import com.template.states.AcceptanceState;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.node.services.Vault;
import net.corda.core.node.services.vault.QueryCriteria;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class AcceptanceValidateFlow {
    @InitiatingFlow
    @StartableByRPC
    public static class AcceptanceValidateFlowInitiator extends FlowLogic<SignedTransaction> {

        private UniqueIdentifier linearId;


        public AcceptanceValidateFlowInitiator(UniqueIdentifier linearId) {
            this.linearId = linearId;
        }

        @Suspendable
        @Override
        public SignedTransaction call() throws FlowException {

            //Query the input
            QueryCriteria.LinearStateQueryCriteria inputCriteria = new QueryCriteria.LinearStateQueryCriteria()
                    .withUuid(Arrays.asList(UUID.fromString(linearId.toString())))
                    .withStatus(Vault.StateStatus.UNCONSUMED)
                    .withRelevancyStatus(Vault.RelevancyStatus.RELEVANT);
            StateAndRef inputStateAndRef = getServiceHub().getVaultService().queryBy(AcceptanceState.class, inputCriteria).getStates().get(0);
            AcceptanceState input = (AcceptanceState) inputStateAndRef.getState().getData();

            //extract the notary
            Party notary = inputStateAndRef.getState().getNotary();

            //Creating the output
            AcceptanceState output = new AcceptanceState(input.getSymbol(),input.getName(),input.getNo_of_shares(),input.getTotal_price(),getOurIdentity(),input.getInvestor(),false,input.getLinearId(),input.getObserver());

            //set validation status to true
            output.validatedAndApproved();

            //Build transaction
            final TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addInputState(inputStateAndRef)
                    .addOutputState(output)
                    .addCommand(new AcceptanceContract.Commands.Validate(),
                            Arrays.asList(getOurIdentity().getOwningKey(),input.getInvestor().getOwningKey(),input.getObserver().getOwningKey()));

            // Verify that the transaction is valid.
            txBuilder.verify(getServiceHub());

            // Sign the transaction.
            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            // Send the state to the counterparty, and receive it back with their signature.
//            FlowSession otherPartySession = initiateFlow(input.getInvestor());
            List<FlowSession> otherSession = new ArrayList<>();
            otherSession.add(initiateFlow(input.getInvestor()));
            otherSession.add(initiateFlow(input.getObserver()));
            final SignedTransaction fullySignedTx = subFlow(
                    new CollectSignaturesFlow(partSignedTx, otherSession, CollectSignaturesFlow.Companion.tracker()));

            // Notarise and record the transaction in both parties' vaults.
            return subFlow(new FinalityFlow(fullySignedTx, otherSession));
        }
    }

    @InitiatedBy(AcceptanceValidateFlowInitiator.class)
    public static class AcceptanceValidateFlowResponder extends FlowLogic<Void> {
        //private variable
        private FlowSession counterpartySession;

        //Constructor
        public AcceptanceValidateFlowResponder(FlowSession counterpartySession) {
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

package com.tutorial.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.tutorial.contracts.BasketOfApplesContract;
import com.tutorial.states.BasketOfApples;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.util.Collections;

public class PackageApples {

    @InitiatingFlow
    @StartableByRPC
    public static class PackApplesInitiator extends FlowLogic<SignedTransaction> {

        private String appleDescription;
        private int weight;

        public PackApplesInitiator(String appleDescription, int weight) {
            this.appleDescription = appleDescription;
            this.weight = weight;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {


            final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB"));


            BasketOfApples basket = new BasketOfApples(this.appleDescription, this.getOurIdentity(), this.weight);


            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(basket)
                    .addCommand(new BasketOfApplesContract.Commands.packBasket(), this.getOurIdentity().getOwningKey());


            txBuilder.verify(getServiceHub());


            SignedTransaction signedTransaction = getServiceHub().signInitialTransaction(txBuilder);


            return subFlow(new FinalityFlow(signedTransaction, Collections.emptyList()));
        }
    }
}


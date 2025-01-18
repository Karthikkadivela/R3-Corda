package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.r3.corda.lib.tokens.contracts.types.TokenPointer;
import com.r3.corda.lib.tokens.contracts.types.TokenType;
import com.r3.corda.lib.tokens.money.FiatCurrency;
import com.r3.corda.lib.tokens.workflows.utilities.QueryUtilities;
import com.template.flows.utilities.CustomQuery;
import com.template.states.EKIState;
import net.corda.core.contracts.TransactionState;

import net.corda.core.contracts.Amount;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.FlowException;
import net.corda.core.flows.FlowLogic;
import net.corda.core.flows.InitiatingFlow;
import net.corda.core.flows.StartableByRPC;
import net.corda.core.utilities.ProgressTracker;
import java.util.Set;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class QueryBalanceFlow {

    @InitiatingFlow
    @StartableByRPC
    public static class GetStockBalance extends FlowLogic<String> {
        private final ProgressTracker progressTracker = new ProgressTracker();
        private final String symbol;

        public GetStockBalance(String symbol) {
            this.symbol = symbol;
        }

        @Override
        public ProgressTracker getProgressTracker() {
            return progressTracker;
        }

        @Override
        @Suspendable
        public String call() throws FlowException {
            List<TokenPointer<EKIState>> stockPointer = CustomQuery.queryStockPointer(symbol, getServiceHub());
            Long stockQty = new Long(0);

            for(int i=0;i<stockPointer.size();i++){
                Amount<TokenType> amount = QueryUtilities.tokenBalance(getServiceHub().getVaultService(), stockPointer.get(i));
                stockQty += amount.getQuantity();
            }

            return "\nYou currently have "+ stockQty + " " +this.symbol + " stocks\n";
        }
    }


    @InitiatingFlow
    @StartableByRPC
    public static class GetFiatBalance extends FlowLogic<String> {
        private final ProgressTracker progressTracker = new ProgressTracker();
        private final String currencyCode;

        public GetFiatBalance(String currencyCode) {
            this.currencyCode = currencyCode;
        }

        @Override
        public ProgressTracker getProgressTracker() {
            return progressTracker;
        }

        @Override
        @Suspendable
        public String call() throws FlowException {
            TokenType fiatTokenType = FiatCurrency.Companion.getInstance(currencyCode);
            Amount<TokenType> amount = QueryUtilities.tokenBalance(getServiceHub().getVaultService(), fiatTokenType);
            return "\nYou currently have "+ amount.getQuantity()/100+ " "  + amount.getToken().getTokenIdentifier();
        }
    }

}

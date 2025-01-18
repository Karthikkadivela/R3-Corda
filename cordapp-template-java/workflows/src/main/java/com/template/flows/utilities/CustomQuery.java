package com.template.flows.utilities;

import com.r3.corda.lib.tokens.contracts.types.TokenPointer;
import com.template.states.EKIState;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.node.ServiceHub;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class CustomQuery {
    /**
     * Retrieve any unconsumed StockState and filter by the given symbol
     */
    public static Stream<StateAndRef<EKIState>> queryStock(String symbol, ServiceHub serviceHub){
        List<StateAndRef<EKIState>> stateAndRefs = serviceHub.getVaultService().queryBy(EKIState.class).getStates();

        // Match the query result with the symbol. If no results match, throw exception
//        StateAndRef<EKIState> stockStateAndRef = stateAndRefs.stream()
//                .filter(sf->sf.getState().getData().getSymbol().equals(symbol)).findAny()
//                .orElseThrow(()-> new IllegalArgumentException("StockState symbol=\""+symbol+"\" not found from vault"));

        Stream<StateAndRef<EKIState>> stockStateAndRef = stateAndRefs.stream()
                .filter(sf->sf.getState().getData().getSymbol().equals(symbol));


        return stockStateAndRef;
    }

    /**
     * Retrieve any unconsumed StockState and filter by the given symbol
     * Then return the pointer to this StockState
     */
    public static List<TokenPointer<EKIState>> queryStockPointer(String symbol, ServiceHub serviceHub){
        Stream<StateAndRef<EKIState>> stockStateStateAndRef = queryStock(symbol, serviceHub);
        List<TokenPointer<EKIState>> stocks = new ArrayList<>();
//        return stockStateStateAndRef.getState().getData().toPointer(EKIState.class);
        stockStateStateAndRef.forEach(x -> stocks.add(x.getState().getData().toPointer(EKIState.class)));
        return stocks;
    }
}

package com.template.contracts;

import com.r3.corda.lib.tokens.contracts.EvolvableTokenContract;
import com.r3.corda.lib.tokens.contracts.commands.EvolvableTokenTypeCommand;
import com.template.states.EKIState;
import net.corda.core.contracts.CommandWithParties;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

import static net.corda.core.contracts.ContractsDSL.requireSingleCommand;
import static net.corda.core.contracts.ContractsDSL.requireThat;

public class EKIContract extends EvolvableTokenContract implements Contract {

    public static final String CONTRACT_ID = "com.template.contracts.EKIContract";

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {
        EKIState outputState = (EKIState) tx.getOutput(0);
        if(!(tx.getCommand(0).getSigners().contains(outputState.getIssuer().getOwningKey())))
            throw new IllegalArgumentException("Company Signature Required");
        CommandWithParties<EvolvableTokenTypeCommand> command = requireSingleCommand(tx.getCommands(), EvolvableTokenTypeCommand.class);
        if (command.getValue() instanceof com.r3.corda.lib.tokens.contracts.commands.Create) {
            additionalCreateChecks(tx);
            return;
        } else if (command.getValue() instanceof com.r3.corda.lib.tokens.contracts.commands.Update) {
            additionalUpdateChecks(tx);
            return;
        } else {
            throw new IllegalArgumentException("Unrecognized command");
        }
    }

    @Override
    public void additionalCreateChecks(@NotNull LedgerTransaction tx) {
        // Number of outputs is guaranteed as 1
        EKIState createdStockState = tx.outputsOfType(EKIState.class).get(0);

        requireThat(req -> {
            //Validations when creating a new stock
            req.using("Stock symbol must not be empty", (!createdStockState.getSymbol().isEmpty()));
            req.using("Stock name must not be empty", (!createdStockState.getName().isEmpty()));
            return null;
        });
    }

    @Override
    public void additionalUpdateChecks(@NotNull LedgerTransaction tx) {
        // Number of inputs and outputs are guaranteed as 1
//        EKIState input = tx.inputsOfType(EKIState.class).get(0);
//        EKIState output = tx.outputsOfType(EKIState.class).get(0);
//
//        requireThat(req-> {
//            //Validations when a stock is updated, ie. AnnounceDividend (UpdateEvolvableToken)
//            req.using("Stock Symbol must not be changed.", input.getSymbol().equals(output.getSymbol()));
//            req.using("Stock Currency must not be changed.", input.getCurrency().equals(output.getCurrency()));
//            req.using("Stock Name must not be changed.", input.getName().equals(output.getName()));
//            req.using("Stock Company must not be changed.", input.getIssuer().equals(output.getIssuer()));
//
//            req.using("Stock FractionDigits must not be changed.", input.getFractionDigits() == output.getFractionDigits());
//            return null;
//        });
    }
}

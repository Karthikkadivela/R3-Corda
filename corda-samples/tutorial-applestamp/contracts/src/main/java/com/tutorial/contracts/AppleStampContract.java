package com.tutorial.contracts;

import com.tutorial.states.AppleStamp;
import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

import static net.corda.core.contracts.ContractsDSL.requireThat;

public class AppleStampContract implements Contract {


    public static final String ID = "com.tutorial.contracts.AppleStampContract";

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {


        final CommandData commandData = tx.getCommands().get(0).getValue();


        if (commandData instanceof AppleStampContract.Commands.Issue) {
            AppleStamp output = tx.outputsOfType(AppleStamp.class).get(0);
            requireThat(require -> {
                require.using("This transaction should only have one AppleStamp state as output", tx.getOutputs().size() == 1);
                require.using("The output AppleStamp state should have clear description of the type of redeemable goods", !output.getStampDesc().equals(""));
                return null;
            });
        } else if (commandData instanceof BasketOfApplesContract.Commands.Redeem) {

        } else {

            throw new IllegalArgumentException("Incorrect type of AppleStamp Commands");
        }
    }


    public interface Commands extends CommandData {

        class Issue implements AppleStampContract.Commands {
        }
    }
}

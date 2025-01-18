package com.template.contracts;

import com.sun.istack.NotNull;
import com.template.states.MirrorState;
import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;

import static net.corda.core.contracts.ContractsDSL.requireThat;

public class MirrorContract implements Contract {
    public static final String ID = "com.tutorial.contracts.AppleStampContract";

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {

        //Extract the command from the transaction.
        final CommandData commandData = tx.getCommands().get(0).getValue();

        //Verify the transaction according to the intention of the transaction
        if (commandData instanceof MirrorContract.Commands.Issue) {
            MirrorState output = tx.outputsOfType(MirrorState.class).get(0);
            requireThat(require -> {
                require.using("This transaction should only have one AppleStamp state as output", tx.getOutputs().size() == 1);
                require.using("The output AppleStamp state should have clear description of the type of redeemable goods", !output.getSymbol().equals(""));
                return null;
            });
        } else {
            //Unrecognized Command type
            throw new IllegalArgumentException("Incorrect type of AppleStamp Commands");
        }
    }

    // Used to indicate the transaction's intent.
    public interface Commands extends CommandData {
        //In our hello-world app, We will have two commands.
        class Issue implements MirrorContract.Commands {
        }
    }
}

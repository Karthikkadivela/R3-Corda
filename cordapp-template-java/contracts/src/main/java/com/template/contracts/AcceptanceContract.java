package com.template.contracts;

import com.template.states.AcceptanceState;
import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.CommandWithParties;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;

import static net.corda.core.contracts.ContractsDSL.requireThat;

public class AcceptanceContract implements Contract {

    public static final String ID = "com.template.contracts.AcceptanceContract";


    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {

        final CommandWithParties command = tx.getCommands().get(0);

        if (command.getValue() instanceof Commands.Propose) {
            requireThat(require -> {
                require.using("There are no inputs", tx.getInputs().isEmpty());
                require.using("Only one output state should be created.", tx.getOutputs().size() == 1);
                require.using("The single output is of type Acceptance State", tx.outputsOfType(AcceptanceState.class).size() == 1);
                return null;
            });
        }else if (command.getValue() instanceof Commands.Validate) { //Validate Rules
            requireThat(require -> {
                require.using("Only one output state should be created.", tx.getOutputs().size() == 1);
                require.using("The single output is of type Acceptance State", tx.outputsOfType(AcceptanceState.class).size() == 1);
                return null;
            });
        }else if (command.getValue() instanceof Commands.Reject) { //Rejection Rules
            requireThat(require -> {
                require.using("Only one output state should be created.", tx.getOutputs().size() == 1);
                require.using("The single output is of type Acceptance State", tx.outputsOfType(AcceptanceState.class).size() == 1);
                return null;
            });
        }

    }

    public interface Commands extends CommandData {
        class Propose implements Commands { }
        class Validate implements Commands { }
        class Reject implements Commands { }
    }

}

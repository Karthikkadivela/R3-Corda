package com.template.contracts;

import com.template.states.NotificationState;
import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;

import static net.corda.core.contracts.ContractsDSL.requireThat;

public class NotificationContract implements Contract {

    public static final String ID = "com.template.contracts.NotificationContract";


    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {

        final CommandData commandData = tx.getCommands().get(0).getValue();

        if(commandData instanceof NotificationContract.Commands.Issue){
            NotificationState output = tx.outputsOfType(NotificationState.class).get(0);

            requireThat(require -> {
                require.using("The output AppleStamp state should have clear description of shares symbol, name, currency and price", !output.getSymbol().equals("") && !output.getName().equals("") && !output.getCurrency().equals("") && !(output.getPrice().equals(new BigDecimal("0.00"))));
                return null;
            });
        }else{
            //Unrecognized Command type
            throw new IllegalArgumentException("Incorrect type of NotificationState Commands");
        }

    }

    public interface Commands extends CommandData {

        class Issue implements NotificationContract.Commands {
        }
    }

}

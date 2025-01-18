package com.template.states;

import com.r3.corda.lib.tokens.contracts.states.EvolvableTokenType;
import com.r3.corda.lib.tokens.contracts.types.TokenPointer;
import com.template.contracts.EKIContract;
import net.corda.core.contracts.Amount;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.LinearPointer;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.Party;
import net.corda.core.schemas.StatePersistable;
import net.corda.core.serialization.CordaSerializable;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Currency;
import java.util.List;
import java.util.Objects;

@CordaSerializable
@BelongsToContract(EKIContract.class)
public class EKIState extends EvolvableTokenType{
    private final UniqueIdentifier linearId;
    private final Party issuer;
    private final int fractionDigits = 0;

    private final String symbol;
    private final String name;
    private final String currency;
    private final Amount<Currency> price;

    public EKIState(UniqueIdentifier linearId, Party issuer, String symbol, String name, String currency, Amount<Currency> price) {
        this.linearId = linearId;
        this.issuer = issuer;
        this.symbol = symbol;
        this.name = name;
        this.currency = currency;
        this.price = price;
    }

    @NotNull
    @Override
    public UniqueIdentifier getLinearId() {
        return linearId;
    }

    public Party getIssuer() {
        return issuer;
    }

    @Override
    public int getFractionDigits() {
        return fractionDigits;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getName() {
        return name;
    }

    public String getCurrency() {
        return currency;
    }

    public Amount<Currency> getPrice() {
        return price;
    }

    @NotNull
    @Override
    public List<Party> getMaintainers() {
        return Arrays.asList(issuer);
    }

    public TokenPointer<EKIState> toPointer(){
        LinearPointer<EKIState> linearPointer = new LinearPointer<>(linearId, EKIState.class);
        return new TokenPointer<>(linearPointer, fractionDigits);
    }
}

package com.template.states;

import com.template.contracts.NotificationContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.LinearState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;
import java.util.*;

@BelongsToContract(NotificationContract.class)
public class NotificationState implements LinearState {

    private final String symbol;
    private final String name;
    private final String currency;
    private final BigDecimal price;

    private Party observer;
    private Party investor;

    private UniqueIdentifier linearID;

    //Parameter required by all Corda states to indicate storing parties
    private List<AbstractParty> participants;

    @ConstructorForDeserialization
    public NotificationState(String symbol, String name, String currency, BigDecimal price, Party observer, Party investor, UniqueIdentifier linearID) {
        this.symbol = symbol;
        this.name = name;
        this.currency = currency;
        this.price = price;
        this.observer = observer;
        this.investor = investor;
        this.linearID = linearID;
        this.participants = new ArrayList<AbstractParty>();
        this.participants.add(observer);
        this.participants.add(investor);
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

    public BigDecimal getPrice() {
        return price;
    }

    public Party getObserver() {
        return observer;
    }

    public Party getInvestor() {
        return investor;
    }

    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        return participants;
    }

    @NotNull
    @Override
    public UniqueIdentifier getLinearId() {
        return linearID;
    }
}

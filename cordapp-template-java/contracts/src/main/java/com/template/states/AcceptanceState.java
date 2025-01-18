package com.template.states;

import com.template.contracts.AcceptanceContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.LinearState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;
import java.util.*;

@BelongsToContract(AcceptanceContract.class)
public class AcceptanceState implements LinearState {

    private final String name;
    private final String symbol;
    private Boolean qualification = false;
    private final BigDecimal total_price;
    private final String no_of_shares;
    private Party investor;
    private Party company;

    private Party observer;

    private UniqueIdentifier linearID;

    //Parameter required by all Corda states to indicate storing parties
    private List<AbstractParty> participants;

    @ConstructorForDeserialization
    public AcceptanceState(String symbol, String name, String no_of_shares,BigDecimal total_price, Party company, Party investor, Boolean qualification, UniqueIdentifier linearID, Party observer) {
        this.symbol = symbol;
        this.name = name;
        this.no_of_shares = no_of_shares;
        this.total_price = total_price;
        this.company = company;
        this.investor = investor;
        this.observer = observer;
        this.linearID = linearID;
        this.qualification = qualification;
        this.participants = new ArrayList<AbstractParty>();
        this.participants.add(investor);
        this.participants.add(company);
        this.participants.add(observer);
    }

    public String getNo_of_shares() {
        return no_of_shares;
    }

    public String getName() {
        return name;
    }

    public String getSymbol() {
        return symbol;
    }

    public Boolean getQualification() {
        return qualification;
    }

    public BigDecimal getTotal_price() {
        return total_price;
    }

    public Party getInvestor() {
        return investor;
    }

    public Party getCompany() {
        return company;
    }

    public Party getObserver() { return observer;}

    public void validatedAndApproved (){
        this.qualification = true;
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

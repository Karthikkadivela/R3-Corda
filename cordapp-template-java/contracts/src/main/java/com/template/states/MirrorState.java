package com.template.states;

import com.template.contracts.MirrorContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.LinearState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

@BelongsToContract(MirrorContract.class)
public class MirrorState implements LinearState {
    private String investor_name;//For example: "One stamp can exchange for a basket of HoneyCrispy Apple"
    private String no_of_shares;

    private String symbol;
    private Party issuer; //The person who issued the stamp
    private Party holder; //The person who currently owns the stamp

    //LinearState required variable.
    private UniqueIdentifier linearID;

    //ALL Corda State required parameter to indicate storing parties
    private List<AbstractParty> participants;

    @ConstructorForDeserialization
    public MirrorState(String investor_name, String no_of_shares, String symbol, Party issuer, Party holder, UniqueIdentifier linearID) {
        this.investor_name = investor_name;
        this.no_of_shares = no_of_shares;
        this.symbol = symbol;
        this.issuer = issuer;
        this.holder = holder;
        this.linearID = linearID;
        this.participants = new ArrayList<AbstractParty>();
        this.participants.add(issuer);
        this.participants.add(holder);
    }

    public String getInvestor_name() {
        return investor_name;
    }

    public String getNo_of_shares() {
        return no_of_shares;
    }

    public String getSymbol() {
        return symbol;
    }

    public Party getIssuer() {
        return issuer;
    }

    public Party getHolder() {
        return holder;
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

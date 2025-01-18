package com.tutorial.states;

import com.tutorial.contracts.AppleStampContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.LinearState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

@BelongsToContract(AppleStampContract.class)
public class AppleStamp implements LinearState {

    //Private Variables
    private String stampDesc;
    private Party issuer;
    private Party holder;


    private UniqueIdentifier linearID;


    private List<AbstractParty> participants;


    @ConstructorForDeserialization
    public AppleStamp(String stampDesc, Party issuer, Party holder, UniqueIdentifier linearID) {
        this.stampDesc = stampDesc;
        this.issuer = issuer;
        this.holder = holder;
        this.linearID = linearID;
        this.participants = new ArrayList<AbstractParty>();
        this.participants.add(issuer);
        this.participants.add(holder);
    }

    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        return this.participants;
    }

    @NotNull
    @Override
    public UniqueIdentifier getLinearId() {
        return this.linearID;
    }

    //Getters
    public String getStampDesc() {
        return stampDesc;
    }

    public Party getIssuer() {
        return issuer;
    }

    public Party getHolder() {
        return holder;
    }

}



package com.template.webserver;

import net.corda.core.contracts.Amount;

import java.util.Currency;

public class SampleModel {
    private int issueVal;

    private String txnId;

    public SampleModel() {
    }

    private String symbol;
    private String name;
    private String currency;
    private long price;

    public SampleModel(int issueVal, String txnId, String symbol, String name, String currency, long price) {
        this.issueVal = issueVal;
        this.txnId = txnId;
        this.symbol = symbol;
        this.name = name;
        this.currency = currency;
        this.price = price;
    }

    public int getIssueVal() {
        return issueVal;
    }

    public void setIssueVal(int issueVal) {
        this.issueVal = issueVal;
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }
}

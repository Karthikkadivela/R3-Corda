package com.template.webserver.model;

public class MirrorTableModel {
    private String investor_name;
    private String symbol;
    private String no_of_shares;

    public MirrorTableModel() {
    }

    public MirrorTableModel(String investor_name, String symbol, String no_of_shares) {
        this.investor_name = investor_name;
        this.symbol = symbol;
        this.no_of_shares = no_of_shares;
    }

    public String getInvestor_name() {
        return investor_name;
    }

    public void setInvestor_name(String investor_name) {
        this.investor_name = investor_name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getNo_of_shares() {
        return no_of_shares;
    }

    public void setNo_of_shares(String no_of_shares) {
        this.no_of_shares = no_of_shares;
    }
}

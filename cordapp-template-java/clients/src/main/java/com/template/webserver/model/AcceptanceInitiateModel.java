package com.template.webserver.model;

import java.math.BigDecimal;

public class AcceptanceInitiateModel {
    private String company_name;
    private String symbol;
    private BigDecimal total_price;
    private String no_of_shares;

    public AcceptanceInitiateModel() {
    }

    public AcceptanceInitiateModel(String company_name, String symbol, BigDecimal total_price, String no_of_shares) {
        this.company_name = company_name;
        this.symbol = symbol;
        this.total_price = total_price;
        this.no_of_shares = no_of_shares;
    }

    public String getCompany_name() {
        return company_name;
    }

    public void setCompany_name(String company_name) {
        this.company_name = company_name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public BigDecimal getTotal_price() {
        return total_price;
    }

    public void setTotal_price(BigDecimal total_price) {
        this.total_price = total_price;
    }

    public String getNo_of_shares() {
        return no_of_shares;
    }

    public void setNo_of_shares(String no_of_shares) {
        this.no_of_shares = no_of_shares;
    }
}

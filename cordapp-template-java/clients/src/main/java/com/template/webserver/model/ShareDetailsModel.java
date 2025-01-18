package com.template.webserver.model;

import java.math.BigDecimal;

public class ShareDetailsModel {
    private String symbol;
    private String name;
    private String currency;
    private BigDecimal price;

    public ShareDetailsModel() {
    }

    public ShareDetailsModel(String symbol, String name, String currency, BigDecimal price) {
        this.symbol = symbol;
        this.name = name;
        this.currency = currency;
        this.price = price;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}

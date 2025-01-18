package com.template.webserver.model;

import java.util.Currency;

public class SwapModel {
    private String symbol;
    private Long quantity;
    private Long total_price;

    public SwapModel() {
    }

    public SwapModel(String symbol, Long quantity, Long total_price) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.total_price = total_price;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public Long getTotal_price() {
        return total_price;
    }

    public void setTotal_price(Long total_price) {
        this.total_price = total_price;
    }
}

package com.template.webserver.model;

public class issueUSDModel {

    private Long qty;
    private String currency;

    public issueUSDModel() {
    }

    public issueUSDModel(Long qty, String currency) {
        this.qty = qty;
        this.currency = currency;
    }

    public Long getQty() {
        return qty;
    }

    public void setQty(Long qty) {
        this.qty = qty;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}

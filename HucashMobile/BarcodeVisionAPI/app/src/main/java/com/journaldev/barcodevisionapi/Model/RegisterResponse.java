package com.journaldev.barcodevisionapi.Model;

import com.google.gson.annotations.SerializedName;

public class RegisterResponse {

    @SerializedName("msg")
    private String message ;

    public RegisterResponse(String message){
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

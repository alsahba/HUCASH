package com.journaldev.barcodevisionapi.RetrofitService;


import com.journaldev.barcodevisionapi.Model.RegisterResponse;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;


public interface ApiService {
    @GET("paymentWithQR")
    Call<RegisterResponse> register(@QueryMap HashMap<String, String> map);

}
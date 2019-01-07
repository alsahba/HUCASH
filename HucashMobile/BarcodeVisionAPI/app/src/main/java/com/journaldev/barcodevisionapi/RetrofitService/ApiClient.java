package com.journaldev.barcodevisionapi.RetrofitService;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;


public class ApiClient {

    public static final String BASE_URL = "http://46.101.212.47:8000/";
    private static Retrofit retrofit = null;
    private static ApiService service = null;


    private static Retrofit getClient() {
        OkHttpClient okHttpClient = new OkHttpClient().newBuilder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .build();

        if (retrofit==null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(okHttpClient)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

    public static synchronized ApiService getService(){
        if(service == null){
            service = getClient().create(ApiService.class);
        }
        return service;
    }
}

package com.journaldev.barcodevisionapi.Activities;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.journaldev.barcodevisionapi.Model.RegisterResponse;
import com.journaldev.barcodevisionapi.R;
import com.journaldev.barcodevisionapi.RetrofitService.ApiClient;

import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    Button btnScanBarcode;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initViews();
    }

    private void initViews() {
        btnScanBarcode = findViewById(R.id.btnScanBarcode);
        btnScanBarcode.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {

        switch (v.getId()) {
            case R.id.btnScanBarcode:
                startActivity(new Intent(MainActivity.this, ScannedBarcodeActivity.class));
                break;
        }
    }
}

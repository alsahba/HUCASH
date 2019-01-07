package com.journaldev.barcodevisionapi.Activities;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import com.journaldev.barcodevisionapi.Model.RegisterResponse;
import com.journaldev.barcodevisionapi.R;
import com.journaldev.barcodevisionapi.RetrofitService.ApiClient;
import java.util.HashMap;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmailActivity extends AppCompatActivity implements View.OnClickListener {


    TextView txtRecipient;
    TextView txtAmount;
    TextView txtReceiver;
    Button btnConfirmPayment;
    String receiver, sender, amount;
    private ProgressDialog progressDialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_email);
        initViews();
    }

    private void initViews() {

        txtRecipient = findViewById(R.id.txtRecipient);
        txtAmount = findViewById(R.id.txtAmount);
        txtReceiver = findViewById(R.id.txtReceiver);
        btnConfirmPayment = findViewById(R.id.btnConfirmPayment2);
        String paymentQrString = getIntent().getStringExtra("paymentDetails");
        String[] splittedPaymetQrString = paymentQrString.split("-");

        if (getIntent().getStringExtra("paymentDetails") != null) {
            sender = splittedPaymetQrString[0];
            amount = splittedPaymetQrString[1];
            receiver = splittedPaymetQrString[2];
            txtRecipient.setText("Recipient : " + sender);
            txtAmount.setText("Amount : " + amount);
            txtReceiver.setText("Receiver : " + receiver);
        }

        btnConfirmPayment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            /*Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType("text/plain");
            intent.putExtra(Intent.EXTRA_EMAIL, new String[]{txtRecipient.getText().toString()});
            intent.putExtra(Intent.EXTRA_SUBJECT, inSubject.getText().toString().trim());
            intent.putExtra(Intent.EXTRA_TEXT, inBody.getText().toString().trim());
            startActivity(Intent.createChooser(intent, "Send Email"));*/
            progressDialog = new ProgressDialog(EmailActivity.this);
            progressDialog.setMessage("Please wait while payment is taken...");
            progressDialog.setCancelable(false);
            progressDialog.show();
            register();

            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {

            case R.id.btnScanBarcode:
                startActivity(new Intent(EmailActivity.this, ScannedBarcodeActivity.class));
                break;
        }

    }

    public void register(){
        HashMap<String, String> map = new HashMap<>();
        map.put("senderId", sender);
        map.put("receiverId", receiver);
        map.put("amount", amount);
        Call<RegisterResponse> call = ApiClient.getService().register(map);
        call.enqueue(new Callback<RegisterResponse>() {
            @Override
            public void onResponse(Call<RegisterResponse>call, Response<RegisterResponse> response) {
                RegisterResponse registerResponse = response.body();
                String message = registerResponse.getMessage();
                Log.d("Ret Register", "Service message is: " + message);
                progressDialog.dismiss();
                showResDialog(message, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        startActivity(new Intent(EmailActivity.this, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
                    }
                });
            }

            @Override
            public void onFailure(Call<RegisterResponse>call, Throwable t) {
                Log.e("Ret Register", t.toString());
                progressDialog.dismiss();
                showResDialog("An error occurred, please try again later.", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        startActivity(new Intent(EmailActivity.this, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
                    }
                });
            }
        });
    }

    private void showResDialog(String msg, DialogInterface.OnClickListener clickListener){
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage(msg)
                .setCancelable(false)
                .setPositiveButton("OKAY", clickListener);
        AlertDialog alert = builder.create();
        alert.show();
    }

}

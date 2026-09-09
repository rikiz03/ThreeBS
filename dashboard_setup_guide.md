# Payment Dashboard Setup Guide (Global USD)

Follow these steps to ensure your payment gateways are correctly configured to receive USD payments and support Apple/Google Pay globally.

## 1. Paystack Configuration
To receive USD payments globally via Paystack:

1.  **USD Bank Account**:
    *   Log in to your **Paystack Dashboard**.
    *   Go to **Settings** > **Payout Accounts**.
    *   Add a **USD Bank Account** (e.g., from Raenest, Geegpay, or a local USD account).
    *   *Note: Paystack only supports USD payouts for merchants in certain regions (Nigeria, Ghana, etc.). If your region isn't supported for USD payouts, they will settle in your local currency at their exchange rate.*

2.  **Enable Apple Pay**:
    *   Go to **Settings** > **Apple Pay**.
    *   Click **Add Domain** and enter `threebrothersstores.com`.
    *   Download the verification file if prompted and place it in your project's `.well-known` folder (I have already configured your `vercel.json` for this).
    *   Register the domain.

3.  **Enable Google Pay**:
    *   Paystack enables Google Pay automatically for modern integrations. Ensure your "Payment Channels" include **Card** and **Apple Pay/Google Pay**.

---

## 2. Flutterwave Configuration
To receive USD payments and enable fallbacks:

1.  **Enable USD Currency**:
    *   Log in to your **Flutterwave Dashboard**.
    *   Go to **Settings** > **Business Profile**.
    *   Ensure **USD** is enabled in your "Settlement Currencies".

2.  **Payment Methods**:
    *   Go to **Settings** > **Account Settings**.
    *   Enable **Apple Pay** and **Google Pay** in the payment methods list.
    *   Verify your domain for Apple Pay in the **Apple Pay** tab within Settings.

3.  **API Keys**:
    *   Ensure your `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` in Vercel/Environment variables is the **Live Public Key**.

---

## 3. Payoneer Configuration
To ensure Payoneer accepts USD:

1.  **Checkout Settings**:
    *   Log in to **Payoneer**.
    *   Go to **Checkout** > **Settings**.
    *   Ensure your store is configured to accept **USD**.
    *   Verify that your API credentials (Store ID, API Username, API Password) are correctly set in your environment variables.

---

## Summary of Fallback Logic
*   **Primary**: Paystack (Standard Secure Pay). This is shown first to all users.
*   **Secondary**: Flutterwave (Alternative Secure Pay). This is shown if Paystack is closed or if the user chooses it manually.
*   **Global**: Both are now available to all customers worldwide, charging specifically in **USD**.

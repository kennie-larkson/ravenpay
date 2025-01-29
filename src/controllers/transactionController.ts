import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import db from "../database";

type IConfigGenerateAccount = {
  first_name: string;
  last_name: string;
  phone: string;
  amount: number;
  email: string;
};

type IConfigTransferFunds = {
  bank: string;
  bank_code: string;
  account_number: string;
  amount: number;
  account_name: string;
  narration: string;
};

export const generateAccount = async (req: Request, res: Response) => {
  const { first_name, last_name, phone, amount, email } = req.body;
  if (!first_name || !last_name || !phone || !amount || !email) {
    console.error("Error generating account:");
    return res.status(500).json({ message: "Incomplete Data" });
  }
  const config: IConfigGenerateAccount = {
    first_name,
    last_name,
    phone,
    amount,
    email,
  };
  try {
    // Call the Raven Bank API to generate an account
    const response = await axios.post(
      "https://integrations.getravenbank.com/v1/pwbt/generate_account",
      config,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ATLAS_KEY}`,
        },
      }
    );

    // Prepare the payload to send to the webhook
    const webhookPayload = response.data;
    const webhook_url = process.env.WEBHOOK_URL as string;

    // Generate a signature for the payload using the webhook secret key
    const WEBHOOK_SECRET =
      process.env.WEBHOOK_SECRET || "your_generated_secret_key";
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    const signature = hmac.update(JSON.stringify(webhookPayload)).digest("hex");

    // Send the response to the webhook URL
    await axios.post(webhook_url, webhookPayload, {
      headers: {
        "Content-Type": "application/json",
        "x-signature": signature, // Include the signature in the headers
      },
    });

    // Handle the response from the API
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error generating account:", error);
    return res.status(500).json({ message: "Error generating account" });
  }

  // Fetch transaction history from the database
  // Respond with the transaction history
};

export const sendMoney = async (req: Request, res: Response) => {
  const { bank, bank_code, account_number, amount, account_name, narration } =
    req.body;
  if (
    !bank ||
    !bank_code ||
    !account_number ||
    !amount ||
    !account_name ||
    !narration
  ) {
    console.error("Error making transfer");
    return res.status(500).json({ message: "Incomplete Data" });
  }

  const config: IConfigTransferFunds = {
    bank,
    bank_code,
    amount,
    account_name,
    account_number,
    narration,
  };

  try {
    const response = await axios.post(
      "https://integrations.getravenbank.com/v1/transfers/create",
      config,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ATLAS_KEY}`,
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error making transfer:", error);
    return res.status(500).json({ message: "Error making transfer" });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://integrations.getravenbank.com/v1/accounts/transactions",

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ATLAS_KEY}`,
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error getting history:", error);
    return res.status(500).json({ message: "Error getting history" });
  }
};

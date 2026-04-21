#!/usr/bin/env npx tsx
/**
 * Stripe Agentic Commerce Suite — Product Catalog Upload
 *
 * Run once to register SendFast plans with Stripe ACS so AI agents
 * (ChatGPT, etc.) can discover and purchase them.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/upload-acp-catalog.ts
 *
 * Requires:
 *   - STRIPE_SECRET_KEY
 *   - STRIPE_STARTER_PRICE_ID
 *   - STRIPE_PRO_PRICE_ID
 *   - NEXT_PUBLIC_APP_URL (optional, defaults to https://sendfast.app)
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID;
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sendfast.app";
const STRIPE_API_VERSION = "2025-09-30.clover";

if (!STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is required");
  process.exit(1);
}
if (!STRIPE_STARTER_PRICE_ID || !STRIPE_PRO_PRICE_ID) {
  console.error("❌ STRIPE_STARTER_PRICE_ID and STRIPE_PRO_PRICE_ID are required");
  process.exit(1);
}

// Product catalog CSV in Stripe's format for ACS
const csv = `id,title,description,category,stripe_product_tax_code,price,currency,stripe_price_id,billing_interval,product_url,image_url,features
sendfast-starter,SendFast Starter,"25 GB per transfer, 30-day expiry, 100 transfers/month. Password protection, email delivery, download tracking.",software_as_a_service,txcd_10103001,9.00,usd,${STRIPE_STARTER_PRICE_ID},month,${APP_URL}/pricing,,"25 GB per transfer | 30-day link expiry | 100 transfers/month | Password protection | Email delivery | Download tracking | AES-256-GCM encryption"
sendfast-pro,SendFast Pro,"100 GB per transfer, 90-day expiry, 500 transfers/month. REST API, custom branding, and all Starter features.",software_as_a_service,txcd_10103001,19.00,usd,${STRIPE_PRO_PRICE_ID},month,${APP_URL}/pricing,,"100 GB per transfer | 90-day link expiry | 500 transfers/month | REST API access | Custom branding | Password protection | AES-256-GCM encryption"
`;

const csvPath = path.join(process.cwd(), "scripts", "acp-catalog.csv");
fs.writeFileSync(csvPath, csv);
console.log(`✅ Catalog CSV written to ${csvPath}`);
console.log("\n📤 Uploading to Stripe Files API...");

async function stripeRequest(
  method: string,
  endpoint: string,
  body?: string,
  contentType = "application/x-www-form-urlencoded",
  baseUrl = "https://api.stripe.com"
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, baseUrl);
    const auth = Buffer.from(`${STRIPE_SECRET_KEY}:`).toString("base64");

    const options: https.RequestOptions = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        Authorization: `Basic ${auth}`,
        "Stripe-Version": STRIPE_API_VERSION,
        ...(body ? { "Content-Type": contentType, "Content-Length": Buffer.byteLength(body) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function uploadFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const csvContent = fs.readFileSync(csvPath);
    const boundary = "----SendFastACPBoundary";
    const auth = Buffer.from(`${STRIPE_SECRET_KEY}:`).toString("base64");

    const body = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="purpose"\r\n\r\ndata_management_manual_upload\r\n` +
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="acp-catalog.csv"\r\nContent-Type: text/csv\r\n\r\n`
      ),
      csvContent,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const options: https.RequestOptions = {
      method: "POST",
      hostname: "files.stripe.com",
      path: "/v1/files",
      headers: {
        Authorization: `Basic ${auth}`,
        "Stripe-Version": STRIPE_API_VERSION,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const result = JSON.parse(data) as { id?: string; error?: { message: string } };
        if (result.id) {
          resolve(result.id);
        } else {
          reject(new Error(result.error?.message || JSON.stringify(result)));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  try {
    // Step 1: Upload CSV
    const fileId = await uploadFile();
    console.log(`✅ File uploaded: ${fileId}`);

    // Step 2: Create ImportSet
    console.log("\n📦 Creating ImportSet...");
    const importSet = await stripeRequest(
      "POST",
      "/v1/data_management/import_sets",
      `file=${fileId}&standard_data_format=product_catalog_feed`
    ) as { id?: string; status?: string; error?: { message: string } };

    if (!importSet.id) {
      throw new Error(importSet.error?.message || JSON.stringify(importSet));
    }

    console.log(`✅ ImportSet created: ${importSet.id}`);
    console.log(`   Status: ${importSet.status}`);

    // Step 3: Poll until done
    console.log("\n⏳ Waiting for import to complete...");
    let status = importSet.status;
    let attempts = 0;

    while (status === "pending" && attempts < 20) {
      await new Promise((r) => setTimeout(r, 2000));
      const updated = await stripeRequest(
        "GET",
        `/v1/data_management/import_sets/${importSet.id}`
      ) as { status?: string; result?: { rows_processed?: number; successes?: { row_count: number }; errors?: { row_count: number } } };
      status = updated.status || "pending";
      attempts++;

      if (status !== "pending") {
        const result = updated.result;
        console.log(`✅ Import ${status}`);
        if (result) {
          console.log(`   Rows processed: ${result.rows_processed}`);
          console.log(`   Successes: ${result.successes?.row_count}`);
          if (result.errors?.row_count) {
            console.log(`   ⚠️  Errors: ${result.errors.row_count} rows`);
          }
        }
      }
    }

    if (status === "pending") {
      console.log("⚠️  Import still pending after polling. Check your Stripe dashboard.");
    }

    console.log("\n🎉 Done! Next steps:");
    console.log("   1. Go to your Stripe Dashboard → Agentic Commerce settings");
    console.log("   2. Verify the products appear correctly");
    console.log("   3. Apply at https://chatgpt.com/merchants to list on ChatGPT");
    console.log(`   4. Add these policy URLs to your Stripe ACS settings:`);
    console.log(`      Terms:   ${APP_URL}/terms`);
    console.log(`      Privacy: ${APP_URL}/privacy`);
    console.log(`      Refund:  ${APP_URL}/refund`);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();

"use server";

import { unifiController } from "@/lib/unifi";

export async function createUnifiVoucher() {
  const newVoucher = await unifiController.createToken(
    60, // Expire time in minutes
    `Token ID: 123456`
  );

  console.log(newVoucher);
  const voucherCode = await unifiController.getVoucherCode(newVoucher);

  if (!voucherCode) {
    console.error("Failed to get voucher code");
    return;
  }
  console.log("After createToken", voucherCode);
  return voucherCode;
}

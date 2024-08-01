"use server";

import { unifiController } from "@/lib/unifi";

export async function createUnifiVoucher(email: string, period: number) {
  const newVoucher = await unifiController.createToken(
    period, // Expire time in minutes
    `Token ID: ${email}`
  );

  const voucherCode = await unifiController.getVoucherCode();

  if (!voucherCode) {
    console.error("Failed to get voucher code");
    return;
  }
  return voucherCode;
}

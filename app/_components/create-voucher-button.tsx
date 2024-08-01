"use client";
import { createUnifiVoucher } from "@/actions/create-token";
import { Button } from "@/components/ui/button";
import React from "react";
import { Loader } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const CreateVoucherButton = () => {
  const [voucherCode, setVoucherCode] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const createVoucher = async () => {
    setIsLoading(true);
    const voucher: any = await createUnifiVoucher();
    const voucherCode = voucher?.code;
    console.log("Voucher:", voucher);

    setVoucherCode(voucherCode);
    setIsLoading(false);
  };

  return (
    <div className=" flex flex-col p-5 space-y-10">
      {isLoading ? (
        <Button disabled asChild>
          <div className="flex gap-2">
            <Loader size={20} className="animate-spin" /> Generating voucher...
          </div>
        </Button>
      ) : (
        <Button onClick={createVoucher}>Generate your voucher</Button>
      )}
      {voucherCode && (
        <div className="flex flex-col space-y-5">
          <h2 className="text-lg font-bold">Voucher code:</h2>

          <div className="flex space-x-2">
            {voucherCode.split("").map((char, index) => (
              <React.Fragment key={index}>
                <div className="rounded-md bg-gray-100 p-2 text-center w-8 border shadow-md">
                  {char}
                </div>
                {(index + 1) % 5 === 0 && index !== voucherCode.length - 1 && (
                  <div className="flex items-center justify-center w-4">-</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVoucherButton;

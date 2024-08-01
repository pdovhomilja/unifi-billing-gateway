import { Button } from "@/components/ui/button";
import Image from "next/image";
import CreateVoucherButton from "./_components/create-voucher-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        UniFi Voucher Generator
      </h1>
      <CreateVoucherButton />
    </main>
  );
}

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8">
         <Image 
            src="/logo-bmkg.png" 
            alt="Logo BMKG" 
            width={80} 
            height={80} 
            priority
            className="mx-auto"
         />
      </div>

      <Suspense fallback={<div className="text-gray-500 animate-pulse">Memuat form login...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
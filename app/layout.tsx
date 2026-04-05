import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { RoleProvider } from "@/context/RoleContext";
import { TransactionProvider } from "@/context/TransactionContext";
import AppLayout from "@/components/layout/ApplAyout";
import { Toaster } from "sonner";
import { BudgetProvider } from "@/context/BudgetContext";


export const metadata: Metadata = {
  title: "Finio",
  description: "Personal Finance Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <RoleProvider>
            <TransactionProvider>
              <BudgetProvider>
              <AppLayout>
                {children}
              </AppLayout>
               <Toaster position="bottom-right" richColors />
               </BudgetProvider>
            </TransactionProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
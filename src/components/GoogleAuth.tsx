"use client";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: string; size: string }
          ) => void;
        };
      };
    };
  }
}

export default function GoogleAuth() {
  const { login } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (response: { credential: string }) => {
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          console.log("Google OAuth Payload:", payload);
          login({
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            sub: payload.sub
          });
        }
      });

      const buttonDiv = document.getElementById("google-signin-button");
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: "outline",
          size: "large"
        });
      }
    }
  }, [login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Pickaso</h1>
      <div id="google-signin-button"></div>
    </div>
  );
}

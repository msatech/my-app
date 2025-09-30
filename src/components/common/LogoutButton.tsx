"use client";

import { useOktaAuth } from "@okta/okta-react";

export default function LogoutButton() {
  const { oktaAuth } = useOktaAuth();

  return (
    <button
      onClick={() => oktaAuth.signOut()}
      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
    >
      Logout
    </button>
  );
}

declare global {
  interface Window {
    fwcrm?: {
      identify: (identifier: string, contactData: Record<string, unknown>) => void;
    };
  }
}

export interface FreshworksContactInput {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  companyWebsite?: string;
  [key: string]: unknown;
}

export const identifyFreshworksContact = (data: FreshworksContactInput) => {
  if (typeof window === "undefined") return;

  const nameParts = data.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const new_contact: Record<string, unknown> = {
    "First name": firstName,
    "Last name": lastName,
    "Email": data.email.trim(),
  };

  if (data.phone) {
    new_contact["Alternate contact number"] = data.phone.trim();
  }

  if (data.companyName || data.companyWebsite) {
    new_contact["company"] = {
      "Name": data.companyName || "",
      "Website": data.companyWebsite || "",
    };
  }

  const identifier = data.email.trim();

  if (window.fwcrm && typeof window.fwcrm.identify === "function") {
    window.fwcrm.identify(identifier, new_contact);
  } else {
    // Retry periodically in case the script is still loading asynchronously
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.fwcrm && typeof window.fwcrm.identify === "function") {
        window.fwcrm.identify(identifier, new_contact);
        clearInterval(checkInterval);
      } else if (attempts >= 20) {
        clearInterval(checkInterval);
      }
    }, 500);
  }
};

export interface VerificationRequest {
  id: string;
  profile: {
    full_name: string;
    company_name: string;
    phone: string;
    business_address: string;
  };
  document_url: string;
  status: string;
  uploaded_at: string;
}
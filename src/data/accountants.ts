export interface License {
  type: 'Licensed Auditor' | 'Licensed Accountant' | 'Licensed Tax Agent' | 'Licensed Company Secretary';
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
}

export interface Accountant {
  id: string;
  name: string;
  company: string;
  services: string[];
  location: string;
  coordinates: [string, string];
  phone: string;
  email: string;
  availability: string;
  isVerified?: boolean;
  licenses: License[];
}

export const accountants: Accountant[] = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    name: "Shukri Yusof",
    company: "Shukri Yusof & Co. (SYNC)",
    services: ["Tax Planning", "Audit Services", "Financial Advisory"],
    location: "138A, Jalan Tasek Timur, Pusat Perdagangan Tasek Indra, 31400 Ipoh, Perak",
    coordinates: ["4.6014", "101.0901"],
    phone: "05-545 1122",
    email: "shukri.yusof@synco.my",
    availability: "Mon-Fri",
    isVerified: true,
    licenses: [
      { type: "Licensed Accountant", status: "verified", verifiedAt: "2023-01-15" }
    ]
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0852",
    name: "Abu Musa",
    company: "BIZCOMM+ BY AMM&CO",
    services: ["Business Consulting", "Tax Planning", "Audit Services"],
    location: "AM 7/AM Pusat Perniagaan, 13-A, Jalan Keluli, Persiaran Bukit Raja, Seksyen 7, 40000 Shah Alam, Selangor",
    coordinates: ["3.0833", "101.5333"],
    phone: "017-789 1287",
    email: "abu.musa@bizcomm.my",
    availability: "Mon-Fri",
    isVerified: true,
    licenses: [
      { type: "Licensed Accountant", status: "verified", verifiedAt: "2023-03-10" },
      { type: "Licensed Company Secretary", status: "verified", verifiedAt: "2023-04-15" }
    ]
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0853",
    name: "Faiz Izzudin",
    company: "Faiz Izzudin & Co. (PACCT)",
    services: ["Financial Advisory", "Tax Planning", "Corporate Secretarial"],
    location: "D-07-09, Capital 4, Oasis Square, 2, Jalan PJU 1A/7, Ara Damansara, 47301 Petaling Jaya, Selangor",
    coordinates: ["3.1136", "101.5778"],
    phone: "03-7491 7954",
    email: "faiz@fico.my",
    availability: "Mon-Fri",
    isVerified: true,
    licenses: [
      { type: "Licensed Accountant", status: "verified", verifiedAt: "2023-01-20" },
      { type: "Licensed Company Secretary", status: "verified", verifiedAt: "2023-02-25" }
    ]
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0854",
    name: "Hazli Johar",
    company: "Hazli Johar & Co",
    services: ["Audit Services", "Tax Planning", "Business Consulting"],
    location: "No G-6-1A, Jalan Prima Saujana 2/D, Taman Prima Saujana 43000 Kajang, Selangor Darul Ehsan",
    coordinates: ["2.9927", "101.7909"],
    phone: "+60163889123",
    email: "hazli@hazlijohar.my",
    availability: "Mon-Fri",
    isVerified: true,
    licenses: [
      { type: "Licensed Accountant", status: "verified", verifiedAt: "2023-04-05" },
      { type: "Licensed Company Secretary", status: "verified", verifiedAt: "2023-05-20" }
    ]
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0855",
    name: "Shahrizal Shazuan",
    company: "Shahrizal Shazuan Saufi & Co",
    services: ["Tax Planning", "Audit Services", "Financial Advisory"],
    location: "Jalan 8/23e, Taman Danau Kota, 53300 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    coordinates: ["3.2074", "101.7244"],
    phone: "03-6738 6738",
    email: "hello@sssnco.com.my",
    availability: "Mon-Fri",
    isVerified: true,
    licenses: [
      { type: "Licensed Accountant", status: "verified", verifiedAt: "2023-02-15" }
    ]
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0856",
    name: "Annuar Fakri",
    company: "Annuar Fakri & Co",
    services: ["Audit Services", "Tax Planning", "Business Consulting"],
    location: "17b, Jalan Tengku Ampuan Zabedah F 9/F, Seksyen 9, 40100 Shah Alam, Selangor",
    coordinates: ["3.0731", "101.5185"],
    phone: "03-5524 7770",
    email: "annuar.fakri@afco.com.my",
    availability: "Mon-Fri",
    isVerified: true,
    licenses: [
      { type: "Licensed Accountant", status: "verified", verifiedAt: "2023-05-10" }
    ]
  }
];
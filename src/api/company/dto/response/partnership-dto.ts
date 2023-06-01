export class PartnershipDTO {
  partnershipId: string;
  partnershipIdCompany: string;
  partnershipName: string;
  partnershipImageUrl: string;
  partnershipDescription: string;
  partnershipContact: string;
  partnershipEmail: string | null;
  partnershipInstagram: string | null;
  partnershipWebsite: string | null;
  partnershipAddress: string;
  partnershipCategoryName: string;

  constructor(data: any) {
    this.partnershipId = data.partnershipId;
    this.partnershipIdCompany = data.partnershipIdCompany;
    this.partnershipName = data.partnershipName;
    this.partnershipImageUrl = data.partnershipImageUrl;
    this.partnershipDescription = data.partnershipDescription;
    this.partnershipContact = data.partnershipContact;
    this.partnershipEmail = data.partnershipEmail;
    this.partnershipInstagram = data.partnershipInstagram;
    this.partnershipWebsite = data.partnershipWebsite;
    this.partnershipAddress = data.partnershipAddress;
    this.partnershipCategoryName = data.partnershipCategoryName;
  }
}

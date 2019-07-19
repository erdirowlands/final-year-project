export class InstitutionApprovalRequest {
    constructor(
        public institutionName: string,
        public adminName: string, // Serves as the admin making the request.
      ) {}
    }

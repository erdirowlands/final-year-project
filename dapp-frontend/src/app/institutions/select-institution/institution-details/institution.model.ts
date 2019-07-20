export class Institution {
    constructor(
        public ethereumAddress: string,
        public institutionName: string,
        public admins: string[], // Serves as the admin making the request.
      ) {}
    }
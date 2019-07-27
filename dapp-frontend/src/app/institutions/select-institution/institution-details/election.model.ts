export class Election {
    constructor(
        public ethereumAddress: string,
        public description: string,
        public startTime: string, // Serves as the admin making the request.
        public endTime: string, // Serves as the admin making the request.
      ) {}
    }
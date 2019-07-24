// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  
  production: false,
  ethereum: {
    // Kovan
     provider: 'https://kovan.infura.io/v3/f2c4ebd8ed604600a20a3236bffb51df',
     devProvider: 'HTTP://192.168.1.71:7545',
     universityVotingContractAddress: '0xA3E91107d20cf2A7Bc93FA21cC312377511383ac'
   //  Ganache
   // provider: 'HTTP://192.168.1.71:7545',
  //  universityVotingContractAddress: '0xc9AEa578c6ec721AE0957dFa4f50C28556BeA929'

  },

  institutionObservableRefresh: {
    testTimeout: 5000,
    kovanTimeout: 10000000
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

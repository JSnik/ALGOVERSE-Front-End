// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //baseUrl: 'https://algoverse-api.azurewebsites.net',
  baseUrl: 'http://localhost:5000/',

  ALGOD_TESTNET_URL:"https://testnet-algorand.api.purestake.io/ps2",
  ALGOD_TESTNET_TOKEN:"Z4lUOOfIOm8thZUeUK9n349ImUCpiCC190RtGnm6",
  ALGOD_TESTNET_INDEXER_ADDRESS:"https://testnet-algorand.api.purestake.io/idx2",

  ALGOD_LOCAL_TESTNET_URL:"http://localhost:4001",
  ALGOD_LOCAL_TESTNET_TOKEN:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  ALGOD_LOCAL_TESTNET_INDEXER_ADDRESS:"http://localhost",

  ALGOD_URL:"http://localhost:4001",
  ALGOD_TOKEN:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  ALGOD_INDEXER_ADDRESS:"http://localhost",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

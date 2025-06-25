/**
 * The code below demonstrates how you can use MSAL as a custom authentication provider for the Microsoft Graph JavaScript SDK.
 * You do NOT need to implement a custom provider. Microsoft Graph JavaScript SDK v3.0 (preview) offers AuthCodeMSALBrowserAuthenticationProvider
 * which handles token acquisition and renewal for you automatically. For more information on how to use it, visit:
 * https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/AuthCodeMSALBrowserAuthenticationProvider.md
 */

import { graphConfig } from "./authConfig.js";
import { msalConfig } from "./authConfig.js";

/**
 * Returns a graph client object with the provided token acquisition options
 * @param {Object} accessToken: object containing user account, required scopes and interaction type
 */
export const getGraphClient = (accessToken) => {
  /**
   * Pass the instance as authProvider in ClientOptions to instantiate the Client which will create and set the default middleware chain.
   * For more information, visit: https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CreatingClientInstance.md
   */
  // let clientOptions = {
  //   authProvider: new MsalAuthenticationProvider(providerOptions),
  // };

  // const graphClient = MicrosoftGraph.Client.initWithMiddleware(clientOptions);

  // return graphClient;
   return MicrosoftGraph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
};

/**
 * This class implements the IAuthenticationProvider interface, which allows a custom authentication provider to be
 * used with the Graph client. See: https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/src/IAuthenticationProvider.ts
 */
class MsalAuthenticationProvider {
  account; // user account object to be used when attempting silent token acquisition
  scopes; // array of scopes required for this resource endpoint
  interactionType; // type of interaction to fallback to when silent token acquisition fails
  claims;

  constructor(providerOptions) {
    this.account = providerOptions.account;
    this.scopes = providerOptions.scopes;
    this.interactionType = providerOptions.interactionType;
    const resource = new URL(graphConfig.graphMeEndpoint.uri).hostname;
    this.claims =
      this.account &&
      getClaimsFromStorage(
        `cc.${msalConfig.auth.clientId}.${this.account.idTokenClaims.oid}.${resource}`
      )
        ? window.atob(
            getClaimsFromStorage(
              `cc.${msalConfig.auth.clientId}.${this.account.idTokenClaims.oid}.${resource}`
            )
          )
        : undefined; // e.g {"access_token":{"xms_cc":{"values":["cp1"]}}}
  }

  /**
   * This method will get called before every request to the ms graph server
   * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
   * Basically this method will contain the implementation for getting and refreshing accessTokens
   */
  getAccessToken() {
    return new Promise(async (resolve, reject) => {
      let response;

      try {
        response = await myMSALObj.acquireTokenSilent({
          account: this.account,
          scopes: this.scopes,
          claims: this.claims,
        });

        if (response.accessToken) {
          resolve(response.accessToken);
          resolve(
            "eyJ0eXAiOiJKV1QiLCJub25jZSI6IlVRVUlqRGZqZnB1MTZGWU1LQVI1dTY5WDdYN0hxZjlZbnJCc1hpYlVmN1kiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kNDNkN2I4Ny0zNjdhLTRlMmMtOWU0MC05ZGVkNmE0MmJmODMvIiwiaWF0IjoxNzUwNzMzMjE1LCJuYmYiOjE3NTA3MzMyMTUsImV4cCI6MTc1MDgxOTkxNiwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsicDEiXSwiYWlvIjoiQVdRQW0vOFpBQUFBczlSajU5b2EvL2s4ZjEyNXJBaWtIWmU2dm1zVmhnL0ZrbVpoNU5Uc2dmNzhiTW9ud0Y2cDY5bis1QVhDSHNZQmZwRk85VnlWbFJqdUdHemxYdUZEYXE1bC9mK1BwbW9nbFY3ckg0ZnQ5a2RycHJXbzl6U1NpbFZ4V21EZUxSWWMiLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6Ik5ndXllbiBBbmgiLCJnaXZlbl9uYW1lIjoiVHVhbiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjIxOS4xMDIuMTUxLjE4MSIsIm5hbWUiOiJOZ3V5ZW4gQW5oIFR1YW4iLCJvaWQiOiIwYmZiNjdlYy03NmNmLTQ0MWEtOGRmNS0yOTA5MzcxY2UxMTQiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDQ1NzE3QzlFMSIsInJoIjoiMS5BU29BaDNzOTFIbzJMRTZlUUozdGFrS19nd01BQUFBQUFBQUF3QUFBQUFBQUFBQXBBYllxQUEuIiwic2NwIjoiTWFpbC5SZWFkQmFzaWMgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIE1haWwuUmVhZCIsInNpZCI6IjAwNWYzZWU5LWQ0MDctZmMxMy0wYzVmLTdkZTlmM2I5Y2FmZSIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IkN0T2Z1eFNHV0RINjFUMGJLSHdHSDAtMG5GN3VfYmxzQ0k4VWVQU09vc1kiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiJkNDNkN2I4Ny0zNjdhLTRlMmMtOWU0MC05ZGVkNmE0MmJmODMiLCJ1bmlxdWVfbmFtZSI6InR1YW5uYThAcmlra2Vpc29mdC5jb20iLCJ1cG4iOiJ0dWFubmE4QHJpa2tlaXNvZnQuY29tIiwidXRpIjoiY3gxcF8yU2xMa0NUbGMyRmpsNFRBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2Z0ZCI6ImZpV3JjRFdrdXY0cExQUDNiMGlvQlRNZnlTaG4zU291cnVuS3Jfd205NGdCYTI5eVpXRmpaVzUwY21Gc0xXUnpiWE0iLCJ4bXNfaWRyZWwiOiIxMCAxIiwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoiR2pIZVlMMEVMZFB4SHVFU0djaWtuMDNRUWdrYjVwekRLejlXcFYyUFp0RSJ9LCJ4bXNfdGNkdCI6MTUyODg3OTYzM30.ClYlAHG00TDdxvX2cgK5U2wX4qUB5W0muDlKleKrQ6iiitfk89L-qb8RgMy8hMTpn3y-mMa4mgi9Up_UrE7w1-Vd0dOIVeLDdsMv4LrxRpMnZpXpQeRyHgCFIUrcfXsXuTDbfOnArHjtBfNroX14YGnXPxNvDt8LUDRFkn4BaTad7Di8UsXw8gZLJEjUr1wBfsK_r_jTV2rWb-xEqMg7QjCu58EntBlUPxH5j1qyafUVS1RjP1RFq2R8N11pHf4Ie9BuFPvten-wBBYCOCqw_4kSJrwNqkhu0FztXWj166MXMM6uox71XdlydSGaw1DpNjJK1B7GP9l00iOEl7N4Yw");
        } else {
          reject(Error("Failed to acquire an access token"));
        }
      } catch (error) {
        // in case if silent token acquisition fails, fallback to an interactive method
        if (error instanceof msal.InteractionRequiredAuthError) {
          switch (this.interactionType) {
            case msal.InteractionType.Popup:
              response = await myMSALObj.acquireTokenPopup({
                scopes: this.scopes,
                claims: this.claims,
                redirectUri: "/redirect",
              });

              if (response.accessToken) {
                resolve(response.accessToken);
              } else {
                reject(Error("Failed to acquire an access token"));
              }
              break;

            case msal.InteractionType.Redirect:
              /**
               * This will cause the app to leave the current page and redirect to the consent screen.
               * Once consent is provided, the app will return back to the current page and then the
               * silent token acquisition will succeed.
               */
              myMSALObj.acquireTokenRedirect({
                scopes: this.scopes,
                claims: this.claims,
              });
              break;

            default:
              break;
          }
        }
      }
    });
  }
}

function getClaimsFromStorage(key) {
    return window.localStorage.getItem(key);
}

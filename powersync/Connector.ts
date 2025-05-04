import { AbstractPowerSyncDatabase, PowerSyncBackendConnector, UpdateType } from "@powersync/react-native";

export class Connector implements PowerSyncBackendConnector {
  /**
  * Implement fetchCredentials to obtain a JWT from your authentication service.
  * See https://docs.powersync.com/installation/authentication-setup
  * If you're using Supabase or Firebase, you can re-use the JWT from those clients, see:
  * https://docs.powersync.com/installation/authentication-setup/supabase-auth
  * https://docs.powersync.com/installation/authentication-setup/firebase-auth
  */
  async fetchCredentials() {
    return {
      // The PowerSync instance URL or self-hosted endpoint
      endpoint: 'https://67f6c16f984c6f4cb07959ca.powersync.journeyapps.com',
      /**
      * To get started quickly, use a development token, see:
      * Authentication Setup https://docs.powersync.com/installation/authentication-setup/development-tokens) to get up and running quickly
      */
      token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InBvd2Vyc3luYy1kZXYtMzIyM2Q0ZTMifQ.eyJzdWIiOiIxNDgiLCJpYXQiOjE3NDYzMDQ3MTYsImlzcyI6Imh0dHBzOi8vcG93ZXJzeW5jLWFwaS5qb3VybmV5YXBwcy5jb20iLCJhdWQiOiJodHRwczovLzY3ZjZjMTZmOTg0YzZmNGNiMDc5NTljYS5wb3dlcnN5bmMuam91cm5leWFwcHMuY29tIiwiZXhwIjoxNzQ2MzQ3OTE2fQ.YIakKk2Vw52jPQ6gVQMa_btuswqXoXRvXX3Y6HF73BcIvStTmNHlaIT8sM3hXf-_pyh1Eh3AkmYOzdXsf13zdC6zJBvO-JCSpIY3E2UmL1SFNJAGE2VXXjFiUQsdoAoTOZij8hkfJDvJC6xGqd2aHuXcK2kzKnbjxdpipc6Q-XpeJwie4sYKiHyx92rHkvYoREhnJleSrxoKNV6899uU9KJXBCvVAP3DeV3U30pJg1H9OCNs6kHYV-cZhyAr1Bk1wyoXTpOCR2O7AUwGi1lRWzZS3dOFsixmzYBS_X9wpAn-1ZqyVq0epH6SloEoBeOriNsr4huxcFaDPp7N5p4fSQ'
    };
  }

  /**
  * Implement uploadData to send local changes to your backend service.
  * You can omit this method if you only want to sync data from the database to the client
  * See example implementation here:https://docs.powersync.com/client-sdk-references/react-native-and-expo#3-integrate-with-your-backend
  */
  async uploadData(database: AbstractPowerSyncDatabase) {

    /**
    * For batched crud transactions, use data.getCrudBatch(n);
    * https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/SqliteBucketStorage#getcrudbatch
    */
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    for (const op of transaction.crud) {
      // The data that needs to be changed in the remote db
      const record = { ...op.opData, id: op.id };
      switch (op.op) {
        case UpdateType.PUT:
          // TODO: Instruct your backend API to CREATE a record
          break;
        case UpdateType.PATCH:
          // TODO: Instruct your backend API to PATCH a record
          break;
        case UpdateType.DELETE:
          //TODO: Instruct your backend API to DELETE a record
          break;
      }
    }

    // Completes the transaction and moves onto the next one
    await transaction.complete();
  }
}
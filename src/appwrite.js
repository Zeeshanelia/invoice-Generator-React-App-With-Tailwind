import { Client, Account, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') //  Appwrite endpoint
  .setProject('688b565c000806cdad29'); //  project ID from Appwrite console

export const account = new Account(client);
export const storage = new Storage(client);


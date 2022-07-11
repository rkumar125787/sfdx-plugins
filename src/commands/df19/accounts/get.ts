/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { Account } from '../../shared/typeDefs';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);
// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('df19', 'org');

export default class AccountGet extends SfdxCommand {
  public static description = 'get account by description';
  public static examples = ['sfdx df19:account:get --name "Not a RealPlace"'];

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: 'the name of account to find',
      required: false,
    }),
    force: flags.boolean({
      char: 'f',
      description: messages.getMessage('forceFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const conn = this.org.getConnection();
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const query = `Select Id,Name from Account where name = '${this.flags.name}'`;
    const result = await conn.query<Account>(query);
    if (!result.records || result.records.length <= 0) {
      throw new Error('no account found with this name');
    }
    const accounts: Account[] = result.records;
    accounts.forEach((account: Account) => {
      this.ux.log(`Id : ${account.Id} | name : ${account.Name}`);
    });
    return '';
  }
}

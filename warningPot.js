/**
 * A singleton module for logging and displaying notes and warnings across all running modules.
 * This module stores messages and allows you to display them at the requested point.
 *
 * @class Warning
 * @throws {Error} If an instance of 'Warning' already exists.
 */

let instance;
class Warning {
  constructor() {
    if (instance) throw new Error(`'Warning' instance already exists.`);
    this.messageAry = [];
  }

  /**
   * Adds a new warning message to the log.
   *
   * @param {string} newWarning - The warning message to be added.
   */
  add = newWarning => this.messageAry.push(newWarning);

  /**
   * Resets the log by removing all stored messages.
   */
  reset = () => (this.messageAry = []);

  /**
   * Prints all stored messages to the console.
   */
  print = () => this.messageAry.forEach(msg => console.log(`⚡ ${msg}`));
}

const warningPot = Object.freeze(new Warning());

module.exports = warningPot;

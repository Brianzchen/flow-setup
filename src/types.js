// @flow
export type FlowSetupConfigsT = {
  /**
   * The config the current config extends from
   */
  extends?: 'string',
  /**
   * A key value pair of config type and their respective rules
   */
  [key: string]: Array<string>,
};

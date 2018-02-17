// @flow

export type TriggerObject = {
  id: number,
  scheduleId: number,
  isTriggered: boolean,
  note: string,
  duration: string,
  velocity: number
};

export type DispatchObject = {
  type: string,
  id?: number
};

export interface Queue {
  id: number;
  name: string;
  shortName: string;
  description: string;
  detailedDescription: string;
  gameSelectModeGroup: string;
  gameSelectCategory: string;
  gameSelectPriority: number;
  isSkillTreeQueue: boolean;
  hidePlayerPosition: boolean;
}

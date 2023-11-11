import { TdMap } from '../utils/utils';
import battleInfo from './battle.json';
import professionInfo from './profession.json';
export class Battle {
  teams: Array<Team>;
  allCharacters: Array<Character>;
  profession: { [key: string]: Profession };
  characterMap: TdMap = new TdMap();
  constructor() {
    this.teams = new Array<Team>();
    this.allCharacters = new Array<Character>();
    this.profession = {};
  }
}

export class Team {
  playerControl: boolean;
  name: string;
  characters: Array<Character>;
  constructor(name: string) {
    this.characters = new Array<Character>();
    this.name = name;
    this.playerControl = false;
  }
}

export class Alliance {
  name?: string;
}

export class Character {
  characterClass?: string;
  profession?: Profession;
  professionId?: string;
  name = '';
  x = 0;
  y = 0;
  allianace?: string;
  team?: Team;
  teamId?: number;
  hitPoint?: number;
  magicPoint?: number;
  experience?: number;
  level?: number;
  strength?: number;
  constitution?: number;
  dexterity?: number;
  intellience?: number;
  wisdom?: number;
}

export type Profession = {
  name: string;
  spriteFile: string;
  spriteIndex: Array<number>;
}

export const loadBattle = (): Battle => {

  const battle = new Battle();
  battle.teams = new Array<Team>();
  battle.profession = professionInfo;

  for (const teamInfo of battleInfo.teams) {
    battle.teams.push(new Team(teamInfo.name));
  }

  for (const characterInfo of battleInfo.characters) {
    const { x, y } = characterInfo;
    const character = new Character();
    character.name = characterInfo.name;
    character.profession = battle.profession[characterInfo.profession];
    character.professionId = characterInfo.profession;
    character.x = x;
    character.y = y;
    character.team = battle.teams[characterInfo.team];
    character.teamId = characterInfo.team;
    character.team.characters.push(character);
    battle.allCharacters.push(character);
    battle.characterMap.set(x, y, character);
  }

  return battle;
}
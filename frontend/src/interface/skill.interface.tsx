export interface Skill {
  name: string;
  yearsOfExperience: number;
}

export interface Position {
  name: string;
  description?: string;
}


export interface Education {
  name: string;
  description?: string;
  yearsOfExperience: number;
  startDate: Date;
  endDate: Date;
}

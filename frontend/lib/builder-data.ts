export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  major: string;
  education: string;  // 大专/本科/硕士/博士
  startYear: string;
  endYear: string;
  campusExperience: string; // 在校经历
}

export interface ProjectExperience {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface Honor {
  id: string;
  name: string;
  date: string;
}

export interface ResumeData {
  avatar: string;
  name: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  email: string;
  phone: string;
  jobStatus: string;
  currentCity: string;
  targetCity: string;
  personalStrengths: string;
  skills: string[];
  educations: Education[];
  workExperience: WorkExperience[];
  projects: ProjectExperience[];
  honors: Honor[];
}

let _counter = 0;
export const uid = () => String(++_counter);

export const emptyEducation = (): Education => ({
  id: uid(), school: "", major: "", education: "", startYear: "", endYear: "", campusExperience: "",
});

export const emptyWork = (): WorkExperience => ({
  id: uid(), company: "", title: "", startDate: "", endDate: "", description: "",
});

export const emptyProject = (): ProjectExperience => ({
  id: uid(), name: "", role: "", description: "",
});

export const emptyHonor = (): Honor => ({
  id: uid(), name: "", date: "",
});

export const defaultResumeData: ResumeData = {
  avatar: "",
  name: "",
  gender: "",
  birthDate: "",
  birthPlace: "",
  email: "",
  phone: "",
  jobStatus: "",
  currentCity: "",
  targetCity: "",
  personalStrengths: "",
  skills: [],
  educations: [],
  workExperience: [],
  projects: [],
  honors: [],
};

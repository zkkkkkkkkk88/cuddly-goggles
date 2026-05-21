export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
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
  identity: string;
  gradYear: string;
  school: string;
  major: string;
  education: string;
  jobStatus: string;
  skills: string[];
  workExperience: WorkExperience[];
  projects: ProjectExperience[];
  honors: Honor[];
}

let _counter = 0;
export const uid = () => String(++_counter);

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
  identity: "",
  gradYear: "",
  school: "",
  major: "",
  education: "",
  jobStatus: "",
  skills: [],
  workExperience: [],
  projects: [],
  honors: [],
};

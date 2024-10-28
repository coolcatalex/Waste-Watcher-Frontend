import type { userStoreType_onboarding } from "./userStore";
import { persisted } from "svelte-persisted-store";


export const initialSelectedOrgStoreState:userStoreType_onboarding = {
    _id: "",
    weightedScorePercentage: 0,
    offices: 0,
    cafeterias: 0,
    schoolName: "",
    schoolAddress: "",
    schoolAdminContact: 0,
    avgStudentInClass: 0,
    classrooms: [],
}

const selectedOrgStore = persisted<userStoreType_onboarding>("selectedOrgStore",initialSelectedOrgStoreState)

export default selectedOrgStore

import { persisted } from 'svelte-persisted-store'


export type userStoreType_onboarding = {
    _id: string,
    weightedScorePercentage: number
    offices: number
    cafeterias: number
    schoolName: string,
    schoolAddress: string,
    schoolAdminContact: number,
    avgStudentInClass: number,
    classrooms: string[],
}

export type userStoreType = {
    email: {
        mail: string
        verified: boolean
    }
    _id: string
    username: string
    role: string
    awareness_score: number
    onBoardingComplete: boolean
    onBoarding: Array<Record<string,userStoreType_onboarding>>
    token?: string
}

// Define the initial state for the store
const initialState: userStoreType = {
    email: {
        mail: "",
        verified: false
    },
    _id: "",
    username: "",
    role: "",
    awareness_score : 0,
    onBoardingComplete: false,
    onBoarding: [],
    token: ""
};

// Create the userStore with persistence
const userStore = persisted("userStore", initialState);

export default userStore;

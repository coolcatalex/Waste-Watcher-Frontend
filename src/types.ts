export type ONBOARDING_DEATILS = {
    _id: string
    user: string
    schoolName: string
    schoolAddress: string
    schoolAdminContact: number
    avgStudentInClass: number
    classrooms: Array<string>
    offices: number
    cafeterias: number
    query: Array<{
      qId: string
      aId: string
      question: string
      answer: string
      score: number
      maxScore: number
      weightage: number
      _id: string
    }>
    weightedScorePercentage: number
    __v: number
  }
  

export type QUESTIONS_TYPE = {
    _id: string
    query: Array<{
        question: string
        options: Array<{
            option: string
            score: number
            _id: string
            maxScore: number
        }>
        weightage: number
        _id: string
    }>
    __v: number
}|null 

export type ENTRIES_TYPES = {
    entries:Array<{
        _id: string
        user: string
        org: string
        orgName: string
        area: string
        areaName: string
        weight: number
        unit: string
        classification: string
        wasteType: {
            paper: number,
            plastic: number,
            organic: number,
            electronic: number,
            others: number
        },
        category: string
        // awareness_score?: number
        maturity_score: number
        // awareness_session_date?: number
        timestamp: number
        waste_champion: boolean
        avgStudentInClass: number
        createdAt: number
        __v: number
    }>
    totalDocuments: number
}


export type AWARENESS_SESSION_TYPES = {
    entries:Array<{
        _id: string
        user: string
        orgId: string
        instructor: string
        area: string
        areaName: string
        awareness_min: number
        awareness_score: number
        awareness_session_date: number
    }>
    totalDocuments: number
}


export interface ENTRIES_AWARENESS {
    entries: Record<string,{
        y: number
        x: number
        waste_champion: boolean
      }[]>
    awareness: Record<string,{
        score: number
        x: number
    }[]>
}
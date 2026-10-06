import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
} from 'react';

export type JourneyType =
    | 'after-cbc'
    | 'after-kcse'
    | 'university'
    | 'graduate'
    | null;

export type PersonalityAnswer = {
    questionId: string;
    question: string;
    choices: string[];
};

type OnboardingData = {
    journey: JourneyType;

    name: string;
    age: string;
    gender: string | null;

    qualification: string | null;
    course: string;
    yearOfStudy: string | null;

    kcseGrade: string;
    math: string;
    english: string;
    science: string;

    personalityAnswers: PersonalityAnswer[];
    personalityDescription: string;
    hobbies: string;

    setJourney: (value: JourneyType) => void;

    setName: (value: string) => void;
    setAge: (value: string) => void;
    setGender: (value: string | null) => void;

    setQualification: (value: string | null) => void;
    setCourse: (value: string) => void;
    setYearOfStudy: (value: string | null) => void;

    setKcseGrade: (value: string) => void;
    setMath: (value: string) => void;
    setEnglish: (value: string) => void;
    setScience: (value: string) => void;

    setPersonalityAnswers: (
        value: PersonalityAnswer[]
    ) => void;
    setPersonalityDescription: (value: string) => void;
    setHobbies: (value: string) => void;
};

const OnboardingContext =
    createContext<OnboardingData | undefined>(undefined);

export function OnboardingProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [journey, setJourney] =
        useState<JourneyType>(null);

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] =
        useState<string | null>(null);

    const [qualification, setQualification] =
        useState<string | null>(null);

    const [course, setCourse] = useState('');

    const [yearOfStudy, setYearOfStudy] =
        useState<string | null>(null);

    const [kcseGrade, setKcseGrade] = useState('');
    const [math, setMath] = useState('');
    const [english, setEnglish] = useState('');
    const [science, setScience] = useState('');

    const [personalityAnswers, setPersonalityAnswers] =
        useState<PersonalityAnswer[]>([]);

    const [
        personalityDescription,
        setPersonalityDescription,
    ] = useState('');

    const [hobbies, setHobbies] = useState('');

    return (
        <OnboardingContext.Provider
            value={{
                journey,

                name,
                age,
                gender,

                qualification,
                course,
                yearOfStudy,

                kcseGrade,
                math,
                english,
                science,

                personalityAnswers,
                personalityDescription,
                hobbies,

                setJourney,

                setName,
                setAge,
                setGender,

                setQualification,
                setCourse,
                setYearOfStudy,

                setKcseGrade,
                setMath,
                setEnglish,
                setScience,

                setPersonalityAnswers,
                setPersonalityDescription,
                setHobbies,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);

    if (!context) {
        throw new Error(
            'useOnboarding must be used inside OnboardingProvider'
        );
    }

    return context;
}
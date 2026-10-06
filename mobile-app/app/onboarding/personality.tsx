import React, { useState } from 'react';
import {
    Alert,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';

type PersonalityAnswer = {
    questionId: string;
    question: string;
    choices: string[];
};

const questions = [
    {
        id: 'ideal_day',
        question: 'What kind of workday sounds most like you?',
        options: [
            'Building or creating something',
            'Learning and discovering new ideas',
            'Connecting and collaborating with people',
            'Solving challenging problems',
            'Exploring new places or experiences',
        ],
    },
    {
        id: 'group_role',
        question: 'In a group project, what role do you naturally take?',
        options: [
            'The person who leads',
            'The person who organizes',
            'The person who comes up with ideas',
            'The person who researches and analyzes',
            'The person who keeps everyone connected',
        ],
    },
    {
        id: 'new_challenge',
        question: 'When you face a new challenge, what do you do first?',
        options: [
            'Break it into smaller problems',
            'Research and understand it',
            'Try something and learn as I go',
            'Ask people for different perspectives',
            'Look for a creative approach',
        ],
    },
    {
        id: 'energy',
        question: 'What kind of work gives you the most energy?',
        options: [
            'Working with people',
            'Working with technology or systems',
            'Working with ideas and information',
            'Creating or designing things',
            'Taking action and getting things done',
        ],
    },
    {
        id: 'career_priority',
        question: 'What matters most to you when choosing a career?',
        options: [
            'Freedom and flexibility',
            'Strong financial growth',
            'Making a meaningful impact',
            'Creativity and self-expression',
            'Stability and security',
            'Recognition and achievement',
        ],
    },
];

export default function PersonalityScreen() {
    const {
        setPersonalityAnswers,
        setPersonalityDescription,
        setHobbies,
    } = useOnboarding();

    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [description, setDescription] = useState('');
    const [hobbiesText, setHobbiesText] = useState('');

    const toggleOption = (
        questionId: string,
        option: string
    ) => {
        setAnswers((previous) => {
            const current = previous[questionId] || [];

            if (current.includes(option)) {
                return {
                    ...previous,
                    [questionId]: current.filter(
                        (item) => item !== option
                    ),
                };
            }

            if (current.length >= 2) {
                Alert.alert(
                    'Choose up to 2',
                    'You can select a maximum of two answers for each question.'
                );

                return previous;
            }

            return {
                ...previous,
                [questionId]: [...current, option],
            };
        });
    };

    const handleContinue = () => {
        const unanswered = questions.find(
            (question) =>
                !answers[question.id] ||
                answers[question.id].length === 0
        );

        if (unanswered) {
            Alert.alert(
                'Complete your answers',
                'Please answer every personality question before continuing.'
            );
            return;
        }

        const structuredAnswers: PersonalityAnswer[] =
            questions.map((question) => ({
                questionId: question.id,
                question: question.question,
                choices: answers[question.id] || [],
            }));

        setPersonalityAnswers(structuredAnswers);
        setPersonalityDescription(description.trim());
        setHobbies(hobbiesText.trim());

        router.push('/onboarding/profile');
    };

    return (
        <ImageBackground
            source={require('../../assets/images/backgrounds/image.jpeg')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay} />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.step}>STEP 3 OF 4</Text>

                    <Text style={styles.title}>
                        Let’s understand
                        {'\n'}
                        how you think.
                    </Text>

                    <Text style={styles.subtitle}>
                        Your personality helps us understand your
                        strengths, preferences and working style so
                        we can personalize your course and career
                        recommendations.
                    </Text>
                </View>

                {questions.map((question, index) => {
                    const selected = answers[question.id] || [];

                    return (
                        <View
                            key={question.id}
                            style={styles.questionContainer}
                        >
                            <View style={styles.questionHeader}>
                                <View style={styles.numberCircle}>
                                    <Text style={styles.number}>
                                        {index + 1}
                                    </Text>
                                </View>

                                <Text style={styles.question}>
                                    {question.question}
                                </Text>
                            </View>

                            <Text style={styles.helper}>
                                Choose up to 2
                            </Text>

                            <View style={styles.options}>
                                {question.options.map((option) => {
                                    const isSelected =
                                        selected.includes(option);

                                    return (
                                        <Pressable
                                            key={option}
                                            onPress={() =>
                                                toggleOption(
                                                    question.id,
                                                    option
                                                )
                                            }
                                            style={[
                                                styles.option,
                                                isSelected &&
                                                styles.optionSelected,
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.radio,
                                                    isSelected &&
                                                    styles.radioSelected,
                                                ]}
                                            >
                                                {isSelected && (
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={15}
                                                        color="#FFFFFF"
                                                    />
                                                )}
                                            </View>

                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    isSelected &&
                                                    styles.optionTextSelected,
                                                ]}
                                            >
                                                {option}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    );
                })}

                <View style={styles.optionalSection}>
                    <Text style={styles.sectionTitle}>
                        Tell us a little more about yourself
                    </Text>

                    <Text style={styles.optionalLabel}>
                        Describe yourself in your own words
                    </Text>

                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="For example: I enjoy figuring out how things work and helping people solve problems."
                        placeholderTextColor="#9A9A9A"
                        multiline
                        textAlignVertical="top"
                        style={styles.textArea}
                    />

                    <Text style={styles.optionalLabel}>
                        Hobbies and interests
                    </Text>

                    <TextInput
                        value={hobbiesText}
                        onChangeText={setHobbiesText}
                        placeholder="For example: football, coding, music, photography..."
                        placeholderTextColor="#9A9A9A"
                        style={styles.input}
                    />
                </View>

                <Pressable
                    onPress={handleContinue}
                    style={styles.continueButton}
                >
                    <View style={styles.continueContent}>
                        <Text style={styles.continueText}>
                            Continue
                        </Text>

                        <Ionicons
                            name="arrow-forward"
                            size={21}
                            color="#FFFFFF"
                        />
                    </View>
                </Pressable>

                <Text style={styles.footerText}>
                    Your answers help personalize your course
                    and career recommendations.
                </Text>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
    },

    content: {
        paddingHorizontal: 22,
        paddingTop: 58,
        paddingBottom: 45,
    },

    header: {
        marginBottom: 32,
    },

    step: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.4,
        color: '#008C8C',
        marginBottom: 12,
    },

    title: {
        fontSize: 30,
        lineHeight: 36,
        fontWeight: '700',
        color: '#24212F',
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 15,
        lineHeight: 23,
        color: '#686572',
    },

    questionContainer: {
        marginBottom: 30,
    },

    questionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 7,
    },

    numberCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#6C4AB6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
        marginTop: 1,
    },

    number: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    question: {
        flex: 1,
        fontSize: 17,
        lineHeight: 23,
        fontWeight: '700',
        color: '#292735',
    },

    helper: {
        fontSize: 12,
        color: '#8A8793',
        marginLeft: 41,
        marginBottom: 12,
    },

    options: {
        gap: 9,
    },

    option: {
        minHeight: 54,
        borderWidth: 1,
        borderColor: '#E1E0E5',
        borderRadius: 13,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(247, 247, 248, 0.94)',
    },

    optionSelected: {
        borderColor: '#6C4AB6',
        backgroundColor: 'rgba(240, 235, 250, 0.96)',
    },

    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#B5B2BB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: '#FFFFFF',
    },

    radioSelected: {
        backgroundColor: '#6C4AB6',
        borderColor: '#6C4AB6',
    },

    optionText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 19,
        color: '#4B4855',
    },

    optionTextSelected: {
        color: '#4A317D',
        fontWeight: '600',
    },

    optionalSection: {
        marginTop: 3,
        marginBottom: 30,
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#292735',
        marginBottom: 22,
    },

    optionalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#44414D',
        marginBottom: 8,
    },

    textArea: {
        minHeight: 110,
        borderWidth: 1,
        borderColor: '#E1E0E5',
        borderRadius: 13,
        backgroundColor: 'rgba(250, 250, 250, 0.94)',
        paddingHorizontal: 14,
        paddingTop: 13,
        paddingBottom: 13,
        fontSize: 14,
        lineHeight: 20,
        color: '#292735',
        marginBottom: 20,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#E1E0E5',
        borderRadius: 13,
        backgroundColor: 'rgba(250, 250, 250, 0.94)',
        paddingHorizontal: 14,
        fontSize: 14,
        color: '#292735',
    },

    continueButton: {
        height: 56,
        borderRadius: 14,
        backgroundColor: '#008C8C',
        alignItems: 'center',
        justifyContent: 'center',
    },

    continueContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
    },

    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#777480',
        marginTop: 13,
    },
});
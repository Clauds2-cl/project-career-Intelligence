import React from 'react';
import {
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useOnboarding, JourneyType } from '../context/OnboardingContext';

type JourneyOption = {
    id: JourneyType;
    number: string;
    title: string;
    subtitle: string;
    description: string;
};

const journeyOptions: JourneyOption[] = [
    {
        id: 'after-cbc',
        number: '01',
        title: 'After CBC',
        subtitle: 'Ready for your next step',
        description:
            'Explore your interests, strengths and possible future directions.',
    },
    {
        id: 'after-kcse',
        number: '02',
        title: 'After KCSE',
        subtitle: 'Ready to make your next step',
        description:
            'Explore suitable courses and career paths using your academic profile, interests and personality.',
    },
    {
        id: 'university',
        number: '03',
        title: 'University Student',
        subtitle: 'Already pursuing higher education',
        description:
            'Understand your strengths, build relevant skills and prepare for your career.',
    },
    {
        id: 'graduate',
        number: '04',
        title: 'Graduate',
        subtitle: 'Ready for the world of work',
        description:
            'Explore career paths, strengthen your skills and prepare for employment.',
    },
];

export default function JourneyScreen() {
    const { journey, setJourney } = useOnboarding();

    const handleContinue = () => {
        if (!journey) return;

        router.push('/onboarding/profile');
    };

    return (
        <ImageBackground
            source={require('../../assets/images/backgrounds/patterns.jpeg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.content}
                    >
                        <View style={styles.topBar}>
                            <Pressable
                                onPress={() => router.back()}
                                style={styles.backButton}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={21}
                                    color="#FFFFFF"
                                />
                            </Pressable>

                            <View style={styles.progressArea}>
                                <View style={styles.progressTrack}>
                                    <View style={styles.progressFill} />
                                </View>

                                <Text style={styles.progressText}>
                                    STEP 1 OF 5
                                </Text>
                            </View>
                        </View>

                        <View style={styles.introduction}>
                            <Text style={styles.eyebrow}>
                                YOUR JOURNEY
                            </Text>

                            <Text style={styles.title}>
                                Where are you{'\n'}right now?
                            </Text>

                            <Text style={styles.subtitle}>
                                Choose the option that best describes
                                your current stage.
                            </Text>
                        </View>

                        <View style={styles.options}>
                            {journeyOptions.map((option) => {
                                const selected = journey === option.id;

                                return (
                                    <Pressable
                                        key={option.id}
                                        onPress={() => setJourney(option.id)}
                                        style={[
                                            styles.card,
                                            selected && styles.cardSelected,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.numberBox,
                                                selected && styles.numberBoxSelected,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.number,
                                                    selected && styles.numberSelected,
                                                ]}
                                            >
                                                {option.number}
                                            </Text>
                                        </View>

                                        <View style={styles.cardContent}>
                                            <Text
                                                style={[
                                                    styles.cardTitle,
                                                    selected && styles.cardTitleSelected,
                                                ]}
                                            >
                                                {option.title}
                                            </Text>

                                            <Text style={styles.cardSubtitle}>
                                                {option.subtitle}
                                            </Text>

                                            <Text style={styles.cardDescription}>
                                                {option.description}
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.radio,
                                                selected && styles.radioSelected,
                                            ]}
                                        >
                                            {selected && (
                                                <View style={styles.radioDot} />
                                            )}
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {journey && (
                            <View style={styles.messageBox}>
                                <View style={styles.messageIcon}>
                                    <Ionicons
                                        name="sparkles-outline"
                                        size={17}
                                        color="#FFFFFF"
                                    />
                                </View>

                                <View style={styles.messageContent}>
                                    <Text style={styles.messageTitle}>
                                        {journey === 'after-cbc' &&
                                            'Starting your next chapter'}

                                        {journey === 'after-kcse' &&
                                            'Planning your next step'}

                                        {journey === 'university' &&
                                            'Building your career direction'}

                                        {journey === 'graduate' &&
                                            'Ready for the world of work'}
                                    </Text>

                                    <Text style={styles.messageText}>
                                        {journey === 'after-cbc' &&
                                            'We will help you explore your strengths, interests and possible future directions.'}

                                        {journey === 'after-kcse' &&
                                            'Your academic profile, interests and personality will help us explore suitable courses and career paths.'}

                                        {journey === 'university' &&
                                            'We will connect your course, strengths, personality and skills with your career direction.'}

                                        {journey === 'graduate' &&
                                            'We will connect your education, strengths, interests and skills with suitable career opportunities.'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <Text style={styles.note}>
                            Your answers help personalise your experience.
                        </Text>

                        <Pressable
                            onPress={handleContinue}
                            disabled={!journey}
                            style={styles.buttonWrapper}
                        >
                            <View
                                style={
                                    journey
                                        ? styles.activeButton
                                        : styles.disabledButton
                                }
                            >
                                <Text style={styles.continueText}>
                                    Continue
                                </Text>

                                <View
                                    style={
                                        journey
                                            ? styles.arrowCircle
                                            : styles.arrowCircleDisabled
                                    }
                                >
                                    <Ionicons
                                        name="arrow-forward"
                                        size={22}
                                        color={
                                            journey ? '#6247D5' : '#AAA7B0'
                                        }
                                    />
                                </View>
                            </View>
                        </Pressable>

                        <Text style={styles.bottomText}>
                            You can update your information later.
                        </Text>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(7, 10, 28, 0.78)',
    },

    container: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 30,
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 27,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    progressArea: {
        flex: 1,
        marginLeft: 14,
    },

    progressTrack: {
        height: 5,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.16)',
        overflow: 'hidden',
    },

    progressFill: {
        width: '20%',
        height: '100%',
        backgroundColor: '#7657E8',
        borderRadius: 5,
    },

    progressText: {
        color: '#AAA8B8',
        fontSize: 8,
        fontFamily: 'Poppins_500Medium',
        marginTop: 5,
        letterSpacing: 0.6,
    },

    introduction: {
        marginBottom: 23,
    },

    eyebrow: {
        color: '#A995FF',
        fontSize: 9,
        fontFamily: 'Poppins_600SemiBold',
        letterSpacing: 1.4,
        marginBottom: 7,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 29,
        lineHeight: 37,
        fontFamily: 'Poppins_600SemiBold',
    },

    subtitle: {
        color: '#C1C2CE',
        fontSize: 11,
        lineHeight: 18,
        fontFamily: 'Poppins_400Regular',
        marginTop: 8,
    },

    options: {
        gap: 10,
    },

    card: {
        minHeight: 101,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.94)',
        borderRadius: 17,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
        paddingHorizontal: 12,
        paddingVertical: 12,
    },

    cardSelected: {
        backgroundColor: '#F8F6FF',
        borderColor: '#8065E8',
        borderWidth: 1.5,
    },

    numberBox: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: '#ECE8FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    numberBoxSelected: {
        backgroundColor: '#7053D7',
    },

    number: {
        color: '#7053D7',
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
    },

    numberSelected: {
        color: '#FFFFFF',
    },

    cardContent: {
        flex: 1,
        paddingRight: 5,
    },

    cardTitle: {
        color: '#292637',
        fontSize: 13,
        lineHeight: 19,
        fontFamily: 'Poppins_600SemiBold',
    },

    cardTitleSelected: {
        color: '#5940B8',
    },

    cardSubtitle: {
        color: '#666171',
        fontSize: 9,
        lineHeight: 14,
        fontFamily: 'Poppins_500Medium',
    },

    cardDescription: {
        color: '#85818E',
        fontSize: 8,
        lineHeight: 13,
        fontFamily: 'Poppins_400Regular',
        marginTop: 3,
    },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#C5C1CD',
        alignItems: 'center',
        justifyContent: 'center',
    },

    radioSelected: {
        borderColor: '#7053D7',
    },

    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#7053D7',
    },

    messageBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(66,184,178,0.12)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(66,184,178,0.25)',
        padding: 12,
        marginTop: 14,
    },

    messageIcon: {
        width: 31,
        height: 31,
        borderRadius: 12,
        backgroundColor: '#42B8B2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 9,
    },

    messageContent: {
        flex: 1,
    },

    messageTitle: {
        color: '#77D2CC',
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 3,
    },

    messageText: {
        color: '#B9D1CF',
        fontSize: 8,
        lineHeight: 14,
        fontFamily: 'Poppins_400Regular',
    },

    note: {
        color: '#9695A5',
        fontSize: 8,
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
        marginTop: 17,
        marginBottom: 12,
    },

    buttonWrapper: {
        height: 57,
        borderRadius: 16,
        overflow: 'hidden',
    },

    activeButton: {
        flex: 1,
        backgroundColor: '#6952D8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 7,
    },

    disabledButton: {
        flex: 1,
        backgroundColor: '#5D5B64',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 7,
    },

    continueText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Poppins_600SemiBold',
    },

    arrowCircle: {
        width: 43,
        height: 43,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    arrowCircleDisabled: {
        width: 43,
        height: 43,
        borderRadius: 22,
        backgroundColor: '#77757D',
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomText: {
        color: '#77788A',
        fontSize: 8,
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
        marginTop: 9,
    },
});
import React from 'react';
import {
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useOnboarding } from '../context/OnboardingContext';

export default function AcademicScreen() {
    const {
        journey,
        qualification,
        setQualification,
        course,
        setCourse,
        yearOfStudy,
        setYearOfStudy,
        kcseGrade,
        setKcseGrade,
    } = useOnboarding();

    const universityValid =
        journey === 'university' &&
        qualification !== null &&
        course.trim().length >= 2 &&
        yearOfStudy !== null;

    const graduateValid =
        journey === 'graduate' &&
        qualification !== null &&
        course.trim().length >= 2;

    const kcseValid =
        journey === 'after-kcse';

    const cbcValid =
        journey === 'after-cbc' &&
        qualification !== null;

    const canContinue =
        universityValid ||
        graduateValid ||
        kcseValid ||
        cbcValid;

    const handleContinue = () => {
        if (!canContinue) return;

        router.push('/onboarding/personality');
    };

    if (!journey) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.empty}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={42}
                        color="#6952D8"
                    />

                    <Text style={styles.emptyTitle}>
                        Journey not selected
                    </Text>

                    <Text style={styles.emptyText}>
                        Please choose your current stage first.
                    </Text>

                    <Pressable
                        style={styles.chooseButton}
                        onPress={() =>
                            router.push('/onboarding/journey')
                        }
                    >
                        <Text style={styles.chooseButtonText}>
                            Choose my journey
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground
            source={require('../../assets/images/backgrounds/patterns3.jpeg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
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
                                    STEP 3 OF 5
                                </Text>
                            </View>
                        </View>

                        <View style={styles.introduction}>
                            <Text style={styles.eyebrow}>
                                ACADEMIC PROFILE
                            </Text>

                            <Text style={styles.title}>
                                Tell us about your education.
                            </Text>

                            <Text style={styles.subtitle}>
                                We'll use this information alongside
                                your interests, strengths and personality.
                            </Text>
                        </View>

                        {journey === 'after-kcse' && (
                            <>
                                <View style={styles.card}>
                                    <CardHeader
                                        icon="school-outline"
                                        title="Your secondary education"
                                        subtitle="Tell us about your KCSE background."
                                    />

                                    <View style={styles.completedBox}>
                                        <View style={styles.completedIcon}>
                                            <Ionicons
                                                name="checkmark"
                                                size={17}
                                                color="#FFFFFF"
                                            />
                                        </View>

                                        <View style={styles.completedContent}>
                                            <Text style={styles.completedTitle}>
                                                Secondary / High School
                                            </Text>

                                            <Text style={styles.completedText}>
                                                Completed KCSE
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.label}>
                                        KCSE grade
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="ribbon-outline"
                                            size={18}
                                            color="#6952D8"
                                        />

                                        <TextInput
                                            value={kcseGrade}
                                            onChangeText={setKcseGrade}
                                            placeholder="e.g. A, B+, B, C+"
                                            placeholderTextColor="#AAA7B2"
                                            style={styles.input}
                                            autoCapitalize="characters"
                                        />
                                    </View>

                                    <Text style={styles.optional}>
                                        Optional
                                    </Text>
                                </View>

                                <InfoBox text="Your KCSE results can help us identify suitable courses and career directions. You can skip the grade and continue." />
                            </>
                        )}

                        {journey === 'after-cbc' && (
                            <>
                                <View style={styles.card}>
                                    <CardHeader
                                        icon="compass-outline"
                                        title="Your next chapter"
                                        subtitle="Tell us where you are in your education."
                                    />

                                    <Text style={styles.label}>
                                        Current education level
                                    </Text>

                                    <Options
                                        value={qualification}
                                        onChange={setQualification}
                                        options={[
                                            'Secondary / High School',
                                        ]}
                                    />
                                </View>

                                <InfoBox text="We'll place greater emphasis on your interests, strengths, personality and aspirations when exploring your next direction." />
                            </>
                        )}

                        {journey === 'university' && (
                            <>
                                <View style={styles.card}>
                                    <CardHeader
                                        icon="school-outline"
                                        title="Your university journey"
                                        subtitle="Tell us what you are currently studying."
                                    />

                                    <Text style={styles.label}>
                                        Qualification
                                    </Text>

                                    <Options
                                        value={qualification}
                                        onChange={setQualification}
                                        options={[
                                            'Certificate',
                                            'Diploma',
                                            'Degree',
                                            'Master’s',
                                        ]}
                                    />

                                    <Text style={styles.label}>
                                        Course / programme
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="book-outline"
                                            size={18}
                                            color="#6952D8"
                                        />

                                        <TextInput
                                            value={course}
                                            onChangeText={setCourse}
                                            placeholder="e.g. BSc Information Technology"
                                            placeholderTextColor="#AAA7B2"
                                            style={styles.input}
                                        />
                                    </View>

                                    <Text style={styles.label}>
                                        Year of study
                                    </Text>

                                    <View style={styles.yearRow}>
                                        {[
                                            'Year 1',
                                            'Year 2',
                                            'Year 3',
                                            'Year 4+',
                                        ].map((year) => {
                                            const selected =
                                                yearOfStudy === year;

                                            return (
                                                <Pressable
                                                    key={year}
                                                    onPress={() =>
                                                        setYearOfStudy(year)
                                                    }
                                                    style={[
                                                        styles.yearButton,
                                                        selected &&
                                                        styles.yearSelected,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.yearText,
                                                            selected &&
                                                            styles.yearTextSelected,
                                                        ]}
                                                    >
                                                        {year}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </View>

                                <InfoBox text="Your course and year help us understand the skills and career directions that may be relevant to you." />
                            </>
                        )}

                        {journey === 'graduate' && (
                            <>
                                <View style={styles.card}>
                                    <CardHeader
                                        icon="briefcase-outline"
                                        title="Your academic background"
                                        subtitle="Tell us what you studied."
                                    />

                                    <Text style={styles.label}>
                                        Highest qualification
                                    </Text>

                                    <Options
                                        value={qualification}
                                        onChange={setQualification}
                                        options={[
                                            'Certificate',
                                            'Diploma',
                                            'Degree',
                                            'Master’s',
                                        ]}
                                    />

                                    <Text style={styles.label}>
                                        Field of study
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Ionicons
                                            name="book-outline"
                                            size={18}
                                            color="#6952D8"
                                        />

                                        <TextInput
                                            value={course}
                                            onChangeText={setCourse}
                                            placeholder="e.g. Information Technology"
                                            placeholderTextColor="#AAA7B2"
                                            style={styles.input}
                                        />
                                    </View>
                                </View>

                                <InfoBox text="We'll connect your education, strengths, interests and skills with suitable career opportunities." />
                            </>
                        )}

                        {!canContinue && (
                            <View style={styles.validation}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={17}
                                    color="#A995FF"
                                />

                                <Text style={styles.validationText}>
                                    Complete the required information before
                                    continuing.
                                </Text>
                            </View>
                        )}

                        <Pressable
                            disabled={!canContinue}
                            onPress={handleContinue}
                            style={styles.buttonWrapper}
                        >
                            <View
                                style={
                                    canContinue
                                        ? styles.activeButton
                                        : styles.disabledButton
                                }
                            >
                                <Text style={styles.continueText}>
                                    Continue
                                </Text>

                                <View
                                    style={
                                        canContinue
                                            ? styles.arrowCircle
                                            : styles.arrowCircleDisabled
                                    }
                                >
                                    <Ionicons
                                        name="arrow-forward"
                                        size={22}
                                        color={
                                            canContinue
                                                ? '#6247D5'
                                                : '#AAA7B0'
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

function CardHeader({
    icon,
    title,
    subtitle,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
}) {
    return (
        <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
                <Ionicons
                    name={icon}
                    size={19}
                    color="#FFFFFF"
                />
            </View>

            <View>
                <Text style={styles.cardTitle}>
                    {title}
                </Text>

                <Text style={styles.cardSubtitle}>
                    {subtitle}
                </Text>
            </View>
        </View>
    );
}

function Options({
    value,
    onChange,
    options,
}: {
    value: string | null;
    onChange: (value: string) => void;
    options: string[];
}) {
    return (
        <View style={styles.options}>
            {options.map((item) => {
                const selected = value === item;

                return (
                    <Pressable
                        key={item}
                        onPress={() => onChange(item)}
                        style={[
                            styles.option,
                            selected && styles.optionSelected,
                        ]}
                    >
                        {selected && (
                            <Ionicons
                                name="checkmark"
                                size={14}
                                color="#FFFFFF"
                            />
                        )}

                        <Text
                            style={[
                                styles.optionText,
                                selected &&
                                styles.optionTextSelected,
                            ]}
                        >
                            {item}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

function InfoBox({ text }: { text: string }) {
    return (
        <View style={styles.infoBox}>
            <View style={styles.infoIcon}>
                <Ionicons
                    name="sparkles-outline"
                    size={17}
                    color="#FFFFFF"
                />
            </View>

            <Text style={styles.infoText}>
                {text}
            </Text>
        </View>
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
        width: '60%',
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
        fontSize: 27,
        lineHeight: 36,
        fontFamily: 'Poppins_600SemiBold',
    },

    subtitle: {
        color: '#C1C2CE',
        fontSize: 11,
        lineHeight: 18,
        fontFamily: 'Poppins_400Regular',
        marginTop: 8,
    },

    card: {
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 19,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        padding: 16,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 19,
    },

    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 13,
        backgroundColor: '#6952D8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    cardTitle: {
        color: '#292637',
        fontSize: 12,
        fontFamily: 'Poppins_600SemiBold',
    },

    cardSubtitle: {
        color: '#898692',
        fontSize: 8,
        fontFamily: 'Poppins_400Regular',
        marginTop: 2,
    },

    label: {
        color: '#302D3D',
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
        marginTop: 16,
        marginBottom: 8,
    },

    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    option: {
        minHeight: 41,
        paddingHorizontal: 13,
        borderRadius: 12,
        backgroundColor: '#F7F5FB',
        borderWidth: 1,
        borderColor: '#E3E0E9',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 4,
    },

    optionSelected: {
        backgroundColor: '#6952D8',
        borderColor: '#6952D8',
    },

    optionText: {
        color: '#625C70',
        fontSize: 9,
        fontFamily: 'Poppins_500Medium',
    },

    optionTextSelected: {
        color: '#FFFFFF',
    },

    completedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9F8',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#D2EAE7',
        padding: 12,
    },

    completedIcon: {
        width: 32,
        height: 32,
        borderRadius: 11,
        backgroundColor: '#42B8B2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    completedContent: {
        marginLeft: 9,
    },

    completedTitle: {
        color: '#216E69',
        fontSize: 10,
        fontFamily: 'Poppins_600SemiBold',
    },

    completedText: {
        color: '#6C8582',
        fontSize: 8,
        fontFamily: 'Poppins_400Regular',
        marginTop: 2,
    },

    inputContainer: {
        height: 49,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#E3E0E9',
        backgroundColor: '#FAF9FC',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },

    input: {
        flex: 1,
        height: 49,
        marginLeft: 9,
        color: '#292637',
        fontSize: 11,
        fontFamily: 'Poppins_400Regular',
    },

    optional: {
        color: '#96929F',
        fontSize: 8,
        fontFamily: 'Poppins_400Regular',
        marginTop: 4,
    },

    yearRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    yearButton: {
        height: 40,
        paddingHorizontal: 13,
        borderRadius: 11,
        backgroundColor: '#F7F5FB',
        borderWidth: 1,
        borderColor: '#E3E0E9',
        alignItems: 'center',
        justifyContent: 'center',
    },

    yearSelected: {
        backgroundColor: '#42B8B2',
        borderColor: '#42B8B2',
    },

    yearText: {
        color: '#625C70',
        fontSize: 9,
        fontFamily: 'Poppins_500Medium',
    },

    yearTextSelected: {
        color: '#FFFFFF',
    },

    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(66,184,178,0.11)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(66,184,178,0.24)',
        padding: 12,
        marginTop: 13,
    },

    infoIcon: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#42B8B2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 9,
    },

    infoText: {
        flex: 1,
        color: '#B9D1CF',
        fontSize: 8,
        lineHeight: 14,
        fontFamily: 'Poppins_400Regular',
    },

    validation: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(112,83,215,0.13)',
        borderRadius: 13,
        padding: 11,
        marginTop: 14,
    },

    validationText: {
        flex: 1,
        color: '#C0B8DB',
        fontSize: 8,
        lineHeight: 14,
        fontFamily: 'Poppins_400Regular',
        marginLeft: 7,
    },

    buttonWrapper: {
        height: 57,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
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

    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 35,
    },

    emptyTitle: {
        color: '#292637',
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        marginTop: 13,
    },

    emptyText: {
        color: '#777381',
        fontSize: 11,
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
        marginTop: 7,
    },

    chooseButton: {
        backgroundColor: '#6952D8',
        borderRadius: 14,
        paddingHorizontal: 20,
        paddingVertical: 13,
        marginTop: 20,
    },

    chooseButtonText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontFamily: 'Poppins_600SemiBold',
    },
});
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

export default function ProfileScreen() {
    const {
        name,
        setName,
        age,
        setAge,
        gender,
        setGender,
    } = useOnboarding();

    const validName = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]{1,49}$/.test(
        name.trim()
    );

    const ageNumber = Number(age);

    const validAge =
        age.trim() !== '' &&
        Number.isInteger(ageNumber) &&
        ageNumber >= 13 &&
        ageNumber <= 70;

    const validGender =
        gender === 'Male' ||
        gender === 'Female' ||
        gender === 'Prefer not to say';

    const canContinue =
        validName &&
        validAge &&
        validGender;

    const handleContinue = () => {
        if (!canContinue) return;

        router.push('/onboarding/academic');
    };

    return (
        <ImageBackground
            source={require('../../assets/images/backgrounds/patterns2.jpeg')}
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
                                    STEP 2 OF 5
                                </Text>
                            </View>
                        </View>

                        <View style={styles.introduction}>
                            <Text style={styles.eyebrow}>
                                ABOUT YOU
                            </Text>

                            <Text style={styles.title}>
                                Let's get to know you.
                            </Text>

                            <Text style={styles.subtitle}>
                                A few details help us make your career
                                experience more relevant to you.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconBox}>
                                    <Ionicons
                                        name="person-outline"
                                        size={19}
                                        color="#FFFFFF"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.cardTitle}>
                                        Basic information
                                    </Text>

                                    <Text style={styles.cardSubtitle}>
                                        Tell us a little about yourself.
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.label}>
                                Full name
                            </Text>

                            <View
                                style={[
                                    styles.inputContainer,
                                    name.length > 0 &&
                                    !validName &&
                                    styles.inputError,
                                    validName &&
                                    styles.inputValid,
                                ]}
                            >
                                <Ionicons
                                    name="person-outline"
                                    size={18}
                                    color="#6952D8"
                                />

                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#AAA7B2"
                                    style={styles.input}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </View>

                            {name.length > 0 && !validName && (
                                <Text style={styles.errorText}>
                                    Please enter a valid name.
                                </Text>
                            )}

                            <Text style={styles.label}>
                                Age
                            </Text>

                            <View
                                style={[
                                    styles.inputContainer,
                                    age.length > 0 &&
                                    !validAge &&
                                    styles.inputError,
                                    validAge &&
                                    styles.inputValid,
                                ]}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={18}
                                    color="#6952D8"
                                />

                                <TextInput
                                    value={age}
                                    onChangeText={(value) =>
                                        setAge(value.replace(/[^0-9]/g, ''))
                                    }
                                    placeholder="Enter your age"
                                    placeholderTextColor="#AAA7B2"
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    maxLength={2}
                                />
                            </View>

                            {age.length > 0 && !validAge && (
                                <Text style={styles.errorText}>
                                    Please enter a valid age.
                                </Text>
                            )}

                            <Text style={styles.label}>
                                Gender
                            </Text>

                            <View style={styles.genderRow}>
                                {[
                                    'Male',
                                    'Female',
                                    'Prefer not to say',
                                ].map((item) => {
                                    const selected = gender === item;

                                    return (
                                        <Pressable
                                            key={item}
                                            onPress={() =>
                                                setGender(item)
                                            }
                                            style={[
                                                styles.genderButton,
                                                selected &&
                                                styles.genderSelected,
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
                                                    styles.genderText,
                                                    selected &&
                                                    styles.genderTextSelected,
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.privacyBox}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={16}
                                color="#42B8B2"
                            />

                            <Text style={styles.privacyText}>
                                Your information is used to personalise
                                your career guidance experience.
                            </Text>
                        </View>

                        {!canContinue && (
                            <View style={styles.validationBox}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={17}
                                    color="#A995FF"
                                />

                                <Text style={styles.validationText}>
                                    Complete the required information to
                                    continue.
                                </Text>
                            </View>
                        )}

                        <Pressable
                            onPress={handleContinue}
                            disabled={!canContinue}
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
        marginBottom: 28,
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
        width: '40%',
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
        marginBottom: 24,
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
        fontSize: 28,
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

    card: {
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 19,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.30)',
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
        marginBottom: 7,
        marginTop: 15,
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

    inputError: {
        borderColor: '#C8C4D2',
    },

    inputValid: {
        borderColor: '#9BDBD6',
    },

    input: {
        flex: 1,
        height: 49,
        marginLeft: 9,
        color: '#292637',
        fontSize: 11,
        fontFamily: 'Poppins_400Regular',
    },

    errorText: {
        color: '#777381',
        fontSize: 8,
        fontFamily: 'Poppins_400Regular',
        marginTop: 4,
    },

    genderRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    genderButton: {
        minHeight: 40,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#F7F5FB',
        borderWidth: 1,
        borderColor: '#E3E0E9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },

    genderSelected: {
        backgroundColor: '#6952D8',
        borderColor: '#6952D8',
    },

    genderText: {
        color: '#625C70',
        fontSize: 9,
        fontFamily: 'Poppins_500Medium',
    },

    genderTextSelected: {
        color: '#FFFFFF',
    },

    privacyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(66,184,178,0.10)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(66,184,178,0.22)',
        padding: 12,
        marginTop: 14,
    },

    privacyText: {
        flex: 1,
        color: '#B9D1CF',
        fontSize: 8,
        lineHeight: 14,
        fontFamily: 'Poppins_400Regular',
        marginLeft: 8,
    },

    validationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(112,83,215,0.13)',
        borderRadius: 13,
        padding: 11,
        marginTop: 14,
    },

    validationText: {
        color: '#C0B8DB',
        fontSize: 8,
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
});
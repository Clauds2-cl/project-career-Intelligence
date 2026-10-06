import React from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/onboarding/journey');
  };

  return (
    <View style={styles.container}>

      <ImageBackground
        source={require('../assets/images/onboarding/student.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >

        {/* DARK GRADIENT OVER IMAGE */}

        <LinearGradient
          colors={[
            'rgba(5, 15, 38, 0.02)',
            'rgba(5, 15, 40, 0.16)',
            'rgba(5, 13, 39, 0.78)',
            'rgba(4, 10, 30, 0.98)',
          ]}
          locations={[0, 0.32, 0.62, 0.86]}
          style={styles.overlay}
        >

          {/* SUBTLE DECORATION */}

          <View style={styles.dotPattern}>
            {Array.from({ length: 18 }).map((_, index) => (
              <View
                key={index}
                style={styles.dot}
              />
            ))}
          </View>

          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          <SafeAreaView style={styles.safeArea}>

            <View style={styles.content}>

              {/* TOP SECTION */}

              <View style={styles.topSection}>

                <View style={styles.badge}>

                  <Text style={styles.sparkle}>
                    ✦
                  </Text>

                  <Text style={styles.badgeText}>
                    CAREER GUIDANCE
                  </Text>

                </View>

              </View>

              {/* HERO SECTION */}

              <View style={styles.heroSection}>

                <Text style={styles.eyebrow}>
                  YOUR FUTURE STARTS HERE
                </Text>

                <Text style={styles.titleWhite}>
                  AI Career
                </Text>

                <Text style={styles.titlePurple}>
                  Intelligence
                </Text>

                <Text style={styles.andText}>
                  &
                </Text>

                <Text style={styles.titleTeal}>
                  Employability
                </Text>

                <Text style={styles.titleTeal}>
                  Readiness
                </Text>

                <View style={styles.accentLine} />

                <Text style={styles.description}>
                  Discover your strengths, explore your
                  possibilities and prepare for the world
                  of work.
                </Text>

                {/* FEATURES */}

                <View style={styles.features}>

                  <FeatureItem
                    icon="✦"
                    text="Discover where you belong."
                  />

                  <FeatureItem
                    icon="↗"
                    text="Build where you want to go."
                  />

                  <FeatureItem
                    icon="◆"
                    text="Prepare for employment."
                  />

                </View>

              </View>

              {/* BOTTOM SECTION */}

              <View style={styles.bottomSection}>

                <Pressable
                  onPress={handleGetStarted}
                  style={({ pressed }) => [
                    styles.getStartedButton,
                    pressed && styles.buttonPressed,
                  ]}
                >

                  <LinearGradient
                    colors={[
                      '#5148E8',
                      '#7957E8',
                      '#42B8B2',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >

                    <Text style={styles.getStartedText}>
                      Get started
                    </Text>

                    {/* NORMAL ARROW */}

                    <View style={styles.arrowCircle}>

                      <View style={styles.arrowLine} />

                      <View style={styles.arrowHeadTop} />

                      <View style={styles.arrowHeadBottom} />

                    </View>

                  </LinearGradient>

                </Pressable>

                <Pressable
                  style={styles.accountButton}
                  onPress={() =>
                    router.push('/(tabs)')
                  }
                >

                  <Text style={styles.accountText}>
                    I already have an account
                  </Text>

                </Pressable>

                <Text style={styles.footerText}>
                  Career intelligence • Skills • Employability
                </Text>

              </View>

            </View>

          </SafeAreaView>

        </LinearGradient>

      </ImageBackground>

    </View>
  );
}


/* ================================================= */
/* FEATURE ITEM */
/* ================================================= */

type FeatureItemProps = {
  icon: string;
  text: string;
};

function FeatureItem({
  icon,
  text,
}: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>

      <LinearGradient
        colors={[
          '#5D49D9',
          '#8053D1',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureIcon}
      >

        <Text style={styles.featureIconText}>
          {icon}
        </Text>

      </LinearGradient>

      <Text style={styles.featureText}>
        {text}
      </Text>

    </View>
  );
}


/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050B24',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },


  /* ================================================= */
  /* TOP */
  /* ================================================= */

  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 52,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 13,
    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor:
      'rgba(10, 12, 38, 0.58)',

    borderWidth: 1,

    borderColor:
      'rgba(164, 137, 255, 0.48)',
  },

  sparkle: {
    color: '#B8A7FF',
    fontSize: 14,
    marginRight: 6,
  },

  badgeText: {
    color: '#F1EFFA',
    fontSize: 8,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.6,
  },


  /* ================================================= */
  /* HERO */
  /* ================================================= */

  heroSection: {
    marginTop: height * 0.045,
  },

  eyebrow: {
    color: '#B8B0FF',
    fontSize: 9,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 1.6,
    marginBottom: 8,
  },

  titleWhite: {
    color: '#FFFFFF',

    fontSize:
      width > 380 ? 39 : 35,

    fontFamily:
      'Poppins_600SemiBold',

    lineHeight:
      width > 380 ? 47 : 42,

    letterSpacing: -0.7,
  },

  titlePurple: {
    color: '#B09AFF',

    fontSize:
      width > 380 ? 39 : 35,

    fontFamily:
      'Poppins_600SemiBold',

    lineHeight:
      width > 380 ? 47 : 42,

    letterSpacing: -0.7,
  },

  andText: {
    color: '#FFFFFF',

    fontSize: 22,

    fontFamily:
      'Poppins_500Medium',

    lineHeight: 28,

    marginVertical: 1,
  },

  titleTeal: {
    color: '#42D4CF',

    fontSize:
      width > 380 ? 32 : 29,

    fontFamily:
      'Poppins_600SemiBold',

    lineHeight:
      width > 380 ? 38 : 35,

    letterSpacing: -0.5,
  },

  accentLine: {
    width: 54,
    height: 3,

    borderRadius: 3,

    backgroundColor: '#8A6CF1',

    marginTop: 14,
    marginBottom: 13,
  },

  description: {
    color: '#C1C5D5',

    fontSize: 12,

    fontFamily:
      'Poppins_400Regular',

    lineHeight: 19,

    maxWidth: 330,

    marginBottom: 14,
  },


  /* ================================================= */
  /* FEATURES */
  /* ================================================= */

  features: {
    gap: 8,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureIcon: {
    width: 27,
    height: 27,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,
  },

  featureIconText: {
    color: '#FFFFFF',

    fontSize: 11,

    fontFamily:
      'Poppins_600SemiBold',
  },

  featureText: {
    color: '#F0F1F5',

    fontSize: 12,

    fontFamily:
      'Poppins_400Regular',
  },


  /* ================================================= */
  /* BOTTOM */
  /* ================================================= */

  bottomSection: {
    width: '100%',
  },

  getStartedButton: {
    height: 59,
    width: '100%',

    borderRadius: 18,

    overflow: 'hidden',
  },

  buttonGradient: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingLeft: 21,
    paddingRight: 7,
  },

  getStartedText: {
    color: '#FFFFFF',

    fontSize: 14,

    fontFamily:
      'Poppins_600SemiBold',

    letterSpacing: 0.1,
  },


  /* ================================================= */
  /* ARROW */
  /* ================================================= */

  arrowCircle: {
    width: 45,
    height: 45,

    borderRadius: 23,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowLine: {
    position: 'absolute',

    width: 18,
    height: 2.5,

    borderRadius: 2,

    backgroundColor: '#5B35D5',

    left: 11,
  },

  arrowHeadTop: {
    position: 'absolute',

    width: 9,
    height: 2.5,

    borderRadius: 2,

    backgroundColor: '#5B35D5',

    transform: [
      {
        rotate: '45deg',
      },
    ],

    right: 10,
  },

  arrowHeadBottom: {
    position: 'absolute',

    width: 9,
    height: 2.5,

    borderRadius: 2,

    backgroundColor: '#5B35D5',

    transform: [
      {
        rotate: '-45deg',
      },
    ],

    right: 10,
  },


  /* ================================================= */
  /* ACCOUNT */
  /* ================================================= */

  accountButton: {
    height: 43,

    alignItems: 'center',
    justifyContent: 'center',
  },

  accountText: {
    color: '#D0D2DF',

    fontSize: 10,

    fontFamily:
      'Poppins_500Medium',
  },

  footerText: {
    color: '#707891',

    fontSize: 8,

    fontFamily:
      'Poppins_400Regular',

    textAlign: 'center',

    marginTop: 1,
  },


  /* ================================================= */
  /* PRESS */
  /* ================================================= */

  buttonPressed: {
    opacity: 0.8,
  },


  /* ================================================= */
  /* DECORATION */
  /* ================================================= */

  dotPattern: {
    position: 'absolute',

    top: 82,
    left: 18,

    width: 90,

    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 12,

    opacity: 0.65,
  },

  dot: {
    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: '#8055FF',
  },

  glowOne: {
    position: 'absolute',

    width: 280,
    height: 280,

    borderRadius: 140,

    backgroundColor:
      'rgba(78, 70, 229, 0.12)',

    top: height * 0.55,

    right: -170,
  },

  glowTwo: {
    position: 'absolute',

    width: 220,
    height: 220,

    borderRadius: 110,

    backgroundColor:
      'rgba(45, 212, 191, 0.06)',

    top: height * 0.32,

    left: -150,
  },

});
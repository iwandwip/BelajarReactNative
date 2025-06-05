import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/ui/Input";
import DatePicker from "../../components/ui/DatePicker";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  updateUserProfile,
  startRfidPairing,
  resetRfidPairing,
  completeRfidPairing,
  subscribeToUserProfile,
} from "../../services/userService";
import {
  RFID_PAIRING_STATES,
  isRfidPairingExpired,
  getRfidPairingStatus,
} from "../../utils/rfidPairing";
import { Colors } from "../../constants/Colors";

export default function EditProfile() {
  const { userProfile, refreshProfile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [rfidPairing, setRfidPairing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    parentName: userProfile?.parentName || "",
    birthdate: userProfile?.birthdate || "",
    gender: userProfile?.gender || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!userProfile?.id) return;

    const unsubscribe = subscribeToUserProfile(userProfile.id, (doc) => {
      if (doc.exists()) {
        const data = doc.data();

        if (data.rfidPairingState === RFID_PAIRING_STATES.WAITING) {
          if (isRfidPairingExpired(data.rfidPairingTimestamp)) {
            handleRfidTimeout();
          } else {
            setRfidPairing(true);
          }
        }

        if (data.pendingRfid && data.pendingRfid.trim() !== "") {
          handleRfidSuccess(data.pendingRfid);
        }
      }
    });

    return unsubscribe;
  }, [userProfile?.id]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Child name is required";
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Birth date is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await updateUserProfile(userProfile.id, formData);

      if (result.success) {
        await refreshProfile();
        Alert.alert(
          "Profile Updated",
          "Your profile has been updated successfully!",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert("Update Failed", result.error);
      }
    } catch (error) {
      Alert.alert("Update Failed", "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleRfidPairing = async () => {
    try {
      setRfidPairing(true);
      const result = await startRfidPairing(userProfile.id);

      if (!result.success) {
        Alert.alert("Pairing Failed", result.error);
        setRfidPairing(false);
      }
    } catch (error) {
      Alert.alert("Pairing Failed", "Something went wrong. Please try again.");
      setRfidPairing(false);
    }
  };

  const handleRfidSuccess = async (rfidData) => {
    try {
      const result = await completeRfidPairing(userProfile.id, rfidData);

      if (result.success) {
        await refreshProfile();
        setRfidPairing(false);
        Alert.alert(
          "RFID Paired",
          "Your RFID card has been successfully paired!",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("RFID completion error:", error);
      setRfidPairing(false);
    }
  };

  const handleRfidTimeout = async () => {
    try {
      await resetRfidPairing(userProfile.id);
      setRfidPairing(false);
      Alert.alert(
        "Pairing Timeout",
        "RFID pairing timed out. Please try again.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("RFID timeout error:", error);
      setRfidPairing(false);
    }
  };

  const handleCancelRfidPairing = async () => {
    try {
      await resetRfidPairing(userProfile.id);
      setRfidPairing(false);
    } catch (error) {
      console.error("Cancel RFID error:", error);
      setRfidPairing(false);
    }
  };

  const getDateLimits = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 3);

    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 18);

    return { maxDate, minDate };
  };

  const { maxDate, minDate } = getDateLimits();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
          bounces={false}
        >
          <View style={styles.formContainer}>
            <Input
              label="Child Name"
              placeholder="Enter child's name"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              autoCapitalize="words"
              error={errors.name}
            />

            <Input
              label="Parent Name"
              placeholder="Enter parent's name"
              value={formData.parentName}
              onChangeText={(value) => updateFormData("parentName", value)}
              autoCapitalize="words"
              error={errors.parentName}
            />

            <DatePicker
              label="Birth Date"
              placeholder="Select birth date"
              value={formData.birthdate}
              onChange={(value) => updateFormData("birthdate", value)}
              maximumDate={maxDate}
              minimumDate={minDate}
              error={errors.birthdate}
            />

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <Button
                  title="Male"
                  onPress={() => updateFormData("gender", "male")}
                  variant={formData.gender === "male" ? "primary" : "outline"}
                  style={styles.genderButton}
                />
                <Button
                  title="Female"
                  onPress={() => updateFormData("gender", "female")}
                  variant={formData.gender === "female" ? "primary" : "outline"}
                  style={styles.genderButton}
                />
              </View>
              {errors.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}
            </View>

            <View style={styles.rfidContainer}>
              <Text style={styles.rfidLabel}>RFID Card</Text>
              <View style={styles.rfidInfo}>
                <Text style={styles.rfidValue}>
                  {userProfile?.rfid || "Not paired"}
                </Text>
                {userProfile?.rfid && (
                  <Text style={styles.rfidConnected}>✓ Connected</Text>
                )}
              </View>

              {rfidPairing ? (
                <View style={styles.rfidPairingContainer}>
                  <LoadingSpinner
                    size="small"
                    text="Tap your RFID card on the device..."
                  />
                  <Button
                    title="Cancel"
                    onPress={handleCancelRfidPairing}
                    variant="outline"
                    style={styles.cancelRfidButton}
                  />
                </View>
              ) : (
                <Button
                  title={userProfile?.rfid ? "Re-pair RFID" : "Pair RFID Card"}
                  onPress={handleRfidPairing}
                  variant="outline"
                  style={styles.rfidButton}
                />
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.cancelButton}
              disabled={loading || rfidPairing}
            />

            <Button
              title={loading ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              style={styles.saveButton}
              disabled={loading || rfidPairing}
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray900,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formContainer: {
    flex: 1,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  rfidContainer: {
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  rfidLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: 8,
  },
  rfidInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rfidValue: {
    fontSize: 14,
    color: Colors.gray600,
    flex: 1,
  },
  rfidConnected: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: "500",
  },
  rfidPairingContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  rfidButton: {
    marginTop: 8,
  },
  cancelRfidButton: {
    marginTop: 12,
    minWidth: 100,
  },
  buttonContainer: {
    marginTop: 32,
    gap: 12,
  },
  cancelButton: {
    marginBottom: 8,
  },
  saveButton: {
    marginBottom: 8,
  },
});

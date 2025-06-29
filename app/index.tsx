import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import Header from "../components/Header";

interface FormData {
  name: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  phoneNumber: string;
}

// Yup validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name is a required field"),
  address: Yup.string()
    .required("Please enter your address")
    .min(10, "Address is a required field"),
  state: Yup.string()
    .required("Please enter your state")
    .min(2, "State is a required field"),
  city: Yup.string()
    .required("Please enter your city")
    .min(2, "City is a required field"),
  pincode: Yup.string()
    .required("Please enter pincode")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  phoneNumber: Yup.string()
    .required("Please enter phone number")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export default function FormScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const errorMessages: Record<string, string> = {};
      if (validationErrors instanceof Yup.ValidationError) {
        validationErrors.inner.forEach((error) => {
          if (error.path) {
            errorMessages[error.path] = error.message;
          }
        });
      }
      setErrors(errorMessages);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      Alert.alert(
        "Form Submitted Successfully!",
        `Name: ${formData.name}\nAddress: ${formData.address}\nCity: ${formData.city}\nState: ${formData.state}\nPincode: ${formData.pincode}\nPhone: ${formData.phoneNumber}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form after submission
              setFormData({
                name: "",
                address: "",
                state: "",
                city: "",
                pincode: "",
                phoneNumber: "",
              });
              setErrors({});
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header />
      <LinearGradient
        style={styles.MainContainer}
        colors={["#667eea", "#764ba2", "#f093fb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Personal Information </Text>
                <Text style={styles.subtitle}>
                  Please fill in your details below
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.name && styles.inputError,
                    focusedField === "name" && styles.inputFocused,
                  ]}
                  value={formData.name}
                  onChangeText={(text) => updateField("name", text)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#A0AEC0"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.multilineInput,
                    errors.address && styles.inputError,
                    focusedField === "address" && styles.inputFocused,
                  ]}
                  value={formData.address}
                  onChangeText={(text) => updateField("address", text)}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your complete address"
                  placeholderTextColor="#A0AEC0"
                  multiline
                  numberOfLines={3}
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.state && styles.inputError,
                    focusedField === "state" && styles.inputFocused,
                  ]}
                  value={formData.state}
                  onChangeText={(text) => updateField("state", text)}
                  onFocus={() => setFocusedField("state")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your state"
                  placeholderTextColor="#A0AEC0"
                />
                {errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.city && styles.inputError,
                    focusedField === "city" && styles.inputFocused,
                  ]}
                  value={formData.city}
                  onChangeText={(text) => updateField("city", text)}
                  onFocus={() => setFocusedField("city")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your city"
                  placeholderTextColor="#A0AEC0"
                />
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pincode *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.pincode && styles.inputError,
                    focusedField === "pincode" && styles.inputFocused,
                  ]}
                  value={formData.pincode}
                  onChangeText={(text) => updateField("pincode", text)}
                  onFocus={() => setFocusedField("pincode")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter 6-digit pincode"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  maxLength={6}
                />
                {errors.pincode && (
                  <Text style={styles.errorText}>{errors.pincode}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.phoneNumber && styles.inputError,
                    focusedField === "phoneNumber" && styles.inputFocused,
                  ]}
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateField("phoneNumber", text)}
                  onFocus={() => setFocusedField("phoneNumber")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButtonContainer}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Submit Form</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  MainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 32,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    fontWeight: "300",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#4A5568",
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#2D3748",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    fontWeight: "500",
  },
  inputFocused: {
    borderColor: "#667eea",
    backgroundColor: "#FFFFFF",
    shadowColor: "#667eea",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  inputError: {
    borderColor: "#F56565",
    backgroundColor: "#fff",
    shadowColor: "#E53E3E",
    shadowOpacity: 0.2,
  },
  errorText: {
    color: "#F56565",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
    marginLeft: 4,
  },
  multilineInput: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  submitButtonContainer: {
    marginTop: 32,
    borderRadius: 16,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  submitButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import { signOutUser } from "../../services/authService";
import { Colors } from "../../constants/Colors";

function AdminHome() {
  const { currentUser, userProfile } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigationRef = useRef(false);

  const handleLogout = async () => {
    if (loggingOut || navigationRef.current) return;

    setLoggingOut(true);
    const result = await signOutUser();

    if (result.success) {
      navigationRef.current = true;
      router.replace("/(auth)/login");
    } else {
      Alert.alert("Logout Failed", "Failed to logout. Please try again.");
    }

    setLoggingOut(false);
  };

  const getWelcomeMessage = () => {
    return "Welcome Admin!";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{getWelcomeMessage()}</Text>

          <View style={styles.profileContainer}>
            <View style={styles.profileCard}>
              <Text style={styles.cardTitle}>Admin Profile</Text>

              <View style={styles.profileRow}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>Admin</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>Teacher</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{currentUser?.email}</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.label}>Access Level:</Text>
                <Text style={styles.value}>Administrator</Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <Text style={styles.cardTitle}>System Overview</Text>

              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👥</Text>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>User Management</Text>
                  <Text style={styles.statDescription}>
                    View and manage all student data
                  </Text>
                </View>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📊</Text>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Data Analytics</Text>
                  <Text style={styles.statDescription}>
                    Monitor nutrition status trends
                  </Text>
                </View>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statIcon}>⚖️</Text>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>IoT Integration</Text>
                  <Text style={styles.statDescription}>
                    Connected weighing system
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Button
              title={loggingOut ? "Logging out..." : "Logout"}
              onPress={handleLogout}
              variant="outline"
              style={styles.logoutButton}
              disabled={loggingOut}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.gray900,
    marginBottom: 24,
    textAlign: "center",
  },
  profileContainer: {
    marginBottom: 32,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: 16,
    textAlign: "center",
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray600,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: Colors.gray900,
    flex: 2,
    textAlign: "right",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.gray900,
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 14,
    color: Colors.gray600,
  },
  actionsContainer: {
    gap: 12,
  },
  logoutButton: {
    marginBottom: 8,
  },
});

export default AdminHome;

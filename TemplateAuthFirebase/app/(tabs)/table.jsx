import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSettings } from "../../contexts/SettingsContext";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import { generateBulkData } from "../../utils/dataGenerator";
import { getColors } from "../../constants/Colors";

export default function TableScreen() {
  const { theme } = useSettings();
  const { t } = useTranslation();
  const colors = getColors(theme);
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [generating, setGenerating] = useState(false);

  const handleGenerateData = () => {
    Alert.alert(t("table.generateTitle"), t("table.generateMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("table.generate"),
        onPress: async () => {
          setGenerating(true);
          setTimeout(() => {
            const newData = generateBulkData(10);
            setData(newData);
            setGenerating(false);
            Alert.alert(t("common.success"), t("table.generateSuccess"));
          }, 1000);
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(t("table.clearTitle"), t("table.clearMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("table.clear"),
        style: "destructive",
        onPress: () => {
          setData([]);
          Alert.alert(t("common.success"), t("table.clearSuccess"));
        },
      },
    ]);
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);

    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return newOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setData(sortedData);
  };

  const handleEdit = (item) => {
    Alert.alert(t("table.editTitle"), `${t("table.editMessage")} ${item.name}`);
  };

  const handleDelete = (item) => {
    Alert.alert(
      t("table.deleteTitle"),
      `${t("table.deleteMessage")} ${item.name}?`,
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            const newData = data.filter((d) => d.id !== item.id);
            setData(newData);
            Alert.alert(t("common.success"), t("table.deleteSuccess"));
          },
        },
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("table.title")}</Text>
        <Text style={styles.subtitle}>{t("table.subtitle")}</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsContainer}>
          <Button
            title={generating ? t("table.generating") : t("table.generateData")}
            onPress={handleGenerateData}
            style={styles.generateButton}
            disabled={generating}
          />

          {data.length > 0 && (
            <Button
              title={t("table.clearData")}
              onPress={handleClearData}
              variant="outline"
              style={styles.clearButton}
            />
          )}

          {data.length > 0 && (
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>{t("table.sortByDate")}:</Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={handleSortToggle}
              >
                <Text style={styles.sortButtonText}>
                  {sortOrder === "desc"
                    ? t("table.newestFirst")
                    : t("table.oldestFirst")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.tableContainer}>
          {data.length > 0 ? (
            <DataTable
              headers={[
                t("common.name"),
                t("common.email"),
                t("table.date"),
                t("table.status"),
                t("common.actions"),
              ]}
              data={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
              keyExtractor={(item, index) => `table-item-${index}`}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("table.noData")}</Text>
              <Text style={styles.emptySubtext}>{t("table.noDataDesc")}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
      backgroundColor: colors.white,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.gray900,
      textAlign: "center",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.gray600,
      textAlign: "center",
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 24,
    },
    actionsContainer: {
      marginBottom: 24,
    },
    generateButton: {
      marginBottom: 12,
    },
    clearButton: {
      marginBottom: 16,
    },
    sortContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.white,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    sortLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.gray700,
    },
    sortButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    sortButtonText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: "600",
    },
    tableContainer: {
      flex: 1,
    },
    emptyContainer: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 32,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.gray700,
      marginBottom: 8,
      textAlign: "center",
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.gray500,
      textAlign: "center",
      lineHeight: 20,
    },
  });

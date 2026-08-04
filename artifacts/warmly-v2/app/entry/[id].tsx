import React from "react";
import { useLocalSearchParams } from "expo-router";
import { EntryDetailScreen } from "../../src/screens";

export default function EntryDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EntryDetailScreen entryId={id} />;
}

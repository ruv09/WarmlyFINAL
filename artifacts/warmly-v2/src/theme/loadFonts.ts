import { useFonts } from "expo-font";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import {
  Literata_400Regular,
  Literata_400Regular_Italic,
  Literata_500Medium,
  Literata_500Medium_Italic,
  Literata_600SemiBold,
  Literata_600SemiBold_Italic,
  Literata_700Bold,
  Literata_700Bold_Italic,
} from "@expo-google-fonts/literata";

/** Грузим только нужные начертания пары Nunito + Literata. */
export function useWarmlyFonts() {
  return useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Literata_400Regular,
    Literata_500Medium,
    Literata_600SemiBold,
    Literata_700Bold,
    Literata_400Regular_Italic,
    Literata_500Medium_Italic,
    Literata_600SemiBold_Italic,
    Literata_700Bold_Italic,
  });
}

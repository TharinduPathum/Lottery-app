import { Platform } from 'react-native';

const lankaLottoBlue = '#0B1E36';   
const lankaLottoGold = '#FFB800';   
const lankaLottoOrange = '#FF7A00'; 

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F5F7FA',          
    tint: lankaLottoBlue,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: lankaLottoBlue,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0B1E36',        
    tint: lankaLottoGold,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: lankaLottoGold,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const API_URL = 'https://lottery-backend-ld1c.onrender.com/api';
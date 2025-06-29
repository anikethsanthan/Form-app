import { useRef } from 'react';
import Toast from 'react-native-toast-message';

const useToast = () => {
    const toastRef = useRef(null);

    const showToast = (type: 'success' | 'error' | 'info', text1: string, text2?: string) => {
        Toast.show({
            type,
            text1,
            text2,
            position: 'top',
            text1Style: {
                fontSize: 14,
                fontWeight: 'bold',
            },
            text2Style: {
                fontSize: 13,
            },
        });
    };

    return {
        showToast,
        toastRef,
    };
};

export default useToast;

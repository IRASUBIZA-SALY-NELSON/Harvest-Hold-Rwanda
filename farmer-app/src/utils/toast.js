import Toast from 'react-native-toast-message'

export function toastSuccess(title, message) {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 2800,
  })
}

export function toastError(title, message) {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3500,
  })
}

export function toastInfo(title, message) {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 2500,
  })
}
